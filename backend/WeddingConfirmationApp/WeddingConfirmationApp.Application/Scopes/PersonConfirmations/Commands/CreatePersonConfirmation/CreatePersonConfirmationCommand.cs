using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Commands.CreatePersonConfirmation;

public record CreatePersonConfirmationCommand(
    Guid InvitationId, 
    Guid PersonId, 
    bool Confirmed, 
    Guid SelectedDrinkId) : IRequest<Result<PersonConfirmationDto>>;