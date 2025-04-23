using Actio.Domain.Dto;
using Actio.Domain.Repositories;
using Actio.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Repositories;

internal class EfCoreActionRepository(AppDbContext context) : IActionRepository
{
    public async Task<Domain.Models.Action> CreateAsync(Domain.Models.Action action)
    {
        await context.Actions.AddAsync(action);
        await context.SaveChangesAsync();
        return action;
    }

    public async Task<Domain.Models.Action?> DeleteAsync(IdQuery query)
    {
        var action = await GetByIdAsync(query);

        if (action is null) return null;

        context.Actions.Attach(action);
        context.Actions.Remove(action);
        await context.SaveChangesAsync();

        return action;
    }

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

    public async Task<Domain.Models.Action?> GetByIdAsync(IdQuery query)
    {
        return await context.Actions
            .Where(a => a.UserId == query.UserId && a.Id == query.Id)
            .FirstOrDefaultAsync();
    }

    public async Task<Domain.Models.Action?> UpdateAsync(IdQuery query, Domain.Models.Action action)
    {
        var savedAction = await GetByIdAsync(query);

        if (savedAction is null) return null;

        savedAction.Title = action.Title;
        savedAction.Description = action.Description;
        savedAction.Type = action.Type;
        savedAction.DoneAt = action.Done && !savedAction.Done ? DateTime.UtcNow : null;
        savedAction.Done = action.Done;
        savedAction.UpdatedAt = DateTime.UtcNow;

        context.Actions.Attach(savedAction);
        await context.SaveChangesAsync();
        return savedAction;
    }
}
