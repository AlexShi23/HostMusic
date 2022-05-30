using System;
using System.IO;
using System.Reflection;
using System.Text.Json.Serialization;
using HostMusic.Releases.Core;
using HostMusic.Releases.Core.Services;
using HostMusic.Releases.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using tusdotnet;
using tusdotnet.Models;
using tusdotnet.Models.Configuration;
using tusdotnet.Stores;

namespace HostMusic.Releases.App
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));
            
            services.AddData();
            services.AddHttpClient();
            services.AddCors();
            services.AddControllers().AddJsonOptions(x =>
            {
                x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "HostMusic Releases API",
                    Description = "Web API to operate with music releases"
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });
            
            services.AddCore();
        }
        
        public void Configure(IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(x => x.SwaggerEndpoint("/swagger/v1/swagger.json", "HostMusic Releases API"));
            app.UseRouting();
            
            app.UseTus(httpContext => new DefaultTusConfiguration
            {
                Store = new TusDiskStore(@$"{Configuration.GetSection("AppConfig").GetValue<string>("FileSavePath")}\files\"),
                UrlPath = "/upload",
                MaxAllowedUploadSizeInBytes = 100 * 1024 * 1024,
                MaxAllowedUploadSizeInBytesLong = 100 * 1024 * 1024,
                Events = new Events
                {
                    OnFileCompleteAsync = async eventContext =>
                    {
                        var fileSaveService = httpContext.RequestServices.GetService<FileSaveService>();
                        await fileSaveService.SaveFileUsingTus(eventContext);
                    }
                }
            });
            
            app.UseCors(x => x
                .SetIsOriginAllowed(origin => true)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());

            app.UseEndpoints(x => x.MapControllers());
        }
    }
}