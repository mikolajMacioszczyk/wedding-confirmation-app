using AutoMapper;
using MediatR;
using WeddingConfirmationApp.Application.Scopes.Persons.Contracts;
using WeddingConfirmationApp.Application.Scopes.Persons.DTOs;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Queries.GetAllPersons;

public class GetAllPersonsQueryHandler : IRequestHandler<GetAllPersonsQuery, IEnumerable<PersonDto>>
{
    private readonly IPersonRepository _personRepository;
    private readonly IMapper _mapper;

    public GetAllPersonsQueryHandler(IPersonRepository personRepository, IMapper mapper)
    {
        _personRepository = personRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PersonDto>> Handle(GetAllPersonsQuery request, CancellationToken cancellationToken)
    {
        var persons = await _personRepository.GetAllAsync();
        
        return _mapper.Map<IEnumerable<PersonDto>>(persons);
    }
}