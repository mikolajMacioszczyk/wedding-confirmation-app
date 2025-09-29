using WeddingConfirmationApp.Application.Scopes.Persons.Contracts;
using WeddingConfirmationApp.Application.Scopes.Invitations.Contracts;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.Contracts;
using WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Contracts;
using WeddingConfirmationApp.Domain.Entities;
using WeddingConfirmationApp.Application.Scopes.Users.Contracts;

namespace WeddingConfirmationApp.Application.Contracts;
public interface IUnitOfWork
{
    IPersonRepository PersonRepository { get; }
    IInvitationRepository InvitationRepository { get; }
    IDrinkTypeRepository DrinkTypeRepository { get; }
    IPersonConfirmationRepository PersonConfirmationRepository { get; }
    IUserRepository UserRepository { get; }
    Task<(bool ChangesMade, IEnumerable<BaseDomainEntity> EntitiesWithErrors)> SaveChangesAsync(bool continueOnError = false);
}
