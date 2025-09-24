using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Persons.Contracts;
using WeddingConfirmationApp.Application.Scopes.Persons.DTOs;
using WeddingConfirmationApp.Domain.Models;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Commands.CreatePerson;

public class CreatePersonCommandHandler : IRequestHandler<CreatePersonCommand, Result<PersonDto>>
{
    private readonly IPersonRepository _personRepository;

    public CreatePersonCommandHandler(IPersonRepository personRepository)
    {
        _personRepository = personRepository;
    }

    public async Task<Result<PersonDto>> Handle(CreatePersonCommand request, CancellationToken cancellationToken)
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