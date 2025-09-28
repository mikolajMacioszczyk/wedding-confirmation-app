using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Commands.UpdatePersonConfirmation;

public record UpdatePersonConfirmationCommand(
    Guid Id,
    bool Confirmed, 
    Guid SelectedDrinkId) : IRequest<Result<PersonConfirmationDto>>;