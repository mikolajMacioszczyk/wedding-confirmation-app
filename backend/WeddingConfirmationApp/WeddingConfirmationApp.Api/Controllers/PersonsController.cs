using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Persons.Commands.CreatePerson;
using WeddingConfirmationApp.Application.Scopes.Persons.Commands.DeletePerson;
using WeddingConfirmationApp.Application.Scopes.Persons.Commands.UpdatePerson;
using WeddingConfirmationApp.Application.Scopes.Persons.DTOs;
using WeddingConfirmationApp.Application.Scopes.Persons.Queries.GetAllPersons;
using WeddingConfirmationApp.Application.Scopes.Persons.Queries.GetPersonById;

namespace WeddingConfirmationApp.Api.Controllers;

[Authorize(Roles = "Administrator")]
public class PersonsController : BaseApiController<PersonsController>
{
    public PersonsController(IMediator mediator, ILogger<PersonsController> logger) : base(mediator, logger)
    {}

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PersonDto>>> GetAll()
    {
        return Ok(await _mediator.Send(new GetAllPersonsQuery()));
    }

    [HttpGet("{Id}")]
    public Task<ActionResult<PersonDto>> GetById([FromRoute] GetPersonByIdQuery query) => HandleRequest(query);

    [HttpPost]
    public Task<ActionResult<PersonDto>> Create([FromBody] CreatePersonCommand command) => HandleRequest(command);

    [HttpPut]
    public Task<ActionResult<PersonDto>> Update([FromBody] UpdatePersonCommand command) => HandleRequest(command);

    [HttpDelete("{Id}")]
    public Task<ActionResult<Empty>> Delete([FromRoute] DeletePersonCommand command) => HandleRequest(command);
}