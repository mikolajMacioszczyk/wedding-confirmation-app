using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Queries.GetInvitationByPublicId;

public record GetInvitationByPublicIdQuery(string PublicId) : IRequest<Result<InvitationDto>>;