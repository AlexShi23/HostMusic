using HostMusic.Identity.Core.Jwt;
using HostMusic.Identity.Core.Services;
using Microsoft.Extensions.DependencyInjection;
using SmtpUtils;

namespace HostMusic.Identity.Core
{
    public static class Bootstrapper
    {
        public static IServiceCollection AddCore(this IServiceCollection services)
        {
            services.AddScoped<JwtHandler>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IAccountService, AccountService>();
            return services;
        }
    }
}