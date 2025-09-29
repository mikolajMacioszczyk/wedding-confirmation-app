using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Application.Scopes.Users.Contracts;

public interface IUserRepository
{
    Task<User?> GetByUsername(string username);
}
