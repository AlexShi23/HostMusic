using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json.Serialization;
using HostMusic.Releases.Core;
using HostMusic.Releases.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;
using tusdotnet;
using tusdotnet.Interfaces;
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

            app.UseCors(builder => builder
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin()
                .WithExposedHeaders(tusdotnet.Helpers.CorsHelper.GetExposedHeaders())
            );
            
            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
                RequestPath = new PathString("/Resources")
            });
            
            app.UseTus(httpContext => new DefaultTusConfiguration
            {
                Store = new TusDiskStore(Path.Combine(Directory.GetCurrentDirectory(), "Resources", "files")),
                UrlPath = "/upload",
                MaxAllowedUploadSizeInBytes = 100 * 1024 * 1024,
                MaxAllowedUploadSizeInBytesLong = 100 * 1024 * 1024,
                Events = new Events
                {
                    OnFileCompleteAsync = async eventContext =>
                    {
                        var file = await eventContext.GetFileAsync();

                        var metadata = await file.GetMetadataAsync(eventContext.CancellationToken);
                        var fileName = file.Id + "." + metadata["filename"].GetString(System.Text.Encoding.UTF8).Split(".").Last();

                        await using (var createdFile = File.Create(Path.Combine(
                                         Directory.GetCurrentDirectory(), "Resources", fileName)))
                        await using (var stream = await file.GetContentAsync(eventContext.CancellationToken))
                        {
                            await stream.CopyToAsync(createdFile);
                        }

                        var terminationStore = (ITusTerminationStore)eventContext.Store;
                        await terminationStore.DeleteFileAsync(file.Id, eventContext.CancellationToken);
                    }
                }
            });

            app.UseEndpoints(x => x.MapControllers());
        }
    }
}