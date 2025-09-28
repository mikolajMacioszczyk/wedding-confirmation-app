using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Queries.GetAllPersonConfirmations;

public class GetAllPersonConfirmationsQueryHandler : IRequestHandler<GetAllPersonConfirmationsQuery, IEnumerable<PersonConfirmationDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetAllPersonConfirmationsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PersonConfirmationDto>> Handle(GetAllPersonConfirmationsQuery request, CancellationToken cancellationToken)
    {
        var personConfirmations = await _unitOfWork.PersonConfirmationRepository.GetAllAsync();
        
        return _mapper.Map<IEnumerable<PersonConfirmationDto>>(personConfirmations);
    }
}