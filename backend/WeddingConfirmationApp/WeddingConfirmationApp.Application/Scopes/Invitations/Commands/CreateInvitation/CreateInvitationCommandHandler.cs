using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;
using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Commands.CreateInvitation;

public class CreateInvitationCommandHandler : IRequestHandler<CreateInvitationCommand, Result<InvitationDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateInvitationCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<InvitationDto>> Handle(CreateInvitationCommand request, CancellationToken cancellationToken)
    {
        var invitationWithTheSamePublicId = await _unitOfWork.InvitationRepository.GetByPublicIdAsync(request.PublicId);
        if (invitationWithTheSamePublicId is not null)
        {
            return new Failure($"Invitation with PublicId {request.PublicId} already exists");
        }

        var invitation = _mapper.Map<Invitation>(request);
        invitation.CreationDateTime = DateTime.UtcNow;

        var createdInvitation = await _unitOfWork.InvitationRepository.AddAsync(invitation);
        
        var (changesMade, entitiesWithErrors) = await _unitOfWork.SaveChangesAsync();
        
        if (!changesMade || entitiesWithErrors.Any())
            return new Failure("Failed to create invitation");
        
        return _mapper.Map<InvitationDto>(createdInvitation);
    }
}