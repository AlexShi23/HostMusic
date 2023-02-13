using AutoMapper;
using HostMusic.Identity.Core.Exceptions;
using HostMusic.Identity.Core.Models.Requests;
using HostMusic.Identity.Core.Models.Responses;
using HostMusic.Identity.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HostMusic.Identity.Core.Services;

public class AccountService : IAccountService
{
    private readonly UserManager<Account> _userManager;
    private readonly IMapper _mapper;

    public AccountService(
        UserManager<Account> userManager,
        IMapper mapper)
    {
        _userManager = userManager;
        _mapper = mapper;
    }

    public async Task<IEnumerable<AccountResponse>> GetAllAccounts()
    {
        return await _userManager.Users
            .Select(x => _mapper.Map<AccountResponse>(x))
            .ToListAsync();
    }

    public async Task<AccountResponse> GetAccount(int id)
    {
        var account = await _userManager.FindByIdAsync(id.ToString());
        var response = _mapper.Map<AccountResponse>(account);
        response.Role = (await _userManager.GetRolesAsync(account)).First();
        return response;
    }

    public async Task CreateAccount(CreateRequest request)
    {
        var account = _mapper.Map<Account>(request);
        account.UserName = request.Email;
        var result = await _userManager.CreateAsync(account);
        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(account, request.Role);
            return;
        }

        throw new AppException("Error on account creating");
    }

    public async Task<AccountResponse> UpdateAccount(int id, UpdateRequest request)
    {
        var account = await _userManager.FindByIdAsync(id.ToString());
        if (account == null)
        {
            throw new AppException("Account does not exist");
        }

        account.Nickname = request.Nickname;
        account.Email = request.Email;
        var result = await _userManager.UpdateAsync(account);
        if (result.Succeeded)
        {
            return _mapper.Map<AccountResponse>(account);
        }

        throw new AppException("Error on account updating");
    }

    public async Task<AccountResponse> UpdateAccountByAdmin(int id, UpdateByAdminRequest request)
    {
        var account = await _userManager.FindByIdAsync(id.ToString());
        if (account == null)
        {
            throw new AppException("Account does not exist");
        }

        account.Nickname = request.Nickname;
        account.Email = request.Email;
        var result = await _userManager.UpdateAsync(account);
        if (result.Succeeded)
        {
            if (!await _userManager.IsInRoleAsync(account, request.Role))
            {
                await _userManager.RemoveFromRoleAsync(account, 
                    (await _userManager.GetRolesAsync(account)).First());
                await _userManager.AddToRoleAsync(account, request.Role);
            }
            
            return _mapper.Map<AccountResponse>(account);
        }

        throw new AppException("Error on account updating");
    }

    public async Task DeleteAccount(int id)
    {
        var account = await _userManager.FindByIdAsync(id.ToString());
        if (account == null)
        {
            throw new AppException("Account does not exist");
        }

        await _userManager.DeleteAsync(account);
    }
}