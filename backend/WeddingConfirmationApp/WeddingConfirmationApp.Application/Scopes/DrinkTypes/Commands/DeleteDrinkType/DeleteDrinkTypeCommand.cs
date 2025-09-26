using MediatR;
using WeddingConfirmationApp.Application.Models;

namespace WeddingConfirmationApp.Application.Scopes.DrinkTypes.Commands.DeleteDrinkType;

public record DeleteDrinkTypeCommand(Guid Id) : IRequest<Result<Empty>>;