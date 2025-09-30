using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingConfirmationApp.Application.Scopes.Invitations.Commands.AddPersonToInvitation;
using WeddingConfirmationApp.Application.Scopes.Invitations.Commands.CreateInvitation;
using WeddingConfirmationApp.Application.Scopes.Invitations.Commands.RemovePersonFromInvitation;
using WeddingConfirmationApp.Application.Scopes.Invitations.Commands.UpdateInvitation;
using WeddingConfirmationApp.Application.Scopes.Invitations.DTOs;
using WeddingConfirmationApp.Application.Scopes.Invitations.Queries.GetAllInvitations;
using WeddingConfirmationApp.Application.Scopes.Invitations.Queries.GetInvitationById;
using WeddingConfirmationApp.Application.Scopes.Invitations.Queries.GetInvitationByPublicId;

namespace WeddingConfirmationApp.Api.Controllers;

[Authorize(Roles = "Administrator")]
public class InvitationsController : BaseApiController<InvitationsController>
{
    public InvitationsController(IMediator mediator, ILogger<InvitationsController> logger) : base(mediator, logger)
    {}

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InvitationDto>>> GetAll()
    {
        return Ok(await _mediator.Send(new GetAllInvitationsQuery()));
    }

    [HttpGet("{Id}")]
    public Task<ActionResult<InvitationDto>> GetById([FromRoute] GetInvitationByIdQuery query) => HandleRequest(query);

    [HttpGet("by-public-id/{PublicId}")]
    [AllowAnonymous]
    public Task<ActionResult<InvitationDto>> GetByPublicId([FromRoute] GetInvitationByPublicIdQuery query) => HandleRequest(query);

    [HttpPost]
    public Task<ActionResult<InvitationDto>> Create([FromBody] CreateInvitationCommand command) => HandleRequest(command);

    [HttpPut]
    public Task<ActionResult<InvitationDto>> Update([FromBody] UpdateInvitationCommand command) => HandleRequest(command);

    [HttpPost("{InvitationId}/persons/{PersonId}")]
    public Task<ActionResult<InvitationDto>> AddPersonToInvitation([FromRoute] AddPersonToInvitationCommand command) => HandleRequest(command);

    [HttpDelete("{InvitationId}/persons/{PersonId}")]
    public Task<ActionResult<InvitationDto>> RemovePersonFromInvitation([FromRoute] RemovePersonFromInvitationCommand command) => HandleRequest(command);
}