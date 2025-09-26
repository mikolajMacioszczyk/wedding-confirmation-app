using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.DTOs;
using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Application.Scopes.DrinkTypes.Commands.CreateDrinkType;

public class CreateDrinkTypeCommandHandler : IRequestHandler<CreateDrinkTypeCommand, Result<DrinkTypeDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateDrinkTypeCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<DrinkTypeDto>> Handle(CreateDrinkTypeCommand request, CancellationToken cancellationToken)
    {
        var drinkWithTheSameTypeType = await _unitOfWork.DrinkTypeRepository.GetByTypeAsync(request.Type);
        if (drinkWithTheSameTypeType is not null)
        {
            return new Failure($"Drink with type {request.Type} already exists");
        }

        var drinkType = _mapper.Map<DrinkType>(request);

        var createdDrinkType = await _unitOfWork.DrinkTypeRepository.AddAsync(drinkType);
        
        var (changesMade, entitiesWithErrors) = await _unitOfWork.SaveChangesAsync();
        
        if (!changesMade || entitiesWithErrors.Any())
        {
            return new Failure("Failed to create drink type");
        }

        return _mapper.Map<DrinkTypeDto>(createdDrinkType);
    }
}