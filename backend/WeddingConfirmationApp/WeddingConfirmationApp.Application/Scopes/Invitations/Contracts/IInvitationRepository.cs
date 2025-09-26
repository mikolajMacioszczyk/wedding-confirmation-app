using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Application.Scopes.Invitations.Contracts;

public interface IInvitationRepository
{
    Task<IEnumerable<Invitation>> GetAllAsync();
    Task<Invitation?> GetByIdAsync(Guid id);
    Task<Invitation?> GetByPublicIdAsync(string publicId);
    Task<Invitation> AddAsync(Invitation invitation);
    Task<Invitation> UpdateAsync(Invitation invitation);
    Task DeleteAsync(Invitation invitation);
}