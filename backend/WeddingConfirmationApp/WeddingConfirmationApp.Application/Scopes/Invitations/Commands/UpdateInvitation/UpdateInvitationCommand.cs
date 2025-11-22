using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Commands.UpdateInvitation;

public record UpdateInvitationCommand(Guid Id, string InvitationText, bool IsPrinted, bool IsGiven) : IRequest<Result<InvitationDto>>;