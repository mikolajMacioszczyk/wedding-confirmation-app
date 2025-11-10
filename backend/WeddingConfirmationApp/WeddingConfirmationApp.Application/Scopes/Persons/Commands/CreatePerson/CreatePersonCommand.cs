using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Persons.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Commands.CreatePerson;

public class CreatePersonCommand : IRequest<Result<PersonDto>>
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? Description { get; set; }
}