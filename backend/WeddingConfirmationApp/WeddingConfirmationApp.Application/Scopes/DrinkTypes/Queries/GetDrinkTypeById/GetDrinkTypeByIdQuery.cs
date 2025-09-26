using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.DrinkTypes.Queries.GetDrinkTypeById;

public record GetDrinkTypeByIdQuery(Guid Id) : IRequest<Result<DrinkTypeDto>>;