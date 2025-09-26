using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Commands.UpdateInvitation;

public record UpdateInvitationCommand(Guid Id, Guid PublicId, string InvitationText) : IRequest<Result<InvitationDto>>;