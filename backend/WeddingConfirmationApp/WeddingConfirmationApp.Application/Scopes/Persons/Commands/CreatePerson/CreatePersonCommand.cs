using MediatR;
using WeddingConfirmationApp.Application.Scopes.Persons.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Commands.CreatePerson;

public class CreatePersonCommand : IRequest<PersonDto>
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}