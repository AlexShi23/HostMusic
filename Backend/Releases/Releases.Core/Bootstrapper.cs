using System;
using HostMusic.Releases.Core.Services;
using Microsoft.Extensions.DependencyInjection;

namespace HostMusic.Releases.Core
{
    public static class Bootstrapper
    {
        public static IServiceCollection AddCore(this IServiceCollection services)
        {
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.AddScoped<IReleaseService, ReleaseService>();
            services.AddScoped<ITrackService, TrackService>();
            services.AddScoped<IFileSaveService, FileSaveService>();
            return services;
        }
    }
}