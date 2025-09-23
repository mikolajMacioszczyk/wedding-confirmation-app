namespace WeddingConfirmationApp.Application.DTOs;

public class PersonDto
{
    public Guid Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}

public class CreatePersonDto
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}

public class UpdatePersonDto
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}