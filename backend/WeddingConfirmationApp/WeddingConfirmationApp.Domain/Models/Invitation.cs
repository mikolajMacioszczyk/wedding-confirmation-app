namespace WeddingConfirmationApp.Domain.Models;

public class Invitation
{
    public Guid Id { get; set; }
    // non-database identifier assigned by admin
    public Guid PublicId { get; set; }
}
