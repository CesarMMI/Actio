using Actio.Domain.Models;
using Actio.Domain.Repositories;
using Actio.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Repositories;

internal class EfCoreProjectRepository(AppDbContext context) : IProjectRepository
{
    public async Task<IList<Project>> GetAllAsync(int userId)
    {
        return await context.Projects
            .Where(a => a.UserId == userId)
            .ToListAsync();
    }

    public async Task<Project?> GetByIdAsync(int id, int userId)
    {
        return await context.Projects
            .Where(a => a.Id == id && a.UserId == userId)
            .FirstOrDefaultAsync();
    }

    public async Task<Project> CreateAsync(Project project)
    {

        await context.Projects.AddAsync(project);
        await context.SaveChangesAsync();
        return project;
    }

    public async Task<Project> DeleteAsync(Project project)
    {
        context.Projects.Attach(project);
        context.Projects.Remove(project);
        await context.SaveChangesAsync();
        return project;
    }    

    public async Task<Project> UpdateAsync(Project project)
    {
        context.Projects.Attach(project);
        await context.SaveChangesAsync();
        return project;
    }
}
