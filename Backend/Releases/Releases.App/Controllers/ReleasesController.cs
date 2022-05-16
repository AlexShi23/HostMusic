using HostMusic.Releases.App.Authorization;
using HostMusic.Releases.Core.Models;
using HostMusic.Releases.Core.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HostMusic.Releases.App.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ReleasesController : ControllerBase
    {
        private readonly IReleaseService _releaseService;

        public ReleasesController(IReleaseService releaseService)
        {
            _releaseService = releaseService;
        }
        public Account Account => (Account)HttpContext.Items["Account"];

        [HttpGet("{id:guid}")]
        public ActionResult<ReleaseResponse> GetById(Guid id)
        {
            var release = _releaseService.GetById(id);
            if (release.OwnerId == Account.Id || Account.Role == Role.Admin)
                return Ok(release);
            return Unauthorized(new { message = "Unauthorized" });
        }
        
        [HttpGet]
        public ActionResult<IEnumerable<ReleaseResponse>> GetAll()
        {
            var releases = _releaseService.GetAll(Account.Id);
            return Ok(releases);
        }

        [HttpPost]
        public IActionResult Create(CreateReleaseRequest request)
        {
            _releaseService.Create(request);
            return Ok(new { message = "Release created successfully" });
        }

        [HttpPut("{id:guid}")]
        public IActionResult Update(Guid id, UpdateReleaseRequest request)
        {
            _releaseService.Update(id, request);
            return Ok(new { message = "Release update successfully" });
        }

        [HttpDelete("{id:guid}")]
        public IActionResult Delete(Guid id)
        {
            var release = _releaseService.GetById(id);
            if (release.OwnerId != Account.Id && Account.Role != Role.Admin)
                return Unauthorized(new {message = "Unauthorized"});
            
            _releaseService.Delete(id);
            return Ok(new { message = "Account deleted successfully" });;
        }
    }
}