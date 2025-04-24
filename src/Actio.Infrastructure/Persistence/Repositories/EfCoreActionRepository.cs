using Actio.Domain.Dto;
using Actio.Domain.Repositories;
using Actio.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Repositories;

internal class EfCoreActionRepository(AppDbContext context) : IActionRepository
{
    public async Task<IList<Domain.Models.Action>> GetAllAsync(ActionQuery query)
    {
        return await context.Actions
            .Where(a => (
                a.Type == query.Type &&
                a.Done == query.Done &&
                a.UserId == query.UserId
            ))
            .ToListAsync();
    }

    public async Task<Domain.Models.Action?> GetByIdAsync(int id, int userId)
    {
        return await context.Actions
            .Where(a => a.Id == id && a.UserId == userId)
            .FirstOrDefaultAsync();
    }

    public async Task<Domain.Models.Action> CreateAsync(Domain.Models.Action action)
    {
        await context.Actions.AddAsync(action);
        await context.SaveChangesAsync();
        return action;
    }

    public async Task<Domain.Models.Action> DeleteAsync(Domain.Models.Action action)
    {
        context.Actions.Attach(action);
        context.Actions.Remove(action);
        await context.SaveChangesAsync();
        return action;
    }

    public async Task<Domain.Models.Action> UpdateAsync(Domain.Models.Action action)
    {
        context.Actions.Attach(action);
        await context.SaveChangesAsync();
        return action;
    }
}
