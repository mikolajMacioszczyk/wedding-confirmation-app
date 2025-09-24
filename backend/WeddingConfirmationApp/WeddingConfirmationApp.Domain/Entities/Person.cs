namespace WeddingConfirmationApp.Domain.Entities;

public class Person : BaseDomainEntity
{
    public required string FirstName { get; set; }

    public required string LastName { get; set; }
}
