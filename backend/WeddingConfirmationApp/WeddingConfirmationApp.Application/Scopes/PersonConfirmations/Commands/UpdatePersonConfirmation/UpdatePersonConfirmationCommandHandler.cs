using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Commands.UpdatePersonConfirmation;

public class UpdatePersonConfirmationCommandHandler : IRequestHandler<UpdatePersonConfirmationCommand, Result<PersonConfirmationDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdatePersonConfirmationCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<PersonConfirmationDto>> Handle(UpdatePersonConfirmationCommand request, CancellationToken cancellationToken)
    {
        var existingPersonConfirmation = await _unitOfWork.PersonConfirmationRepository.GetByIdAsync(request.Id);
        if (existingPersonConfirmation is null)
        {
            return new NotFound(request.Id);
        }

        // Get the person to check if drinks are disabled
        var person = await _unitOfWork.PersonRepository.GetByIdAsync(existingPersonConfirmation.PersonId);
        if (person is null)
        {
            return new NotFound(existingPersonConfirmation.PersonId, "Person not found");
        }

        // Check if drink type exists (only when confirmed and drink is selected)
        // Skip validation if person has DisableDrinks set to true
        if (request.Confirmed && !person.DisableDrinks)
        {
            if (!request.SelectedDrinkId.HasValue)
            {
                return new Failure("SelectedDrinkId is required when Confirmed is true and drinks are not disabled for this person");
            }

            var drinkType = await _unitOfWork.DrinkTypeRepository.GetByIdAsync(request.SelectedDrinkId.Value);
            if (drinkType is null)
            {
                return new NotFound(request.SelectedDrinkId.Value, "Drink type not found");
            }
        }

        // Update properties
        existingPersonConfirmation.Confirmed = request.Confirmed;
        existingPersonConfirmation.ConfirmedAt = DateTime.UtcNow;
        // If drinks are disabled, always set SelectedDrinkId to null
        existingPersonConfirmation.SelectedDrinkId = person.DisableDrinks ? null : request.SelectedDrinkId;

        var updatedPersonConfirmation = await _unitOfWork.PersonConfirmationRepository.UpdateAsync(existingPersonConfirmation);
        
        var (changesMade, entitiesWithErrors) = await _unitOfWork.SaveChangesAsync();
        
        if (!changesMade || entitiesWithErrors.Any())
        {
            return new Failure("Failed to update person confirmation");
        }

        return _mapper.Map<PersonConfirmationDto>(updatedPersonConfirmation);
    }
}