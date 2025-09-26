using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Queries.GetInvitationByPublicId;

public class GetInvitationByPublicIdQueryHandler : IRequestHandler<GetInvitationByPublicIdQuery, Result<InvitationDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetInvitationByPublicIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<InvitationDto>> Handle(GetInvitationByPublicIdQuery request, CancellationToken cancellationToken)
    {
        var invitation = await _unitOfWork.InvitationRepository.GetByPublicIdAsync(request.PublicId);
        
        if (invitation is null)
        {
            return new NotFound(request.PublicId, $"Invitation with PublicId {request.PublicId} does not exist");
        }

        return _mapper.Map<InvitationDto>(invitation);
    }
}