using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Application.Scopes.DrinkTypes.Contracts;

public interface IDrinkTypeRepository
{
    Task<IEnumerable<DrinkType>> GetAllAsync();
    Task<DrinkType?> GetByIdAsync(Guid id);
    Task<DrinkType?> GetByTypeAsync(string type);
    Task<DrinkType> AddAsync(DrinkType drinkType);
    Task<DrinkType> UpdateAsync(DrinkType drinkType);
    Task DeleteAsync(DrinkType drinkType);
}