using AutoMapper;
using WeddingConfirmationApp.Application.Scopes.Persons.Commands.CreatePerson;
using WeddingConfirmationApp.Application.Scopes.Persons.Commands.UpdatePerson;
using WeddingConfirmationApp.Application.Scopes.Persons.DTOs;
using WeddingConfirmationApp.Domain.Models;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Mappings;

public class PersonMappingProfile : Profile
{
    public PersonMappingProfile()
    {
        // Domain to DTO mappings
        CreateMap<Person, PersonDto>();
        
        // Command to Domain mappings
        CreateMap<CreatePersonCommand, Person>();
        CreateMap<UpdatePersonCommand, Person>();
    }
}