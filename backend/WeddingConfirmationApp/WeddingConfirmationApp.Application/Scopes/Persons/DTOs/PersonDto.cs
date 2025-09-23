namespace WeddingConfirmationApp.Application.Scopes.Persons.DTOs;

public class PersonDto
{
    public Guid Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}