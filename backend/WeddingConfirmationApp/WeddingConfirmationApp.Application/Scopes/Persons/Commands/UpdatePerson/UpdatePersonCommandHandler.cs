using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Persons.Contracts;
using WeddingConfirmationApp.Application.Scopes.Persons.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Commands.UpdatePerson;

public class UpdatePersonCommandHandler : IRequestHandler<UpdatePersonCommand, Result<PersonDto>>
{
    private readonly IPersonRepository _personRepository;
    private readonly IMapper _mapper;

    public UpdatePersonCommandHandler(IPersonRepository personRepository, IMapper mapper)
    {
        _personRepository = personRepository;
        _mapper = mapper;
    }

    public async Task<Result<PersonDto>> Handle(UpdatePersonCommand request, CancellationToken cancellationToken)
    {
        var existingPerson = await _personRepository.GetByIdAsync(request.Id);
        if (existingPerson == null)
        {
            return new NotFound(request.Id);
        }

        _mapper.Map(request, existingPerson);

        var updatedPerson = await _personRepository.UpdateAsync(existingPerson);

        return _mapper.Map<PersonDto>(updatedPerson);
    }
}