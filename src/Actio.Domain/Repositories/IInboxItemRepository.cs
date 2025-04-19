using Actio.Domain.Models;

namespace Actio.Domain.Repositories;

public interface IInboxItemRepository
{
    Task<IList<InboxItem>> GetAllAsync(int userId);
    Task<InboxItem?> GetByIdAsync(int userId, int id);
    Task<InboxItem> CreateAsync(InboxItem inboxItem);
    Task<InboxItem> UpdateAsync(InboxItem inboxItem);
    Task<InboxItem> DeleteAsync(InboxItem inboxItem);
}
