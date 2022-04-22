using HostMusic.Identity.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace HostMusic.Identity.Data
{
    public class IdentityContext : DbContext
    {
        public DbSet<Account> Accounts { get; set; } = null!;

        private readonly IConfiguration _configuration;

        public IdentityContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseNpgsql(_configuration.GetConnectionString("sqlConnection"));
        }
    }
}