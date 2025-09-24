using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Persons.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Commands.UpdatePerson;

public record UpdatePersonCommand(Guid Id, string FirstName, string LastName) : IRequest<Result<PersonDto>>;