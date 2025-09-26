using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Commands.AddPersonToInvitation;

public class AddPersonToInvitationCommandHandler : IRequestHandler<AddPersonToInvitationCommand, Result<InvitationDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AddPersonToInvitationCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<InvitationDto>> Handle(AddPersonToInvitationCommand request, CancellationToken cancellationToken)
    {
        var invitation = await _unitOfWork.InvitationRepository.GetByIdAsync(request.InvitationId);
        if (invitation is null)
        {
            return new NotFound(request.InvitationId, $"Not found invitation with id = {request.InvitationId}");
        }

        var person = await _unitOfWork.PersonRepository.GetByIdAsync(request.PersonId);
        if (person is null)
        {
            return new NotFound(request.PersonId, $"Not found person with id = {request.PersonId}");
        }

        // Check if person is already in invitation
        if (invitation.Persons.Any(p => p.Id == request.PersonId))
        {
            return new Failure($"Person with id {request.PersonId} is already in this invitation");
        }

        invitation.Persons.Add(person);
        
        var (changesMade, entitiesWithErrors) = await _unitOfWork.SaveChangesAsync();
        
        if (!changesMade || entitiesWithErrors.Any())
        {
            return new Failure("Failed to add person to invitation");
        }

        // Reload the invitation with persons included
        var updatedInvitation = await _unitOfWork.InvitationRepository.GetByIdAsync(invitation.Id);
        
        return _mapper.Map<InvitationDto>(updatedInvitation);
    }
}