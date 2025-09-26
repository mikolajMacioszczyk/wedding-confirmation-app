using MediatR;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.DrinkTypes.Queries.GetAllDrinkTypes;

public record GetAllDrinkTypesQuery : IRequest<IEnumerable<DrinkTypeDto>>;