namespace WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

public class InvitationDto
{
    public Guid Id { get; set; }
    public Guid PublicId { get; set; }
    public required string InvitationText { get; set; }
}