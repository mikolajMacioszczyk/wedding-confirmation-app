using MediatR;

namespace WeddingConfirmationApp.Application.Commands;

public class DeletePersonCommand : IRequest
{
    public Guid Id { get; set; }
}