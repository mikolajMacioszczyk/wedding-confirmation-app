namespace WeddingConfirmationApp.Domain.Models;

public class PersonConfirmation
{
    public Guid Id { get; set; }
    
    public Guid InvitationId { get; set; }
    public Invitation Invitation { get; set; } = null!;

    public Guid PersonId { get; set; }
    public Person Person { get; set; } = null!;

    public bool Confimed { get; set; }
    public bool IsValid { get; set; }
}
