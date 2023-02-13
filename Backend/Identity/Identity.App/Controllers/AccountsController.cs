using HostMusic.Identity.Core.Models.Requests;
using HostMusic.Identity.Core.Models.Responses;
using HostMusic.Identity.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HostMusic.Identity.App.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountsController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        /// <summary>
        /// Get all users
        /// </summary>
        /// <returns>The list of users.</returns>
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccountResponse>>> GetAll()
        {
            var accounts = await _accountService.GetAllAccounts();
            return Ok(accounts);
        }
        
        /// <summary>
        /// Gets the user by id
        /// </summary>
        /// <returns>The one user.</returns>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<AccountResponse>> GetAccount(int id)
        {
            var response = await _accountService.GetAccount(id);
            return Ok(response);
        }
        
        /// <summary>
        /// Create new user
        /// </summary>
        /// <returns>The account data.</returns>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateAccount(CreateRequest createRequest)
        {
            await _accountService.CreateAccount(createRequest);
            return Ok();
        }
        
        /// <summary>
        /// Update account data
        /// </summary>
        /// <returns>New account data.</returns>
        [HttpPatch("{id:int}")]
        public async Task<ActionResult<AccountResponse>> UpdateAccount(int id, UpdateRequest updateRequest)
        {
            var response = await _accountService.UpdateAccount(id, updateRequest);
            return Ok(response);
        }
        
        /// <summary>
        /// Update account data (by admin)
        /// </summary>
        /// <returns>New account data.</returns>
        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<ActionResult<AccountResponse>> UpdateAccountByAdmin(int id, UpdateByAdminRequest updateRequest)
        {
            var response = await _accountService.UpdateAccountByAdmin(id, updateRequest);
            return Ok(response);
        }

        /// <summary>
        /// Delete user
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            await _accountService.DeleteAccount(id);
            return Ok();
        }
    }
}