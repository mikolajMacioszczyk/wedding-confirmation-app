namespace WeddingConfirmationApp.Application.Scopes.PersonConfirmations.DTOs;

public class PersonConfirmationDto
{
    public Guid Id { get; set; }
    public Guid InvitationId { get; set; }
    public Guid PersonId { get; set; }
    public bool Confirmed { get; set; }
    public bool IsValid { get; set; }
    public Guid SelectedDrinkId { get; set; }
}