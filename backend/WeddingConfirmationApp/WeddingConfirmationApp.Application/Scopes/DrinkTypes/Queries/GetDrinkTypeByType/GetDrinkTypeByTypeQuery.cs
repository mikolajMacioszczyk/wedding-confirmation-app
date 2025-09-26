using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.DrinkTypes.Queries.GetDrinkTypeByType;

public record GetDrinkTypeByTypeQuery(string Type) : IRequest<Result<DrinkTypeDto>>;