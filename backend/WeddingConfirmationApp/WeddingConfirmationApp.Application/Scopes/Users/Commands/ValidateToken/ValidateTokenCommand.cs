using MediatR;
using WeddingConfirmationApp.Application.Models;

namespace WeddingConfirmationApp.Application.Scopes.Users.Commands.ValidateToken;

public record ValidateTokenCommand(string Token) : IRequest<Result<bool>>;
