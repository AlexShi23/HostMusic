using System.Reflection;

namespace HostMusic.Releases.App
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            var config = new ConfigurationBuilder()
                .AddCommandLine(args)
                .AddUserSecrets(Assembly.GetExecutingAssembly(), true)
                .AddJsonFile($"appsettings.{environment}.json",
                    true, true)
                .Build();
            
            return Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(x =>
                {
                    x.UseConfiguration(config);
                    x.UseStartup<Startup>();
                });
        }
    }
}