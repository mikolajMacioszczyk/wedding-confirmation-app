using MediatR;
using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Users.Models;

namespace WeddingConfirmationApp.Application.Scopes.Users.Commands.Login;

public record LoginCommand(string Username, string Password) : IRequest<Result<LoginResponse>>;
