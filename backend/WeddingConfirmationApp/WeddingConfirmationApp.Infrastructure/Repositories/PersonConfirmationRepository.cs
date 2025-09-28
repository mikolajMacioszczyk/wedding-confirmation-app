using Microsoft.EntityFrameworkCore;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Contracts;
using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Infrastructure.Repositories;

public class PersonConfirmationRepository : IPersonConfirmationRepository
{
    private readonly WeddingDbContext _context;

    public PersonConfirmationRepository(WeddingDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PersonConfirmation>> GetAllAsync()
    {
        return await _context.PersonConfirmations
            .Include(pc => pc.Invitation)
            .Include(pc => pc.Person)
            .Include(pc => pc.SelectedDrink)
            .ToListAsync();
    }

    public async Task<PersonConfirmation?> GetByIdAsync(Guid id)
    {
        return await _context.PersonConfirmations
            .Include(pc => pc.Invitation)
            .Include(pc => pc.Person)
            .Include(pc => pc.SelectedDrink)
            .FirstOrDefaultAsync(pc => pc.Id == id);
    }

    public async Task<IEnumerable<PersonConfirmation>> GetByInvitationIdAsync(Guid invitationId)
    {
        return await _context.PersonConfirmations
            .Include(pc => pc.Invitation)
            .Include(pc => pc.Person)
            .Include(pc => pc.SelectedDrink)
            .Where(pc => pc.InvitationId == invitationId)
            .ToListAsync();
    }

    public Task<PersonConfirmation?> GetByInvitationIdAndPersonIdAsync(Guid invitationId, Guid personId)
    {
        return _context.PersonConfirmations
            .Include(pc => pc.Invitation)
            .Include(pc => pc.Person)
            .Include(pc => pc.SelectedDrink)
            .FirstOrDefaultAsync(pc => pc.InvitationId == invitationId && pc.PersonId == personId);
    }

    public Task<PersonConfirmation> AddAsync(PersonConfirmation personConfirmation)
    {
        _context.PersonConfirmations.Add(personConfirmation);
        return Task.FromResult(personConfirmation);
    }

    public Task<PersonConfirmation> UpdateAsync(PersonConfirmation personConfirmation)
    {
        _context.Entry(personConfirmation).State = EntityState.Modified;
        return Task.FromResult(personConfirmation);
    }

    public Task DeleteAsync(PersonConfirmation personConfirmation)
    {
        _context.PersonConfirmations.Remove(personConfirmation);
        return Task.CompletedTask;
    }
}