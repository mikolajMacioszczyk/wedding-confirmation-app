using Microsoft.EntityFrameworkCore;
using WeddingConfirmationApp.Application.Scopes.Users.Contracts;
using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly WeddingDbContext _context;

    public UserRepository(WeddingDbContext context)
    {
        _context = context;
    }

    public Task<User?> GetByUsername(string username)
    {
        return _context.Users.FirstOrDefaultAsync(u => u.Username == username);
    }
}
