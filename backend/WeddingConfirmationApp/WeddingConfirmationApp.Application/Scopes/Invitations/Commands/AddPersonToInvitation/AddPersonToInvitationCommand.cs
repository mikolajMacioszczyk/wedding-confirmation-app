using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Commands.AddPersonToInvitation;

public record AddPersonToInvitationCommand(Guid InvitationId, Guid PersonId) : IRequest<Result<InvitationDto>>;