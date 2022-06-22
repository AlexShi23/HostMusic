using Microsoft.Extensions.DependencyInjection;

namespace HostMusic.Releases.Data
{
    public static class Bootstrapper
    {
        public static IServiceCollection AddData(this IServiceCollection services)
        {
            services.AddDbContext<ReleasesContext>();
            return services;
        }
    }
}