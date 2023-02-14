using HostMusic.Identity.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace HostMusic.Identity.Data
{
    public class IdentityContext : IdentityDbContext<Account, IdentityRole<int>, int>
    {
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