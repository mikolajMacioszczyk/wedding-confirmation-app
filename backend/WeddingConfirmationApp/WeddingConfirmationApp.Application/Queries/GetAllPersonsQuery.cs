using MediatR;
using WeddingConfirmationApp.Application.DTOs;

namespace WeddingConfirmationApp.Application.Queries;

public class GetAllPersonsQuery : IRequest<IEnumerable<PersonDto>>
{
}