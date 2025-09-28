using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Queries.GetPersonConfirmationById;

public record GetPersonConfirmationByIdQuery(Guid Id) : IRequest<Result<PersonConfirmationDto>>;