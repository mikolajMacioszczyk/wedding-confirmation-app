using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Commands.CreatePersonConfirmation;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Commands.UpdatePersonConfirmation;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.DTOs;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Queries.ByInvitation;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Queries.GetAllPersonConfirmations;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Queries.GetPersonConfirmationById;

namespace WeddingConfirmationApp.Api.Controllers;

[Authorize(Roles = "Administrator")]
public class PersonConfirmationsController : BaseApiController
{
    public PersonConfirmationsController(IMediator mediator) : base(mediator)
    {}

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PersonConfirmationDto>>> GetAll()
    {
        return Ok(await _mediator.Send(new GetAllPersonConfirmationsQuery()));
    }

    [HttpGet("{Id}")]
    public Task<ActionResult<PersonConfirmationDto>> GetById([FromRoute] GetPersonConfirmationByIdQuery query) => HandleRequest(query);

    [HttpGet("by-invitation/{InvitationId}")]
    [AllowAnonymous]
    public Task<ActionResult<IEnumerable<PersonConfirmationDto>>> GetByInvitation([FromRoute] GetPersonConfirmationsByInvitationQuery query) => HandleRequest(query);

    [HttpPost]
    [AllowAnonymous]
    public Task<ActionResult<PersonConfirmationDto>> Create([FromBody] CreatePersonConfirmationCommand command) => HandleRequest(command, isCreate: true);

    [HttpPut()]
    [AllowAnonymous]
    public Task<ActionResult<PersonConfirmationDto>> Update([FromBody] UpdatePersonConfirmationCommand command) => HandleRequest(command);
}