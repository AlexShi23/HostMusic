﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
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
    public class ReleasesController : ControllerBase
    {
        private readonly IReleaseService _releaseService;

        public ReleasesController(IReleaseService releaseService)
        {
            _releaseService = releaseService;
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
        /// Get release by id
        /// </summary>
        /// <returns>One release.</returns>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ReleaseResponse>> GetById(Guid id)
        {
            var release = await _releaseService.GetById(id);
            if (release.OwnerId == Account.Id || Account.Role == Role.Admin)
                return Ok(release);
            return Unauthorized(new { message = "Unauthorized" });
        }
        
        /// <summary>
        /// Get all releases of user
        /// </summary>
        /// <returns>List of the releases.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReleaseResponse>>> GetAll()
        {
            var releases = await _releaseService.GetAll(Account.Id);
            return Ok(releases);
        }

        /// <summary>
        /// Create new release
        /// </summary>
        [HttpPost]
        public IActionResult Create(CreateReleaseRequest request)
        {
            _releaseService.Create(request, Account.Id);
            return Ok(new { message = "Release created successfully" });
        }

        /// <summary>
        /// Update release
        /// </summary>
        [HttpPut("{id:guid}")]
        public IActionResult Update(Guid id, UpdateReleaseRequest request)
        {
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
            if (release.OwnerId != Account.Id && Account.Role != Role.Admin)
                return Unauthorized(new { message = "Unauthorized" });
            
            await _releaseService.Delete(id);
            return Ok(new { message = "Release deleted successfully" });;
        }
    }
}