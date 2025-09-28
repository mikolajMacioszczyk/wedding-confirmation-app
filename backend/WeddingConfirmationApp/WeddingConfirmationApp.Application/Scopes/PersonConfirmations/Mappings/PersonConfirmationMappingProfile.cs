using AutoMapper;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Commands.CreatePersonConfirmation;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.DTOs;
using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Mappings;

public class PersonConfirmationMappingProfile : Profile
{
    public PersonConfirmationMappingProfile()
    {
        // Domain to DTO mappings
        CreateMap<PersonConfirmation, PersonConfirmationDto>();
        
        // Command to Domain mappings
        CreateMap<CreatePersonConfirmationCommand, PersonConfirmation>();
    }
}