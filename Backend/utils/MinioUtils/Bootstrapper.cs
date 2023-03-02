using HostMusic.MinioUtils.Provider;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Minio;

namespace HostMusic.MinioUtils;

public static class Bootstrapper
{
    public static IServiceCollection AddMinio(this IServiceCollection services, IConfiguration configuration)
    {
        var config = configuration.GetSection("S3");
        services.Configure<MinioOptions>(config);

        services.AddSingleton(provider =>
        {
            var options = provider.GetRequiredService<IOptions<MinioOptions>>().Value;
            var client = new MinioClient()
                .WithEndpoint(options.ServiceUrl.Split('/').Last())
                .WithCredentials(options.AccessKey, options.SecretKey)
                .WithRegion("us-east-1")
                .WithSSL()
                .Build();
            return client;
        });
        services.AddSingleton<IMinioProvider, MinioProvider>();
        return services;
    }
}