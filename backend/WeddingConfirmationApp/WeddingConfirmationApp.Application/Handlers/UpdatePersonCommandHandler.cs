using MediatR;
using WeddingConfirmationApp.Application.Commands;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.DTOs;
using WeddingConfirmationApp.Domain.Models;

namespace WeddingConfirmationApp.Application.Handlers;

public class UpdatePersonCommandHandler : IRequestHandler<UpdatePersonCommand, PersonDto>
{
    private readonly IPersonRepository _personRepository;

    public UpdatePersonCommandHandler(IPersonRepository personRepository)
    {
        _personRepository = personRepository;
    }

    public async Task<PersonDto> Handle(UpdatePersonCommand request, CancellationToken cancellationToken)
    {
        var existingPerson = await _personRepository.GetByIdAsync(request.Id);
        if (existingPerson == null)
        {
            throw new ArgumentException($"Person with id {request.Id} not found");
        }

        existingPerson.FirstName = request.FirstName;
        existingPerson.LastName = request.LastName;

        var updatedPerson = await _personRepository.UpdateAsync(existingPerson);

        return new PersonDto
        {
            Id = updatedPerson.Id,
            FirstName = updatedPerson.FirstName,
            LastName = updatedPerson.LastName
        };
    }
}