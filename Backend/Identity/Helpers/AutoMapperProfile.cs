using AutoMapper;
using Identity.Entities;
using Identity.Models.Accounts;

namespace Identity.Helpers
{
    public class AutoMapperProfile : Profile
    {
        // mappings between model and entity objects
        public AutoMapperProfile()
        {
            CreateMap<Account, AccountResponse>();

            CreateMap<Account, AuthenticateResponse>();

            CreateMap<RegisterRequest, Account>();

            CreateMap<CreateRequest, Account>();

            CreateMap<UpdateRequest, Account>()
                .ForAllMembers(x => x.Condition(
                    (src, dest, prop) =>
                    {
                        if (prop == null)
                            return false;
                        if (prop is string && string.IsNullOrEmpty((string)prop))
                            return false;
                        
                        return x.DestinationMember.Name != "Role" || src.Role != null;
                    }
                ));
        }
    }
}