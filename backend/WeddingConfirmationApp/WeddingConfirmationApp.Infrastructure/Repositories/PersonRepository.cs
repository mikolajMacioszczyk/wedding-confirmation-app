using Microsoft.EntityFrameworkCore;
using WeddingConfirmationApp.Application.Scopes.Persons.Contracts;
using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Infrastructure.Repositories;

public class PersonRepository : IPersonRepository
{
    private readonly WeddingDbContext _context;

    public PersonRepository(WeddingDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Person>> GetAllAsync()
    {
        return await _context.Persons.ToListAsync();
    }

    public async Task<Person?> GetByIdAsync(Guid id)
    {
        return await _context.Persons.FindAsync(id);
    }

    public Task<Person> AddAsync(Person person)
    {
        _context.Persons.Add(person);
        return Task.FromResult(person);
    }

    public Task<Person> UpdateAsync(Person person)
    {
        _context.Entry(person).State = EntityState.Modified;
        return Task.FromResult(person);
    }

    public Task DeleteAsync(Person person)
    {
        _context.Persons.Remove(person);
        return Task.CompletedTask;
    }
}