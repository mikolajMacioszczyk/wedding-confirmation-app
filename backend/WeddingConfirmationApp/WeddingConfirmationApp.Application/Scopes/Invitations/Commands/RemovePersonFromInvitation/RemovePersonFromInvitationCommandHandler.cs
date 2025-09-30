using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Commands.RemovePersonFromInvitation;

public class RemovePersonFromInvitationCommandHandler : IRequestHandler<RemovePersonFromInvitationCommand, Result<InvitationDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public RemovePersonFromInvitationCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<InvitationDto>> Handle(RemovePersonFromInvitationCommand request, CancellationToken cancellationToken)
    {
        var invitation = await _unitOfWork.InvitationRepository.GetByIdAsync(request.InvitationId);
        if (invitation is null)
        {
            return new NotFound(request.InvitationId, $"Not found invitation with id = {request.InvitationId}");
        }

        var personToRemove = invitation.Persons.FirstOrDefault(p => p.Id == request.PersonId);
        if (personToRemove is null)
        {
            return new NotFound(request.PersonId, $"Not found person with id = {request.PersonId}");
        }

        var invitationConfirmations = await _unitOfWork.PersonConfirmationRepository.GetByInvitationIdAsync(request.InvitationId);
        if (invitationConfirmations.Any())
        {
            return new Failure($"This invitation have existing confirmations, cannot modify persons list");
        }

        invitation.Persons.Remove(personToRemove);
        
        var (changesMade, entitiesWithErrors) = await _unitOfWork.SaveChangesAsync();
        
        if (!changesMade || entitiesWithErrors.Any())
        {
            return new Failure("Failed to remove person from invitation");
        }

        // Reload the invitation with persons included
        var updatedInvitation = await _unitOfWork.InvitationRepository.GetByIdAsync(invitation.Id);
        
        return _mapper.Map<InvitationDto>(updatedInvitation);
    }
}