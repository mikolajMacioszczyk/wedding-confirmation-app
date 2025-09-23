using MediatR;
using WeddingConfirmationApp.Application.DTOs;

namespace WeddingConfirmationApp.Application.Commands;

public class CreatePersonCommand : IRequest<PersonDto>
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}