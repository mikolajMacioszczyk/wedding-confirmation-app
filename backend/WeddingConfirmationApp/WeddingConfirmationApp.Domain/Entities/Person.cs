namespace WeddingConfirmationApp.Domain.Entities;

public class Person : BaseDomainEntity
{
    public required string FirstName { get; set; }

    public required string LastName { get; set; }

    public string? Description { get; set; }

    public Guid? InvitationId { get; set; }
    public Invitation? Invitation { get; set; }
}
