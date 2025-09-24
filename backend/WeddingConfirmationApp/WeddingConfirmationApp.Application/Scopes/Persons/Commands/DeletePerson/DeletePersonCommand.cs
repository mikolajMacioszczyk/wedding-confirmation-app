using MediatR;
using WeddingConfirmationApp.Application.Models;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Commands.DeletePerson;

public record DeletePersonCommand(Guid Id) : IRequest<Result<Empty>>;
