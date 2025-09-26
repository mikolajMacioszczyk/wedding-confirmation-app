using Microsoft.EntityFrameworkCore;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.Contracts;
using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Infrastructure.Repositories;

public class DrinkTypeRepository : IDrinkTypeRepository
{
    private readonly WeddingDbContext _context;

    public DrinkTypeRepository(WeddingDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DrinkType>> GetAllAsync()
    {
        return await _context.DrinkTypes.ToListAsync();
    }

    public async Task<DrinkType?> GetByIdAsync(Guid id)
    {
        return await _context.DrinkTypes.FindAsync(id);
    }

    public Task<DrinkType?> GetByTypeAsync(string type)
    {
        return _context.DrinkTypes.FirstOrDefaultAsync(d => d.Type == type);
    }

    public Task<DrinkType> AddAsync(DrinkType drinkType)
    {
        drinkType.Id = Guid.NewGuid();
        _context.DrinkTypes.Add(drinkType);
        return Task.FromResult(drinkType);
    }

    public Task<DrinkType> UpdateAsync(DrinkType drinkType)
    {
        _context.Entry(drinkType).State = EntityState.Modified;
        return Task.FromResult(drinkType);
    }

    public Task DeleteAsync(DrinkType drinkType)
    {
        _context.DrinkTypes.Remove(drinkType);
        return Task.CompletedTask;
    }
}