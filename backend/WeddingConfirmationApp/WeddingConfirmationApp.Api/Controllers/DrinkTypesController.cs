using MediatR;
using Microsoft.AspNetCore.Mvc;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.Commands.CreateDrinkType;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.Commands.DeleteDrinkType;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.DTOs;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.Queries.GetAllDrinkTypes;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.Queries.GetDrinkTypeById;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.Queries.GetDrinkTypeByType;

namespace WeddingConfirmationApp.Api.Controllers;

public class DrinkTypesController : BaseApiController
{
    public DrinkTypesController(IMediator mediator) : base(mediator)
    {}

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DrinkTypeDto>>> GetAll()
    {
        return Ok(await _mediator.Send(new GetAllDrinkTypesQuery()));
    }

    [HttpGet("{Id}")]
    public Task<ActionResult<DrinkTypeDto>> GetById([FromRoute] GetDrinkTypeByIdQuery query) => HandleRequest(query);

    [HttpGet("by-type/{Type}")]
    public Task<ActionResult<DrinkTypeDto>> GetByType([FromRoute] GetDrinkTypeByTypeQuery query) => HandleRequest(query);

    [HttpPost]
    public Task<ActionResult<DrinkTypeDto>> Create([FromBody] CreateDrinkTypeCommand command) => HandleRequest(command);

    [HttpDelete("{Id}")]
    public Task<ActionResult<Empty>> Delete([FromRoute] DeleteDrinkTypeCommand command) => HandleRequest(command);
}