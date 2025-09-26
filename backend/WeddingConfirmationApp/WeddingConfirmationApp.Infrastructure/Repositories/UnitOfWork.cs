using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Scopes.Persons.Contracts;
using WeddingConfirmationApp.Application.Scopes.Invitations.Contracts;
using WeddingConfirmationApp.Application.Scopes.DrinkTypes.Contracts;
using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Infrastructure.Repositories;
public class UnitOfWork : IUnitOfWork
{
    public IPersonRepository PersonRepository { get; }
    public IInvitationRepository InvitationRepository { get; }
    public IDrinkTypeRepository DrinkTypeRepository { get; }

    private readonly WeddingDbContext _context;
    private readonly ILogger<UnitOfWork> _logger;

    public UnitOfWork(WeddingDbContext context, ILogger<UnitOfWork> logger)
    {
        _context = context;
        _logger = logger;
        PersonRepository = new PersonRepository(context);
        InvitationRepository = new InvitationRepository(context);
        DrinkTypeRepository = new DrinkTypeRepository(context);
    }

    public async Task<(bool ChangesMade, IEnumerable<BaseDomainEntity> EntitiesWithErrors)> SaveChangesAsync(bool continueOnError = false)
    {
        if (!continueOnError)
        {
            return (await _context.SaveChangesAsync() > 0, Enumerable.Empty<BaseDomainEntity>());
        }

        bool saved = false;
        bool changesMade = false;
        List<BaseDomainEntity> entitiesWithErrors = new();

        while (!saved)
        {
            try
            {
                changesMade = await _context.SaveChangesAsync() > 0;
                saved = true;
            }
            // Will be thrown if somebody else modified entity in the meantime
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogDebug("[{Now}]: Encountered concurrency exception...", DateTime.Now);

                // Get entries that caused an exception
                foreach (var entry in ex.Entries)
                {
                    // Replace values with the ones recently saved to bypass this exception
                    var databaseValues = await entry.GetDatabaseValuesAsync();

                    _logger.LogDebug("[{Now}]: Replacing values for entity from database: {Values}",
                        DateTime.Now, string.Join(Environment.NewLine, entry.CurrentValues.Properties.Select(p => $"{p.Name}: {entry.CurrentValues[p.Name]} -> {databaseValues?[p.Name]}")));

                    entry.CurrentValues.SetValues(databaseValues!);
                    entry.OriginalValues.SetValues(databaseValues!);

                    entitiesWithErrors.Add(entry.Entity as BaseDomainEntity
                        ?? throw new InvalidOperationException($"The entity with ID {entry.CurrentValues["Id"]} is not a {nameof(BaseDomainEntity)}"));
                }
            }
            // Will be thrown if deleting the entity violates database constraints
            catch (DbUpdateException ex)
            {
                _logger.LogDebug("[{Now}]: Encountered db update exception...", DateTime.Now);

                // Get entries that caused an exception
                foreach (var entry in ex.Entries)
                {
                    _logger.LogDebug("[{Now}]: Detaching an entity with ID {Id}",
                        DateTime.Now, entry.CurrentValues["Id"]);

                    // Detach such entry and leave it unchanged
                    entry.State = EntityState.Detached;

                    entitiesWithErrors.Add(entry.Entity as BaseDomainEntity
                        ?? throw new InvalidOperationException($"The entity with ID {entry.CurrentValues["Id"]} is not a {nameof(BaseDomainEntity)}"));
                }
            }
        }

        return (changesMade, entitiesWithErrors);
    }
}
