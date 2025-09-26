using AutoMapper;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.Commands.CreateDrinkType;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.DTOs;
using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Application.Scopes.DrinkTypes.Mappings;

public class DrinkTypeMappingProfile : Profile
{
    public DrinkTypeMappingProfile()
    {
        // Domain to DTO mappings
        CreateMap<DrinkType, DrinkTypeDto>();
        
        // Command to Domain mappings
        CreateMap<CreateDrinkTypeCommand, DrinkType>();
    }
}