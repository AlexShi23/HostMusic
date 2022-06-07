﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HostMusic.Releases.Core.Models;

namespace HostMusic.Releases.Core.Services
{
    public interface IReleaseService
    {
        void Create(CreateReleaseRequest request, int creatorId);
        Task<IEnumerable<ReleaseResponse>> GetAll(int ownerId);
        Task<ReleaseResponse> GetById(Guid id);
        void Update(Guid id, UpdateReleaseRequest request);
        Task Delete(Guid id);
    }
}