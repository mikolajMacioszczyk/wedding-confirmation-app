using MediatR;
using Microsoft.AspNetCore.Mvc;
using WeddingConfirmationApp.Application.Models;

namespace WeddingConfirmationApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseApiController<TController> : ControllerBase
    where TController : BaseApiController<TController>
{
    protected readonly IMediator _mediator;
    protected readonly ILogger<TController> _logger;

    public BaseApiController(IMediator mediator, ILogger<TController> logger)
    {
        _mediator = mediator;
        _logger = logger;
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
            _logger.LogWarning("Returning 404 Not Found for request {request}. Reason: {reason}", request, result.ErrorMessage);
            return NotFound(result.ErrorMessage);
        }

        _logger.LogWarning("Returning 400 Bad Request for request {request}. Reason: {reason}", request, result.ErrorMessage);
        return BadRequest(result.ErrorMessage);
    }
}
