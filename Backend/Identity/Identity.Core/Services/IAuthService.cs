using HostMusic.Identity.Core.Models.Requests;
using HostMusic.Identity.Core.Models.Responses;

namespace HostMusic.Identity.Core.Services;

public interface IAuthService
{
    Task<LoginResponse> Login(LoginRequest request, string ipAddress);
    Task Register(RegisterRequest request, string origin);
    Task VerifyEmail(VerifyEmailRequest request);
    Task ForgotPassword(ForgotPasswordRequest request, string origin);
    Task ValidateResetToken(ValidateResetTokenRequest request);
    Task ResetPassword(ResetPasswordRequest request);
    Task ChangePassword(string email, string password);
    Task<LoginResponse> RefreshToken(string token, string ipAddress);
    Task RevokeToken(string token, string ipAddress);
}