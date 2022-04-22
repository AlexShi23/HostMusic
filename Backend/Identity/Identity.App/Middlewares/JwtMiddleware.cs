using System.Linq;
using System.Threading.Tasks;
using HostMusic.Identity.Core;
using HostMusic.Identity.Core.Jwt;
using HostMusic.Identity.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace HostMusic.Identity.App.Middlewares
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IdentitySettings _settings;

        public JwtMiddleware(RequestDelegate next, IOptions<IdentitySettings> settings)
        {
            _next = next;
            _settings = settings.Value;
        }

        public async Task Invoke(HttpContext context, IdentityContext dataContext, IJwtUtils jwtUtils)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            var accountId = jwtUtils.ValidateJwtToken(token);
            if (accountId != null)
            {
                context.Items["Account"] = await dataContext.Accounts.FindAsync(accountId.Value);
            }

            await _next(context);
        }
    }
}