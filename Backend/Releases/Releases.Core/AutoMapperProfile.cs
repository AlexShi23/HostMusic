using AutoMapper;
using HostMusic.Releases.Core.Models;
using HostMusic.Releases.Data.Entities;

namespace HostMusic.Releases.Core
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Release, ReleaseResponse>();
            CreateMap<CreateReleaseRequest, Release>();
            CreateMap<UpdateReleaseRequest, Release>()
                .ForAllMembers(x => x.Condition(
                    (src, dest, prop) =>
                    {
                        if (prop == null)
                            return false;
                        if (prop is string && string.IsNullOrEmpty((string)prop))
                            return false;
                        
                        return x.DestinationMember.Name != "Type" || src.Type != null;
                    }
                ));

            CreateMap<Track, TrackResponse>();
            CreateMap<CreateTrackRequest, Track>();
            CreateMap<UpdateTrackRequest, Track>();
        }
    }
}