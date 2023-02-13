using System.Security.Claims;
using HostMusic.Identity.App.Authorization;
using HostMusic.Identity.Core.Models.Requests;
using HostMusic.Identity.Core.Models.Responses;
using HostMusic.Identity.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace HostMusic.Identity.App.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AccountResponse>> Login(LoginRequest request)
    {
        var response = await _authService.Login(request, IpAddress());
        SetTokenCookie(response.RefreshToken!);
        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        await _authService.Register(request, Request.Headers["origin"]);
        return Ok();
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail(VerifyEmailRequest request)
    {
        await _authService.VerifyEmail(request);
        return Ok(new { message = "Verification successful, you can now login" });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
    {
        await _authService.ForgotPassword(request, Request.Headers["origin"]);
        return Ok(new { message = "Please check your email for password reset instructions" });
    }
    
    [AllowAnonymous]
    [HttpPost("validate-reset-token")]
    public async Task<IActionResult> ValidateResetToken(ValidateResetTokenRequest request)
    {
        await _authService.ValidateResetToken(request);
        return Ok(new { message = "Token is valid" });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        await _authService.ResetPassword(request);
        return Ok(new { message = "Password reset successful, you can now login" });
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        if (HttpContext.User.Identity is not { IsAuthenticated: true })
            return Unauthorized();
        
        var email = HttpContext.User.Claims.First(x => x.Type == ClaimTypes.Email).Value;
        await _authService.ChangePassword(email, request.Password);
        return Ok(new { message = "Password changed successful, you can now login" });
    }

    [AllowAnonymous]
    [HttpPost("refresh-token")]
    public async Task<ActionResult<LoginResponse>> RefreshToken()
    {
        var refreshToken = HttpContext.Request.Cookies["refreshToken"]!;
        var response = await _authService.RefreshToken(refreshToken, IpAddress());
        SetTokenCookie(response.RefreshToken!);
        return Ok(response);
    }

    [HttpPost("revoke-token")]
    public async Task<IActionResult> RevokeToken()
    {
        var token = HttpContext.Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(token))
            return BadRequest(new { message = "Token is required" });

        await _authService.RevokeToken(token, IpAddress());
        return Ok(new { message = "Token revoked" });
    }

    private void SetTokenCookie(string token)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        Response.Cookies.Append("refreshToken", token, cookieOptions);
    }

    private string IpAddress()
    {
        if (Request.Headers.ContainsKey("X-Forwarded-For"))
            return Request.Headers["X-Forwarded-For"];
        return HttpContext.Connection.RemoteIpAddress!.MapToIPv4().ToString();
    }
}