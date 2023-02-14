using System.IdentityModel.Tokens.Jwt;
using AutoMapper;
using HostMusic.Identity.Core.Enums;
using HostMusic.Identity.Core.Exceptions;
using HostMusic.Identity.Core.Jwt;
using HostMusic.Identity.Core.Models.Requests;
using HostMusic.Identity.Core.Models.Responses;
using HostMusic.Identity.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using SmtpUtils;

namespace HostMusic.Identity.Core.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<Account> _userManager;
    private readonly JwtHandler _jwtHandler;
    private readonly IMapper _mapper;
    private readonly IPasswordValidator<Account> _passwordValidator;
    private readonly IPasswordHasher<Account> _passwordHasher;
    private readonly IConfiguration _configuration;
    private readonly ISmtpProvider _smtpProvider;

    public AuthService(
        UserManager<Account> userManager,
        JwtHandler jwtHandler,
        IMapper mapper,
        IPasswordValidator<Account> passwordValidator,
        IPasswordHasher<Account> passwordHasher,
        IConfiguration configuration,
        ISmtpProvider smtpProvider)
    {
        _userManager = userManager;
        _jwtHandler = jwtHandler;
        _mapper = mapper;
        _passwordValidator = passwordValidator;
        _passwordHasher = passwordHasher;
        _smtpProvider = smtpProvider;
        _configuration = configuration;
    }
    
    public async Task<LoginResponse> Login(LoginRequest request, string ipAddress)
    {
        var account = await _userManager.FindByEmailAsync(request.Email);

        if (account == null || !await _userManager.CheckPasswordAsync(account, request.Password))
            throw new AppException("Email or password is incorrect");

        var securityToken = await _jwtHandler.GetTokenAsync(account);
        var jwtToken = new JwtSecurityTokenHandler().WriteToken(securityToken);
        var refreshToken = _jwtHandler.GenerateRefreshToken(ipAddress);
        account.RefreshTokens.Add(refreshToken);
        await _userManager.UpdateAsync(account);
        RemoveOldRefreshTokens(account);

        var response = _mapper.Map<LoginResponse>(account);
        response.JwtToken = jwtToken;
        response.RefreshToken = refreshToken.Token;
        response.Role = (await _userManager.GetRolesAsync(account)).First();
        return response;
    }

    public async Task Register(RegisterRequest request, string origin)
    {
        var existingAccount = await _userManager.FindByEmailAsync(request.Email);

        if (existingAccount != null)
        {
            throw new AppException("Email already exist");
        }

        var account = new Account { Email = request.Email, UserName = request.Email, Nickname = request.Nickname };
        var isCreated = await _userManager.CreateAsync(account, request.Password);
        if (isCreated.Succeeded)
        {
            await _userManager.AddToRoleAsync(account, Role.User.ToString());
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(account);
            
            await SendVerificationEmail(account.Email, token, account.Id, origin);
            
            return;
        }

        throw new AppException("Error on registration");
    }

    public async Task VerifyEmail(VerifyEmailRequest request)
    {
        var account = await _userManager.FindByIdAsync(request.AccountId.ToString());
        if (account == null)
        {
            throw new AppException("Account for confirmation doesn't exist");
        }
        
        var result = await _userManager.ConfirmEmailAsync(account, request.Token.Replace(' ', '+'));
        if (result.Succeeded)
        {
            return;
        }

        throw new AppException("Error on email confirmation");
    }

    public async Task ForgotPassword(ForgotPasswordRequest request, string origin)
    {
        var account = await _userManager.FindByEmailAsync(request.Email);
        if (account == null || !await _userManager.IsEmailConfirmedAsync(account))
        {
            return;
        }
 
        var token = await _userManager.GeneratePasswordResetTokenAsync(account);

        await SendPasswordResetEmail(account.Email, token, account.Id, origin);
    }

    public async Task ValidateResetToken(ValidateResetTokenRequest request)
    {
        var account = await _userManager.FindByIdAsync(request.AccountId.ToString());
        if (account == null)
        {
            throw new AppException("Account for confirmation doesn't exist");
        }
        
        var response = await _userManager.VerifyUserTokenAsync(account,
            _userManager.Options.Tokens.PasswordResetTokenProvider, "ResetPassword",
            request.Token.Replace(' ', '+'));
        if (!response)
        {
            throw new AppException("Invalid token");
        }
    }

    public async Task ResetPassword(ResetPasswordRequest request)
    {
        var account = await _userManager.FindByIdAsync(request.AccountId.ToString());
        if (account == null)
        {
            throw new AppException("Account for confirmation doesn't exist");
        }
        var result = await _userManager.ResetPasswordAsync(account, request.Token.Replace(' ', '+'), request.Password);
        if (result.Succeeded)
        {
            return;
        }
        
        throw new AppException("Error on reset password");
    }

    public async Task ChangePassword(string email, string password)
    {
        var account = await _userManager.FindByEmailAsync(email);
        if (account != null)
        {
            var result =
                await _passwordValidator.ValidateAsync(_userManager, account, password);
            if (result.Succeeded)
            {
                account.PasswordHash = _passwordHasher.HashPassword(account, password);
                await _userManager.UpdateAsync(account);
            }
            
            throw new AppException("Error on change password");
        }
    }

    public async Task<LoginResponse> RefreshToken(string token, string ipAddress)
    {
        var account = GetAccountByRefreshToken(token);
        var refreshToken = account.RefreshTokens.Single(x => x.Token == token);

        if (refreshToken.IsRevoked)
        {
            RevokeDescendantRefreshTokens(refreshToken, account, ipAddress,
                $"Attempted reuse of revoked ancestor token: {token}");
            await _userManager.UpdateAsync(account);
        }

        if (!refreshToken.IsActive)
            throw new AppException("Invalid token");
            
        var newRefreshToken = RotateRefreshToken(refreshToken, ipAddress);
        account.RefreshTokens.Add(newRefreshToken);
            
        RemoveOldRefreshTokens(account);

        await _userManager.UpdateAsync(account);

        var securityToken = await _jwtHandler.GetTokenAsync(account);
            
        var response = _mapper.Map<LoginResponse>(account);
        response.JwtToken = new JwtSecurityTokenHandler().WriteToken(securityToken);
        response.RefreshToken = newRefreshToken.Token;
        response.Role = (await _userManager.GetRolesAsync(account)).First();
        return response;
    }

    public async Task RevokeToken(string token, string ipAddress)
    {
        var account = GetAccountByRefreshToken(token);
        var refreshToken = account.RefreshTokens.Single(x => x.Token == token);

        if (!refreshToken.IsActive)
            throw new AppException("Invalid token");
            
        RevokeRefreshToken(refreshToken, ipAddress, "Revoked without replacement");
        await _userManager.UpdateAsync(account);
    }
    
    private Account GetAccountByRefreshToken(string token)
    {
        var account = _userManager.Users
            .SingleOrDefault(u => u.RefreshTokens.Any(t => t.Token == token));
        if (account == null)
            throw new AppException("Invalid token");
        return account;
    }
    
    private RefreshToken RotateRefreshToken(RefreshToken refreshToken, string ipAddress)
    {
        var newRefreshToken = _jwtHandler.GenerateRefreshToken(ipAddress);
        RevokeRefreshToken(refreshToken, ipAddress, "Replaced by new token", newRefreshToken.Token);
        return newRefreshToken;
    }

    private void RemoveOldRefreshTokens(Account account)
    {
        account.RefreshTokens.RemoveAll(x =>
            !x.IsActive && x.CreatedOn.AddDays(
                Convert.ToDouble(_configuration["JwtSettings:ExpirationTimeInMinutes"])) <= DateTime.UtcNow);
    }

    private void RevokeDescendantRefreshTokens(RefreshToken refreshToken, Account account, string ipAddress,
        string? reason)
    {
        // рекурсивно пройти цепочку токенов обновления и убедиться, что все потомки отозваны
        if (!string.IsNullOrEmpty(refreshToken.ReplacedByToken))
        {
            var childToken = account.RefreshTokens
                .SingleOrDefault(x => x.Token == refreshToken.ReplacedByToken);
            if (childToken is { IsActive: true })
                RevokeRefreshToken(childToken, ipAddress, reason);
            else
                RevokeDescendantRefreshTokens(childToken, account, ipAddress, reason);
        }
    }

    private static void RevokeRefreshToken(RefreshToken token, string ipAddress, string? reason = null,
        string? replacedByToken = null)
    {
        token.RevokedOn = DateTime.UtcNow;
        token.RevokedByIp = ipAddress;
        token.ReasonRevoked = reason;
        token.ReplacedByToken = replacedByToken;
    }

    private async Task SendVerificationEmail(string email, string token, int id, string origin)
    {
        string message;
        if (!string.IsNullOrEmpty(origin))
        {
            var verifyUrl = $"{origin}/account/verify-email?token={token}&id={id}";
            message = $@"<p>Please click the below link to verify your email address:</p>
                            <p><a href=""{verifyUrl}"">{verifyUrl}</a></p>";
        }
        else
        {
            message =
                $@"<p>Please use the below token to verify your email address with the <code>/accounts/verify-email</code> api route:</p>
                            <p><code>{token}</code></p>";
        }

        await _smtpProvider.SendEmailAsync(
            email,
            "Sign-up Verification API - Verify Email",
            $@"<h4>Verify Email</h4>
                        <p>Thanks for registering!</p>
                        {message}"
        );
    }
    
    private async Task SendPasswordResetEmail(string email, string token, int id, string origin)
    {
        string message;
        if (!string.IsNullOrEmpty(origin))
        {
            var resetUrl = $"{origin}/account/reset-password?token={token}&id={id}";
            message =
                $@"<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                            <p><a href=""{resetUrl}"">{resetUrl}</a></p>";
        }
        else
        {
            message =
                $@"<p>Please use the below token to reset your password with the <code>/accounts/reset-password</code> api route:</p>
                            <p><code>{token}</code></p>";
        }

        await _smtpProvider.SendEmailAsync(
            email,
            "Sign-up Verification API - Reset Password",
            $@"<h4>Reset Password Email</h4>
                        {message}"
        );
    }
}