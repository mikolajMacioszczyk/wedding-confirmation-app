using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.DrinkTypes.Commands.UpdateDrinkType;

public record UpdateDrinkTypeCommand(Guid Id, string Type) : IRequest<Result<DrinkTypeDto>>;