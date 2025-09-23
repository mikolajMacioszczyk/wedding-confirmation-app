using MediatR;
using WeddingConfirmationApp.Application.DTOs;

namespace WeddingConfirmationApp.Application.Queries;

public class GetPersonByIdQuery : IRequest<PersonDto?>
{
    public Guid Id { get; set; }
}