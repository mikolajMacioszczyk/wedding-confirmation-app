using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.DrinkTypes.Commands.UpdateDrinkType;

public class UpdateDrinkTypeCommandHandler : IRequestHandler<UpdateDrinkTypeCommand, Result<DrinkTypeDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateDrinkTypeCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<DrinkTypeDto>> Handle(UpdateDrinkTypeCommand request, CancellationToken cancellationToken)
    {
        var drinkType = await _unitOfWork.DrinkTypeRepository.GetByIdAsync(request.Id);
        
        if (drinkType is null)
        {
            return new NotFound(request.Id);
        }

        drinkType.Type = request.Type;
        
        var updatedDrinkType = await _unitOfWork.DrinkTypeRepository.UpdateAsync(drinkType);
        
        var (changesMade, entitiesWithErrors) = await _unitOfWork.SaveChangesAsync();
        
        if (!changesMade || entitiesWithErrors.Any())
        {
            return new Failure("Failed to update drink type");
        }

        return _mapper.Map<DrinkTypeDto>(updatedDrinkType);
    }
}