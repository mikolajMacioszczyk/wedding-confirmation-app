using MediatR;
using WeddingConfirmationApp.Application.Commands;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.DTOs;
using WeddingConfirmationApp.Domain.Models;

namespace WeddingConfirmationApp.Application.Handlers;

public class CreatePersonCommandHandler : IRequestHandler<CreatePersonCommand, PersonDto>
{
    private readonly IPersonRepository _personRepository;

    public CreatePersonCommandHandler(IPersonRepository personRepository)
    {
        _personRepository = personRepository;
    }

    public async Task<PersonDto> Handle(CreatePersonCommand request, CancellationToken cancellationToken)
    {
        var person = new Person
        {
            FirstName = request.FirstName,
            LastName = request.LastName
        };

        var createdPerson = await _personRepository.AddAsync(person);

        return new PersonDto
        {
            Id = createdPerson.Id,
            FirstName = createdPerson.FirstName,
            LastName = createdPerson.LastName
        };
    }
}