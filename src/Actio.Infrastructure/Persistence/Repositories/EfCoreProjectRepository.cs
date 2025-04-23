using Actio.Domain.Dto;
using Actio.Domain.Models;
using Actio.Domain.Repositories;
using Actio.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Repositories;

internal class EfCoreProjectRepository(AppDbContext context) : IProjectRepository
{
    public async Task<Project> CreateAsync(Project project)
    {

        await context.Projects.AddAsync(project);
        await context.SaveChangesAsync();
        return project;
    }

    public async Task<Project?> DeleteAsync(IdQuery query)
    {
        var project = await GetByIdAsync(query);

        if (project is null) return null;

        context.Projects.Attach(project);
        context.Projects.Remove(project);
        await context.SaveChangesAsync();

        return project;
    }

    public async Task<IList<Project>> GetAllAsync(BaseQuery query)
    {
        return await context.Projects
            .Where(a => a.UserId == query.UserId)
            .ToListAsync();
    }

    public async Task<Project?> GetByIdAsync(IdQuery query)
    {
        return await context.Projects
            .Where(a => a.UserId == query.UserId && a.Id == query.Id)
            .FirstOrDefaultAsync();
    }

    public async Task<Project?> UpdateAsync(IdQuery query, Project project)
    {
        var savedProject = await GetByIdAsync(query);

        if (savedProject is null) return null;

        savedProject.Name = project.Name;
        savedProject.Color = project.Color;
        savedProject.UpdatedAt = DateTime.UtcNow;

        context.Projects.Attach(savedProject);
        await context.SaveChangesAsync();
        return savedProject;
    }
}
