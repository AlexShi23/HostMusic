using Amazon.S3.Transfer;
using HostMusic.AmazonS3.Provider;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HostMusic.AmazonS3;

public static class Bootstrapper
{
    public static IServiceCollection AddAmazonS3(this IServiceCollection services, IConfiguration configuration)
    {
        var config = configuration.GetSection("S3");
        services.Configure<AmazonS3Options>(config);
        services.AddScoped<ITransferUtility, TransferUtility>();
        services.AddScoped<IAmazonS3Provider, AmazonS3Provider>();
        return services;
    }
}