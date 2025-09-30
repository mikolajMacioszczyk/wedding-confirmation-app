using AutoMapper;
using WeddingConfirmationApp.Application.Scopes.Invitations.Commands.CreateInvitation;
using WeddingConfirmationApp.Application.Scopes.Invitations.Commands.UpdateInvitation;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;
using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Mappings;

public class InvitationMappingProfile : Profile
{
    public InvitationMappingProfile()
    {
        // Domain to DTO mappings
        CreateMap<Invitation, InvitationDto>();
        CreateMap<Invitation, InvitationWithConfirmationInformationDto>();
        
        // Command to Domain mappings
        CreateMap<CreateInvitationCommand, Invitation>();
        CreateMap<UpdateInvitationCommand, Invitation>();
    }
}