using MediatR;
using Microsoft.AspNetCore.Mvc;
using WeddingConfirmationApp.Application.Scopes.Persons.Commands.CreatePerson;
using WeddingConfirmationApp.Application.Scopes.Persons.Commands.DeletePerson;
using WeddingConfirmationApp.Application.Scopes.Persons.Commands.UpdatePerson;
using WeddingConfirmationApp.Application.Scopes.Persons.DTOs;
using WeddingConfirmationApp.Application.Scopes.Persons.Queries.GetAllPersons;
using WeddingConfirmationApp.Application.Scopes.Persons.Queries.GetPersonById;

namespace WeddingConfirmationApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PersonsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PersonsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PersonDto>>> GetAll()
    {
        var query = new GetAllPersonsQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{Id}")]
    public async Task<ActionResult<PersonDto>> GetById([FromRoute] GetPersonByIdQuery query)
    {
        var result = await _mediator.Send(query);
        
        if (result == null)
            return NotFound();
            
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<PersonDto>> Create([FromBody] CreatePersonCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut]
    public async Task<ActionResult<PersonDto>> Update([FromBody] UpdatePersonCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (ArgumentException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{Id}")]
    public async Task<IActionResult> Delete([FromRoute] DeletePersonCommand command)
    {
        await _mediator.Send(command);
        return NoContent();
    }
}