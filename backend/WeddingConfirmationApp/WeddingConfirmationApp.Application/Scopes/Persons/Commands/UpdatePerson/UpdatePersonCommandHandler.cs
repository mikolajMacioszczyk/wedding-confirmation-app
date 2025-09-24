using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Persons.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Commands.UpdatePerson;

public class UpdatePersonCommandHandler : IRequestHandler<UpdatePersonCommand, Result<PersonDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdatePersonCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<PersonDto>> Handle(UpdatePersonCommand request, CancellationToken cancellationToken)
    {
        var existingPerson = await _unitOfWork.PersonRepository.GetByIdAsync(request.Id);
        if (existingPerson == null)
        {
            return new NotFound(request.Id);
        }

        _mapper.Map(request, existingPerson);

        var updatedPerson = await _unitOfWork.PersonRepository.UpdateAsync(existingPerson);

        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<PersonDto>(updatedPerson);
    }
}