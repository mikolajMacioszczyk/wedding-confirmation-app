using MediatR;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Queries.GetAllInvitations;

public record GetAllInvitationsQuery(bool OnlyNotConfirmed, bool? OnlyNotPrinted = null, bool? OnlyNotGiven = null) : IRequest<IEnumerable<InvitationWithConfirmationInformationDto>>;