using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.DrinkTypes.Queries.GetDrinkTypeByType;

public class GetDrinkTypeByTypeQueryHandler : IRequestHandler<GetDrinkTypeByTypeQuery, Result<DrinkTypeDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetDrinkTypeByTypeQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<DrinkTypeDto>> Handle(GetDrinkTypeByTypeQuery request, CancellationToken cancellationToken)
    {
        var drinkType = await _unitOfWork.DrinkTypeRepository.GetByTypeAsync(request.Type);
        
        if (drinkType is null)
        {
            return new NotFound(request.Type, $"Drink with type {request.Type} does not exist");
        }

        return _mapper.Map<DrinkTypeDto>(drinkType);
    }
}