using HostMusic.Identity.Core.Jwt;
using HostMusic.Identity.Core.Services;
using Microsoft.Extensions.DependencyInjection;

namespace HostMusic.Identity.Core
{
    public static class Bootstrapper
    {
        public static IServiceCollection AddCore(this IServiceCollection services)
        {
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IJwtUtils, JwtUtils>();
            return services;
        }
    }
}