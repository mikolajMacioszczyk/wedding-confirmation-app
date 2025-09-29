using MediatR;
using Microsoft.AspNetCore.Mvc;
using WeddingConfirmationApp.Application.Scopes.Users.Commands.Login;
using WeddingConfirmationApp.Application.Scopes.Users.Commands.ValidateToken;
using WeddingConfirmationApp.Application.Scopes.Users.Models;

namespace WeddingConfirmationApp.Api.Controllers;

// TODO: Swagger
// TODO: FE

public class AuthController : BaseApiController
{
    public AuthController(IMediator mediator) : base(mediator)
    {}

    [HttpPost("login")]
    public Task<ActionResult<LoginResponse>> Login([FromBody] LoginCommand command) => HandleRequest(command);

    [HttpPost("validate")]
    public Task<ActionResult<bool>> ValidateToken([FromBody] ValidateTokenCommand command) => HandleRequest(command);
}