using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingConfirmationApp.Application.Scopes.Users.Commands.Login;
using WeddingConfirmationApp.Application.Scopes.Users.Models;

namespace WeddingConfirmationApp.Api.Controllers;

// TODO: FE

public class AuthController : BaseApiController
{
    public AuthController(IMediator mediator) : base(mediator)
    {}

    [HttpPost("login")]
    [AllowAnonymous]
    public Task<ActionResult<LoginResponse>> Login([FromBody] LoginCommand command) => HandleRequest(command);
}