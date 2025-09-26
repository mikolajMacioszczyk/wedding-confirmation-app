using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Commands.CreateInvitation;

public record CreateInvitationCommand(Guid PublicId, string InvitationText) : IRequest<Result<InvitationDto>>;