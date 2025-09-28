using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Queries.GetPersonConfirmationById;

public class GetPersonConfirmationByIdQueryHandler : IRequestHandler<GetPersonConfirmationByIdQuery, Result<PersonConfirmationDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetPersonConfirmationByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<PersonConfirmationDto>> Handle(GetPersonConfirmationByIdQuery request, CancellationToken cancellationToken)
    {
        var personConfirmation = await _unitOfWork.PersonConfirmationRepository.GetByIdAsync(request.Id);
        
        if (personConfirmation is null)
        {
            return new NotFound(request.Id);
        }

        return _mapper.Map<PersonConfirmationDto>(personConfirmation);
    }
}