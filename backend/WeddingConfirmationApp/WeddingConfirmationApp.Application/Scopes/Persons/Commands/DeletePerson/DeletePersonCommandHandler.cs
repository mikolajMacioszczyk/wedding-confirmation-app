using MediatR;
using WeddingConfirmationApp.Application.Scopes.Persons.Contracts;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Commands.DeletePerson;

public class DeletePersonCommandHandler : IRequestHandler<DeletePersonCommand>
{
    private readonly IPersonRepository _personRepository;

    public DeletePersonCommandHandler(IPersonRepository personRepository)
    {
        _personRepository = personRepository;
    }

    public async Task Handle(DeletePersonCommand request, CancellationToken cancellationToken)
    {
        await _personRepository.DeleteAsync(request.Id);
    }
}