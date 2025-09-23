using MediatR;
using WeddingConfirmationApp.Application.DTOs;

namespace WeddingConfirmationApp.Application.Commands;

public class UpdatePersonCommand : IRequest<PersonDto>
{
    public Guid Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}