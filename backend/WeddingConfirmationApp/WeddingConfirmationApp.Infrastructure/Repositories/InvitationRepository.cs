using Microsoft.EntityFrameworkCore;
using WeddingConfirmationApp.Application.Scopes.Invitations.Contracts;
using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Infrastructure.Repositories;

public class InvitationRepository : IInvitationRepository
{
    private readonly WeddingDbContext _context;

    public InvitationRepository(WeddingDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Invitation>> GetAllAsync()
    {
        return await _context.Invitations.ToListAsync();
    }

    public async Task<Invitation?> GetByIdAsync(Guid id)
    {
        return await _context.Invitations.Include(i => i.Persons).FirstOrDefaultAsync(i => i.Id == id);
    }

    public Task<Invitation> AddAsync(Invitation invitation)
    {
        _context.Invitations.Add(invitation);
        return Task.FromResult(invitation);
    }

    public Task<Invitation> UpdateAsync(Invitation invitation)
    {
        _context.Entry(invitation).State = EntityState.Modified;
        return Task.FromResult(invitation);
    }

    public Task DeleteAsync(Invitation invitation)
    {
        _context.Invitations.Remove(invitation);
        return Task.CompletedTask;
    }
}