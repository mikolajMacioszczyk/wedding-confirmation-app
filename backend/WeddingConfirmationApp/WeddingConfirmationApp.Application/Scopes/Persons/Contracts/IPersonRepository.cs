using WeddingConfirmationApp.Domain.Models;

namespace WeddingConfirmationApp.Application.Scopes.Persons.Contracts;

public interface IPersonRepository
{
    Task<IEnumerable<Person>> GetAllAsync();
    Task<Person?> GetByIdAsync(Guid id);
    Task<Person> AddAsync(Person person);
    Task<Person> UpdateAsync(Person person);
    Task DeleteAsync(Guid id);
}