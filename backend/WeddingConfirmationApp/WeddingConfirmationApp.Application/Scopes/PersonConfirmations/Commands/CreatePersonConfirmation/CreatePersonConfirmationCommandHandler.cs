using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.DTOs;
using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Commands.CreatePersonConfirmation;

public class CreatePersonConfirmationCommandHandler : IRequestHandler<CreatePersonConfirmationCommand, Result<PersonConfirmationDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreatePersonConfirmationCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<PersonConfirmationDto>> Handle(CreatePersonConfirmationCommand request, CancellationToken cancellationToken)
    {
        // Check if invitation exists
        var invitation = await _unitOfWork.InvitationRepository.GetByIdAsync(request.InvitationId);
        if (invitation is null)
        {
            return new NotFound(request.InvitationId, "Invitation not found");
        }

        // Check if person exists
        var person = await _unitOfWork.PersonRepository.GetByIdAsync(request.PersonId);
        if (person is null)
        {
            return new NotFound(request.PersonId, "Person not found");
        }

        // Check if drink type exists
        var drinkType = await _unitOfWork.DrinkTypeRepository.GetByIdAsync(request.SelectedDrinkId);
        if (drinkType is null)
        {
            return new NotFound(request.SelectedDrinkId, "Drink type not found");
        }

        // TODO: Check if other not exists

        var personConfirmation = _mapper.Map<PersonConfirmation>(request);

        var createdPersonConfirmation = await _unitOfWork.PersonConfirmationRepository.AddAsync(personConfirmation);
        
        var (changesMade, entitiesWithErrors) = await _unitOfWork.SaveChangesAsync();
        
        if (!changesMade || entitiesWithErrors.Any())
        {
            return new Failure("Failed to create person confirmation");
        }

        return _mapper.Map<PersonConfirmationDto>(createdPersonConfirmation);
    }
}