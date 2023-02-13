using AutoMapper;
using HostMusic.Identity.Core.Models.Requests;
using HostMusic.Identity.Core.Models.Responses;
using HostMusic.Identity.Data.Entities;

namespace HostMusic.Identity.Core
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Account, AccountResponse>();

            CreateMap<Account, LoginResponse>();

            CreateMap<RegisterRequest, Account>();
            
            CreateMap<CreateRequest, Account>();

            CreateMap<UpdateRequest, Account>();

            CreateMap<UpdateByAdminRequest, Account>();
        }
    }
}