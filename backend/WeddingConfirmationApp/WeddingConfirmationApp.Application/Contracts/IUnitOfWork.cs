using WeddingConfirmationApp.Application.Scopes.Persons.Contracts;
using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Application.Contracts;
public interface IUnitOfWork
{
    IPersonRepository PersonRepository { get; }
    Task<(bool ChangesMade, IEnumerable<BaseDomainEntity> EntitiesWithErrors)> SaveChangesAsync(bool continueOnError = false);
}
