using HostMusic.Identity.Core.Models.Requests;
using HostMusic.Identity.Core.Models.Responses;

namespace HostMusic.Identity.Core.Services;

public interface IAccountService
{
    Task<IEnumerable<AccountResponse>> GetAllAccounts();
    Task<AccountResponse> GetAccount(int id);
    Task CreateAccount(CreateRequest request);
    Task<AccountResponse> UpdateAccount(int id, UpdateRequest request);
    Task<AccountResponse> UpdateAccountByAdmin(int id, UpdateByAdminRequest request);
    Task DeleteAccount(int id);
}