using MediatR;
using Microsoft.AspNetCore.Mvc;
using WeddingConfirmationApp.Application.Models;

namespace WeddingConfirmationApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{
    protected readonly IMediator _mediator;

    public BaseApiController(IMediator mediator)
    {
        _mediator = mediator;
    }

    protected async Task<ActionResult<T>> HandleRequest<T>(IRequest<Result<T>> request, bool isCreate = false)
    {
        var result = await _mediator.Send(request);

        if (result.IsSuccess)
        {
            return isCreate ? Created("", result.Value) : Ok(result.Value);
        }
        
        if (result.IsNotFound)
        {
            return NotFound(result.ErrorMessage);
        }

        return BadRequest(result.ErrorMessage);
    }
}
