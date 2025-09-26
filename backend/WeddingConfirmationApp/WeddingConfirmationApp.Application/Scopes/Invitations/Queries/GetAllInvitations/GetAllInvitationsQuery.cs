using MediatR;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Queries.GetAllInvitations;

public record GetAllInvitationsQuery : IRequest<IEnumerable<InvitationDto>>;