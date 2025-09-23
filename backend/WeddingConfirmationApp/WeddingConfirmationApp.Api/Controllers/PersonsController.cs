using MediatR;
using Microsoft.AspNetCore.Mvc;
using WeddingConfirmationApp.Application.Commands;
using WeddingConfirmationApp.Application.DTOs;
using WeddingConfirmationApp.Application.Queries;

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

    [HttpGet("{id}")]
    public async Task<ActionResult<PersonDto>> GetById(Guid id)
    {
        var query = new GetPersonByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        
        if (result == null)
            return NotFound();
            
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<PersonDto>> Create(CreatePersonDto createPersonDto)
    {
        var command = new CreatePersonCommand
        {
            FirstName = createPersonDto.FirstName,
            LastName = createPersonDto.LastName
        };
        
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PersonDto>> Update(Guid id, UpdatePersonDto updatePersonDto)
    {
        var command = new UpdatePersonCommand
        {
            Id = id,
            FirstName = updatePersonDto.FirstName,
            LastName = updatePersonDto.LastName
        };

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

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var command = new DeletePersonCommand { Id = id };
        await _mediator.Send(command);
        return NoContent();
    }
}