using MediatR;
using WeddingConfirmationApp.Application.Scopes.Persons.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Queries.GetPersonById;

public class GetPersonByIdQuery : IRequest<PersonDto?>
{
    public Guid Id { get; set; }
}