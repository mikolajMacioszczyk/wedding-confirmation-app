using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Queries.ByInvitation;

public class GetPersonConfirmationsByInvitationQueryHandler : IRequestHandler<GetPersonConfirmationsByInvitationQuery, Result<IEnumerable<PersonConfirmationDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetPersonConfirmationsByInvitationQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<PersonConfirmationDto>>> Handle(GetPersonConfirmationsByInvitationQuery request, CancellationToken cancellationToken)
    {
        // First check if the invitation exists
        var invitation = await _unitOfWork.InvitationRepository.GetByIdAsync(request.InvitationId);
        if (invitation is null)
        {
            return new NotFound(request.InvitationId);
        }

        var personConfirmations = await _unitOfWork.PersonConfirmationRepository.GetByInvitationIdAsync(request.InvitationId);
        
        return _mapper.Map<IEnumerable<PersonConfirmationDto>>(personConfirmations).ToList();
    }
}