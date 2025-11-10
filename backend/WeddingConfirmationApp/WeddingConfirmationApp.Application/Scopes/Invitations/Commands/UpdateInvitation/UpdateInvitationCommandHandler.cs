using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Commands.UpdateInvitation;

public class UpdateInvitationCommandHandler : IRequestHandler<UpdateInvitationCommand, Result<InvitationDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateInvitationCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<InvitationDto>> Handle(UpdateInvitationCommand request, CancellationToken cancellationToken)
    {
        var invitation = await _unitOfWork.InvitationRepository.GetByIdAsync(request.Id);
        
        if (invitation is null)
        {
            return new NotFound(request.Id);
        }

        invitation.InvitationText = request.InvitationText;
        invitation.CreationDateTime = DateTime.UtcNow;
        
        var updatedInvitation = await _unitOfWork.InvitationRepository.UpdateAsync(invitation);
        
        var (changesMade, entitiesWithErrors) = await _unitOfWork.SaveChangesAsync();
        
        if (!changesMade || entitiesWithErrors.Any())
        {
            return new Failure("Failed to update invitation");
        }

        return _mapper.Map<InvitationDto>(updatedInvitation);
    }
}