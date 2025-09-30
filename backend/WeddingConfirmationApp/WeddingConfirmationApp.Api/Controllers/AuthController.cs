using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingConfirmationApp.Application.Scopes.Users.Commands.Login;
using WeddingConfirmationApp.Application.Scopes.Users.Models;

namespace WeddingConfirmationApp.Api.Controllers;

public class AuthController : BaseApiController<AuthController>
{
    public AuthController(IMediator mediator, ILogger<AuthController> logger) : base(mediator, logger)
    {}

    [HttpPost("login")]
    [AllowAnonymous]
    public Task<ActionResult<LoginResponse>> Login([FromBody] LoginCommand command) => HandleRequest(command);
}