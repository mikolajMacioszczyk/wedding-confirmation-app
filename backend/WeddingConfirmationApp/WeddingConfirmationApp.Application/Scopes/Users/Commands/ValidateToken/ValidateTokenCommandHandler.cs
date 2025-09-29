using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Users.Contracts;

namespace WeddingConfirmationApp.Application.Scopes.Users.Commands.ValidateToken;

public class ValidateTokenCommandHandler : IRequestHandler<ValidateTokenCommand, Result<bool>>
{
    private readonly IAuthService _authService;

    public ValidateTokenCommandHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public Task<Result<bool>> Handle(ValidateTokenCommand request, CancellationToken cancellationToken)
    {
        return _authService.ValidateTokenAsync(request.Token);
    }
}
