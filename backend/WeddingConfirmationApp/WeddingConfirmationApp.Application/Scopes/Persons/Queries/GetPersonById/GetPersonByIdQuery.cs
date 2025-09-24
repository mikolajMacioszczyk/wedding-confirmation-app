using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Persons.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Queries.GetPersonById;

public record GetPersonByIdQuery(Guid Id) : IRequest<Result<PersonDto>>;