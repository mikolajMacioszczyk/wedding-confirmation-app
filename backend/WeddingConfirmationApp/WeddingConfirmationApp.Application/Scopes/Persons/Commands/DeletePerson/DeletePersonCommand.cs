using MediatR;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Commands.DeletePerson;

public class DeletePersonCommand : IRequest
{
    public Guid Id { get; set; }
}