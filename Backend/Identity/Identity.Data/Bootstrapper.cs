using Microsoft.Extensions.DependencyInjection;

namespace HostMusic.Identity.Data
{
    public static class Bootstrapper
    {
        public static IServiceCollection AddData(this IServiceCollection services)
        {
            services.AddDbContext<IdentityContext>();
            return services;
        }
    }
}