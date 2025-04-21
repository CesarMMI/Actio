using Actio.Domain.Dto;
using Actio.Domain.Repositories;
using Actio.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Repositories;

internal class EfCoreActionRepository(AppDbContext context) : IActionRepository
{
    public async Task<Domain.Models.Action> CreateAsync(Domain.Models.Action action)
    {

        action.DoneAt = action.Done ? DateTime.UtcNow : null;
        await context.Actions.AddAsync(action);
        await context.SaveChangesAsync();
        return action;
    }

    public async Task<Domain.Models.Action?> DeleteAsync(int userId, int id)
    {
        var action = await GetByIdAsync(userId, id);

        if (action is null) return null;

        context.Actions.Attach(action);
        context.Actions.Remove(action);
        await context.SaveChangesAsync();

        return action;
    }

    public async Task<BaseResultPaginated<Domain.Models.Action>> GetAllAsync(BaseQueryPaginated query)
    {
        IQueryable<Domain.Models.Action> queryable = context.Actions;

        var itemCount = await queryable.CountAsync();
        var pageCount = (int)Math.Ceiling(itemCount / (double)query.PageSize);

        var itens = await queryable
            .Where(a => a.UserId == query.UserId)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        return new BaseResultPaginated<Domain.Models.Action>
        {
            Data = itens,
            Page = query.Page,
            PageCount = pageCount,
            ItemCount = itemCount
        };
    }

    public async Task<Domain.Models.Action?> GetByIdAsync(int userId, int id)
    {
        return await context.Actions
            .Where(a => a.UserId == userId && a.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<Domain.Models.Action?> UpdateAsync(int userId, int id, Domain.Models.Action action)
    {
        var savedAction = await GetByIdAsync(userId, id);

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
