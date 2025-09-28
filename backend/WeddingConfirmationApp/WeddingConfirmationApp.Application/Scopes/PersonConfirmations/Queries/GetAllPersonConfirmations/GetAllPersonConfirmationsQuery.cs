using MediatR;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Queries.GetAllPersonConfirmations;

public record GetAllPersonConfirmationsQuery : IRequest<IEnumerable<PersonConfirmationDto>>;