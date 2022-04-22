using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace SmtpUtils
{
    public static class Bootstrapper
    {
        public static IServiceCollection AddSmtp(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<SmtpOptions>(config.GetSection("Smtp"));
            services.AddSingleton(provider =>
            {
                var options = provider.GetRequiredService<IOptions<SmtpOptions>>().Value;
                var client = new SmtpClient();
                client.Connect(options.Address, options.Port);
                client.Authenticate(options.Username, options.Password);
                return client;
            });
            services.AddSingleton<ISmtpProvider, SmtpProvider>();
            return services;
        }
    }
}