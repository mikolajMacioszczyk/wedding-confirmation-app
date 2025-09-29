using WeddingConfirmationApp.Application.Models;
using WeddingConfirmationApp.Application.Scopes.Users.Models;

namespace WeddingConfirmationApp.Application.Scopes.Users.Contracts;

public interface IAuthService
{
    Task<Result<LoginResponse>> LoginAsync(string username, string password);
    Task<Result<bool>> ValidateTokenAsync(string token);
}