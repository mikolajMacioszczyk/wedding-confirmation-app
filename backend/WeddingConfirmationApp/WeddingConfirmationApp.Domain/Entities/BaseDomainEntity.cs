namespace WeddingConfirmationApp.Domain.Entities;

public abstract class BaseDomainEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
}
