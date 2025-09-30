namespace WeddingConfirmationApp.Domain.Entities;

public class PersonConfirmation : BaseDomainEntity
{
    public Guid InvitationId { get; set; }
    public Invitation Invitation { get; set; } = null!;

    public Guid PersonId { get; set; }
    public Person Person { get; set; } = null!;

    public bool Confirmed { get; set; }

    public Guid? SelectedDrinkId { get; set; }
    public DrinkType? SelectedDrink { get; set; }
}
