using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.DrinkTypes.Queries.GetDrinkTypeById;

public class GetDrinkTypeByIdQueryHandler : IRequestHandler<GetDrinkTypeByIdQuery, Result<DrinkTypeDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetDrinkTypeByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<DrinkTypeDto>> Handle(GetDrinkTypeByIdQuery request, CancellationToken cancellationToken)
    {
        var drinkType = await _unitOfWork.DrinkTypeRepository.GetByIdAsync(request.Id);
        
        if (drinkType is null)
        {
            return new NotFound(request.Id);
        }

        return _mapper.Map<DrinkTypeDto>(drinkType);
    }
}