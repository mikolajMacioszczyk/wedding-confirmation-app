using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Queries.GetAllInvitations;

public class GetAllInvitationsQueryHandler : IRequestHandler<GetAllInvitationsQuery, IEnumerable<InvitationWithConfirmationInformationDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetAllInvitationsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<InvitationWithConfirmationInformationDto>> Handle(GetAllInvitationsQuery request, CancellationToken cancellationToken)
    {
        var invitations = await _unitOfWork.InvitationRepository.GetAllAsync();
        
        var mappedInvitations = _mapper.Map<IEnumerable<InvitationWithConfirmationInformationDto>>(invitations);

        var allConfirmations = await _unitOfWork.PersonConfirmationRepository.GetAllAsync();
        var confirmedInvitations = allConfirmations.Select(c => c.InvitationId).Distinct();

        foreach (var mappedInvitation in mappedInvitations)
        {
            mappedInvitation.HaveConfirmation = confirmedInvitations.Contains(mappedInvitation.Id);
        }

        return request.OnlyNotConfirmed ? mappedInvitations.Where(m => !m.HaveConfirmation) : mappedInvitations;
    }
}