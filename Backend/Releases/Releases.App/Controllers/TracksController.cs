using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HostMusic.Releases.App.Authorization;
using HostMusic.Releases.Core.Models;
using HostMusic.Releases.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace HostMusic.Releases.App.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TracksController : ControllerBase
    {
        private readonly ITrackService _trackService;

        public TracksController(ITrackService trackService)
        {
            _trackService = trackService;
        }
        
        public static Account Account => new()
        {
            Id = 1,
            Email = "123@mail.ru",
            FirstName = "aaa",
            LastName = "bbb",
            Role = Role.Admin
        };

        /// <summary>
        /// Get track by id
        /// </summary>
        /// <returns>One track.</returns>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TrackResponse>> GetById(Guid id)
        {
            var track = await _trackService.GetById(id);
            return Ok(track);
        }

        /// <summary>
        /// Get all tracks in release
        /// </summary>
        /// <returns>List of the tracks.</returns>
        [HttpGet("{releaseId:guid}")]
        public async Task<ActionResult<IEnumerable<TrackResponse>>> GetAllInRelease(Guid releaseId)
        {
            var tracks = await _trackService.GetAllInRelease(releaseId);
            return Ok(tracks);
        }

        /// <summary>
        /// Add new track
        /// </summary>
        [HttpPost]
        public IActionResult Create(Guid releaseId, CreateTrackRequest request)
        {
            _trackService.Create(releaseId, request, Account.Id);
            return Ok();
        }

        /// <summary>
        /// Update track
        /// </summary>
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateTrackRequest request)
        {
            var release = await _trackService.GetById(id);

            _trackService.Update(id, request);
            return Ok(new { message = "Track updated successfully" });
        }

        /// <summary>
        /// Delete track
        /// </summary>
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var release = await _trackService.GetById(id);

            await _trackService.Delete(id);
            return Ok(new { message = "Track deleted successfully" });;
        }
    }
}