using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Persons.Contracts;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Commands.DeletePerson;

public class DeletePersonCommandHandler : IRequestHandler<DeletePersonCommand, Result<Empty>>
{
    private readonly IPersonRepository _personRepository;

    public DeletePersonCommandHandler(IPersonRepository personRepository)
    {
        _personRepository = personRepository;
    }

    public async Task<Result<Empty>> Handle(DeletePersonCommand request, CancellationToken cancellationToken)
    {
        var personFromDb = await _personRepository.GetByIdAsync(request.Id);

        if (personFromDb is null)
        {
            return new NotFound(request.Id);
        }

        return Empty.Single;
    }
}