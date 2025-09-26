using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Commands.CreateInvitation;

public record CreateInvitationCommand(string PublicId, string InvitationText) : IRequest<Result<InvitationDto>>;