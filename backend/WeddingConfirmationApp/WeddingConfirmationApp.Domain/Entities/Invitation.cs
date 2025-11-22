namespace WeddingConfirmationApp.Domain.Entities;

public class Invitation : BaseDomainEntity
{
    // non-database identifier assigned by admin
    public required string PublicId { get; set; }

    public required string InvitationText { get; set; }

    public DateTime CreationDateTime { get; set; }

    public bool IsPrinted { get; set; }

    public bool IsGiven { get; set; }

    public ICollection<Person> Persons { get; set; } = [];
    
    public IEnumerable<Person> GetOrderedPersons() => Persons.OrderBy(p => p.OrderInInvitation);
}
