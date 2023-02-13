using HostMusic.Identity.Core.Enums;
using HostMusic.Identity.Data;
using HostMusic.Identity.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HostMusic.Identity.App.Controllers;

[ApiController]
[Route("[controller]")]
public class SeedController : ControllerBase
{
    private readonly RoleManager<IdentityRole<int>> _roleManager;
    private readonly UserManager<Account> _userManager;
    private readonly IConfiguration _configuration;
    private readonly IdentityContext _context;

    public SeedController(RoleManager<IdentityRole<int>> roleManager, UserManager<Account> userManager,
        IConfiguration configuration, IdentityContext context)
    {
        _roleManager = roleManager;
        _userManager = userManager;
        _configuration = configuration;
        _context = context;
    }

    /// <summary>
    /// Create default roles and users. Don't forget off password validations in Startup.cs
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> CreateDefaultUsersAndRoles()
    {
        var userRole = Role.User.ToString();
        var moderatorRole = Role.Moderator.ToString();
        var adminRole = Role.Admin.ToString();
        
        if (await _roleManager.FindByNameAsync(userRole) == null)
        {
            await _roleManager.CreateAsync(new IdentityRole<int>(userRole));
        }

        if (await _roleManager.FindByNameAsync(moderatorRole) == null)
        {
            await _roleManager.CreateAsync(new IdentityRole<int>(moderatorRole));
        }
        
        if (await _roleManager.FindByNameAsync(adminRole) == null)
        {
            await _roleManager.CreateAsync(new IdentityRole<int>(adminRole));
        }
        
        var addedUserList = new List<Account>();
        if (await _userManager.FindByNameAsync(_configuration["DefaultUsers:Admin:Email"]) == null)
        {
            var user = new Account
            {
                Nickname = _configuration["DefaultUsers:Admin:Email"],
                UserName = _configuration["DefaultUsers:Admin:Email"],
                Email = _configuration["DefaultUsers:Admin:Email"],
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, _configuration["DefaultUsers:Admin:Password"]);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, adminRole);
                user.EmailConfirmed = true;
                user.LockoutEnabled = false;
                addedUserList.Add(user);
            }
        }

        if (await _userManager.FindByNameAsync(_configuration["DefaultUsers:Moderator:Email"]) == null)
        {
            var user = new Account
            {
                Nickname = _configuration["DefaultUsers:Moderator:Email"],
                UserName = _configuration["DefaultUsers:Moderator:Email"],
                Email = _configuration["DefaultUsers:Moderator:Email"],
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, _configuration["DefaultUsers:Moderator:Password"]);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, moderatorRole);
                user.EmailConfirmed = true;
                user.LockoutEnabled = false;
                addedUserList.Add(user);
            }
        }
        
        if (await _userManager.FindByNameAsync(_configuration["DefaultUsers:User:Email"]) == null)
        {
            var user = new Account
            {
                Id = default,
                Nickname = _configuration["DefaultUsers:User:Email"],
                UserName = _configuration["DefaultUsers:User:Email"],
                Email = _configuration["DefaultUsers:User:Email"],
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, _configuration["DefaultUsers:User:Password"]);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, userRole);
                user.EmailConfirmed = true;
                user.LockoutEnabled = false;
                addedUserList.Add(user);
            }
        }
        
        if (addedUserList.Count > 0)
            await _context.SaveChangesAsync();
        
        return Ok();
    }
}