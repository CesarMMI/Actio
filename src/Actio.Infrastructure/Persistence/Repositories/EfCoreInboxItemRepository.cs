using Actio.Domain.Models;
using Actio.Domain.Repositories;
using Actio.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Repositories;

internal class EfCoreInboxItemRepository(AppDbContext context) : IInboxItemRepository
{
    public async Task<InboxItem> CreateAsync(InboxItem inboxItem)
    {
        await context.InboxItems.AddAsync(inboxItem);
        await context.SaveChangesAsync();
        return inboxItem;
    }

    public async Task<InboxItem> DeleteAsync(InboxItem inboxItem)
    {
        context.InboxItems.Attach(inboxItem);
        context.InboxItems.Remove(inboxItem);
        await context.SaveChangesAsync();
        return inboxItem;
    }

    public async Task<IList<InboxItem>> GetAllAsync(int userId)
    {
        return await context.InboxItems
            .Where(a => a.UserId == userId)
            .ToListAsync();
    }

    public async Task<InboxItem?> GetByIdAsync(int userId, int id)
    {
        return await context.InboxItems
            .Where(a => a.UserId == userId && a.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<InboxItem> UpdateAsync(InboxItem inboxItem)
    {
        context.InboxItems.Attach(inboxItem);
        await context.SaveChangesAsync();
        return inboxItem;
    }
}
