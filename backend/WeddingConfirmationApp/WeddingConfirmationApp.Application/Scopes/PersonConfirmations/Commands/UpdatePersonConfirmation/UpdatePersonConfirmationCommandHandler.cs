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

        // Check if drink type exists
        var drinkType = await _unitOfWork.DrinkTypeRepository.GetByIdAsync(request.SelectedDrinkId);
        if (drinkType is null)
        {
            return new NotFound(request.SelectedDrinkId, "Drink type not found");
        }

        // Update properties
        existingPersonConfirmation.Confirmed = request.Confirmed;
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