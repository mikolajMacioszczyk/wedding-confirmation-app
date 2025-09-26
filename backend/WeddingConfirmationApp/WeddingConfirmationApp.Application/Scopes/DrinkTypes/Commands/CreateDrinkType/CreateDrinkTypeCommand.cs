using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.DrinkTypes.Commands.CreateDrinkType;

public record CreateDrinkTypeCommand(string Type) : IRequest<Result<DrinkTypeDto>>;