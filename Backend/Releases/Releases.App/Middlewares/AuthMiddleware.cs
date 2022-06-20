using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using HostMusic.Releases.App.Authorization;
using Microsoft.AspNetCore.Http;
using RestSharp;

namespace HostMusic.Releases.App.Middlewares
{
    public class AuthMiddleware
    {
        private readonly RequestDelegate _next;

        public AuthMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var client = new RestClient("https://localhost:5001/Accounts/current-account/");
            var request = new RestRequest();
            request.AddHeader("Authorization", context.Request.Headers["Authorization"]);
            var response = await client.PostAsync(request);
            var accountDto = client.Deserialize<AccountDto>(response).Data;
            var account = new Account
            {
                Id = accountDto.Id,
                FirstName = accountDto.FirstName,
                LastName = accountDto.LastName,
                Email = accountDto.Email,
                Created = accountDto.Created,
                IsVerified = accountDto.IsVerified,
                Updated = accountDto.Updated,
                Role = accountDto.Role.ToLower() == "admin" ? Role.Admin : Role.User
            };
            context.Items["Account"] = account;

            await _next(context);
        }
    }
}