using Actio.Domain.Models;
using Actio.Domain.Repositories;
using Actio.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Repositories;

internal class EfCoreStuffRepository(AppDbContext context) : IStuffRepository
{
    public async Task<IList<Stuff>> GetAllAsync(int userId)
    {
        return await context.Stuffs
            .Where(a => a.UserId == userId)
            .ToListAsync();
    }

    public async Task<Stuff?> GetByIdAsync(int id, int userId)
    {
        return await context.Stuffs
            .Where(a => a.Id == id && a.UserId == userId)
            .FirstOrDefaultAsync();
    }

    public async Task<Stuff> CreateAsync(Stuff project)
    {

        await context.Stuffs.AddAsync(project);
        await context.SaveChangesAsync();
        return project;
    }

    public async Task<Stuff> DeleteAsync(Stuff project)
    {
        context.Stuffs.Attach(project);
        context.Stuffs.Remove(project);
        await context.SaveChangesAsync();
        return project;
    }    

    public async Task<Stuff> UpdateAsync(Stuff project)
    {
        context.Stuffs.Attach(project);
        await context.SaveChangesAsync();
        return project;
    }
}
