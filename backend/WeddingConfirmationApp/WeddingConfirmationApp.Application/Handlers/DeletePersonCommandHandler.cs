using MediatR;
using WeddingConfirmationApp.Application.Commands;
using WeddingConfirmationApp.Application.Contracts;

namespace WeddingConfirmationApp.Application.Handlers;

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