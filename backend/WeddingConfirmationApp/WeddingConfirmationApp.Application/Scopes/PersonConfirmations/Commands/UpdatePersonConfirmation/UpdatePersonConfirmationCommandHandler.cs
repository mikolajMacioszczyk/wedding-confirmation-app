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

        // Check if drink type exists (only when confirmed and drink is selected)
        if (request.Confirmed && request.SelectedDrinkId.HasValue)
        {
            var drinkType = await _unitOfWork.DrinkTypeRepository.GetByIdAsync(request.SelectedDrinkId.Value);
            if (drinkType is null)
            {
                return new NotFound(request.SelectedDrinkId.Value, "Drink type not found");
            }
        }
        else if (request.Confirmed && !request.SelectedDrinkId.HasValue)
        {
            return new Failure("SelectedDrinkId is required when Confirmed is true");
        }

        // Update properties
        existingPersonConfirmation.Confirmed = request.Confirmed;
        existingPersonConfirmation.ConfirmedAt = DateTime.UtcNow;
        existingPersonConfirmation.SelectedDrinkId = request.SelectedDrinkId;

        var updatedPersonConfirmation = await _unitOfWork.PersonConfirmationRepository.UpdateAsync(existingPersonConfirmation);
        
        var (changesMade, entitiesWithErrors) = await _unitOfWork.SaveChangesAsync();
        
        if (!changesMade || entitiesWithErrors.Any())
        {
            return new Failure("Failed to update person confirmation");
        }

        return _mapper.Map<PersonConfirmationDto>(updatedPersonConfirmation);
    }
}