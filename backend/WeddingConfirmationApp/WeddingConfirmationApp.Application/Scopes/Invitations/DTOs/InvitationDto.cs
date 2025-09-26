using WeddingConfirmationApp.Application.Scopes.Persons.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;

public class InvitationDto
{
    public Guid Id { get; set; }
    public required string PublicId { get; set; }
    public required string InvitationText { get; set; }
    public ICollection<PersonDto> Persons { get; set; } = [];
}