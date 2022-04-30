using HostMusic.Releases.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace HostMusic.Releases.Data
{
    public class ReleasesContext : DbContext
    {
        public DbSet<Release> Releases { get; set; } = null!;
        public DbSet<Track> Tracks { get; set; } = null!;

        private readonly IConfiguration _configuration;

        public ReleasesContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseNpgsql(_configuration.GetConnectionString("sqlConnection"));
        }
    }
}