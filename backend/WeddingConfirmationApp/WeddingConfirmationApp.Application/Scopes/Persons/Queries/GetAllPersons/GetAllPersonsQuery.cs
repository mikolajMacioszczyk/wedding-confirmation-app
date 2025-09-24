using MediatR;
using WeddingConfirmationApp.Application.Scopes.Persons.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Queries.GetAllPersons;

public record GetAllPersonsQuery : IRequest<IEnumerable<PersonDto>>;