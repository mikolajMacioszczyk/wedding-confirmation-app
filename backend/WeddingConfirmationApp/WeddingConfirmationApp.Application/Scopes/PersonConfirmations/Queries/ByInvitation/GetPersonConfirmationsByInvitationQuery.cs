using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Queries.ByInvitation;

public record GetPersonConfirmationsByInvitationQuery(Guid InvitationId) : IRequest<Result<IEnumerable<PersonConfirmationDto>>>;