using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Queries.GetAllInvitations;

public class GetAllInvitationsQueryHandler : IRequestHandler<GetAllInvitationsQuery, IEnumerable<InvitationDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetAllInvitationsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<InvitationDto>> Handle(GetAllInvitationsQuery request, CancellationToken cancellationToken)
    {
        var invitations = await _unitOfWork.InvitationRepository.GetAllAsync();
        
        return _mapper.Map<IEnumerable<InvitationDto>>(invitations);
    }
}