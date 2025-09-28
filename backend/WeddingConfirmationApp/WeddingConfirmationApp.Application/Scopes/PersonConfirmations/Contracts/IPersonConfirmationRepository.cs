using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Application.Scopes.PersonConfirmations.Contracts;

public interface IPersonConfirmationRepository
{
    Task<IEnumerable<PersonConfirmation>> GetAllAsync();
    Task<PersonConfirmation?> GetByIdAsync(Guid id);
    Task<IEnumerable<PersonConfirmation>> GetByInvitationIdAsync(Guid invitationId);
    Task<PersonConfirmation> AddAsync(PersonConfirmation personConfirmation);
    Task<PersonConfirmation> UpdateAsync(PersonConfirmation personConfirmation);
    Task DeleteAsync(PersonConfirmation personConfirmation);
}