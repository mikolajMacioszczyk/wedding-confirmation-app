using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Queries.GetInvitationById;

public record GetInvitationByIdQuery(Guid Id) : IRequest<Result<InvitationDto>>;