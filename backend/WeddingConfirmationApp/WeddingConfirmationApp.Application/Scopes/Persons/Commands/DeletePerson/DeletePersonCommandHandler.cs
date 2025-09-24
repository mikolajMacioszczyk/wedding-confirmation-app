using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Models;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Commands.DeletePerson;

public class DeletePersonCommandHandler : IRequestHandler<DeletePersonCommand, Result<Empty>>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeletePersonCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Empty>> Handle(DeletePersonCommand request, CancellationToken cancellationToken)
    {
        var personFromDb = await _unitOfWork.PersonRepository.GetByIdAsync(request.Id);

        if (personFromDb is null)
        {
            return new NotFound(request.Id);
        }

        await _unitOfWork.PersonRepository.DeleteAsync(personFromDb);

        await _unitOfWork.SaveChangesAsync();

        return Empty.Single;
    }
}