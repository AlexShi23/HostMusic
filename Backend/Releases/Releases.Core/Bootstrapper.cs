using HostMusic.Releases.Core.Services;
using Microsoft.Extensions.DependencyInjection;

namespace HostMusic.Releases.Core
{
    public static class Bootstrapper
    {
        public static IServiceCollection AddCore(this IServiceCollection services)
        {
            services.AddScoped<IReleaseService, ReleaseService>();
            return services;
        }
    }
}