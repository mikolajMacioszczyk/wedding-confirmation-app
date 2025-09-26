using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.DrinkTypes.Queries.GetAllDrinkTypes;

public class GetAllDrinkTypesQueryHandler : IRequestHandler<GetAllDrinkTypesQuery, IEnumerable<DrinkTypeDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetAllDrinkTypesQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<DrinkTypeDto>> Handle(GetAllDrinkTypesQuery request, CancellationToken cancellationToken)
    {
        var drinkTypes = await _unitOfWork.DrinkTypeRepository.GetAllAsync();
        
        return _mapper.Map<IEnumerable<DrinkTypeDto>>(drinkTypes);
    }
}