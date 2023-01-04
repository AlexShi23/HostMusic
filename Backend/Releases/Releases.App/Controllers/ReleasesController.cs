using HostMusic.Releases.App.Authorization;
using HostMusic.Releases.Core.Models;
using HostMusic.Releases.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace HostMusic.Releases.App.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReleasesController : ControllerBase
    {
        private readonly IReleaseService _releaseService;

        public ReleasesController(IReleaseService releaseService)
        {
            _releaseService = releaseService;
        }

        public Account Account => (Account)HttpContext.Items["Account"];

        /// <summary>
        /// Get release by id
        /// </summary>
        /// <returns>One release.</returns>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ReleaseResponse>> GetById(Guid id)
        {
            var release = await _releaseService.GetById(id);
            if (release == null)
                return NotFound(new { message = "Release not found" });
            if (release.OwnerId == Account.Id || Account.Role is Role.Admin or Role.Moderator)
                return Ok(release);
            return Unauthorized(new { message = "Unauthorized" });
        }
        
        /// <summary>
        /// Get all releases of user 
        /// </summary>
        /// <returns>Page with list of the releases.</returns>
        [HttpGet("all/{page:int}")]
        public async Task<ActionResult<ReleasesPageResponse>> GetAll(int page)
        {
            var releases = await _releaseService.GetAll(Account.Id, page);
            return Ok(releases);
        }

        /// <summary>
        /// Create new release
        /// </summary>
        [HttpPost]
        public ActionResult<Guid> Create(CreateReleaseRequest request)
        {
            var releaseId = _releaseService.Create(request, Account.Id);
            return Ok(releaseId);
        }

        /// <summary>
        /// Update release
        /// </summary>
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateReleaseRequest request)
        {
            var release = await _releaseService.GetById(id);
            var validation = ValidateResponse(release);
            if (validation != null)
                return validation;
            
            _releaseService.Update(id, request);
            return Ok(new { message = "Release updated successfully" });
        }

        /// <summary>
        /// Delete release
        /// </summary>
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var release = await _releaseService.GetById(id);
            var validation = ValidateResponse(release);
            if (validation != null)
                return validation;
            
            await _releaseService.Delete(id);
            return Ok(new { message = "Release deleted successfully" });
        }
        
        /// <summary>
        /// Search releases
        /// </summary>
        [HttpGet("search")]
        public async Task<ActionResult<ReleasesPageResponse>> Search([FromQuery] string query, [FromQuery] int page)
        {
            var releases = await _releaseService.Search(query, Account.Id, page);
            return Ok(releases);
        }
        
        /// <summary>
        /// Moderate release
        /// </summary>
        [HttpPatch("{id:guid}/moderate")]
        public async Task<IActionResult> ModerateRelease(Guid id, ModerationRequest request)
        {
            await _releaseService.Moderate(id, request);
            return Ok(new { message = "Release moderated successfully" });
        }

        /// <summary>
        /// Get all releases on moderation
        /// </summary>
        [HttpGet("moderation/{page:int}")]
        public async Task<ActionResult<ReleasesPageResponse>> GetAllOnModeration(int page)
        {
            var releases = await _releaseService.GetAllOnModeration(page);
            return Ok(releases);
        }

        private IActionResult? ValidateResponse(ReleaseResponse? release)
        {
            if (release == null)
                return NotFound(new { message = "Release not found" });
            if (release.OwnerId != Account.Id && Account.Role is Role.User)
                return StatusCode(StatusCodes.Status403Forbidden);
            return null;
        }
    }
}