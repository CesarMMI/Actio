using Actio.Domain.Models;

namespace Actio.Domain.Repositories;

public interface IProjectRepository
{
    Task<IList<Project>> GetAllAsync(int userId);
    Task<Project?> GetByIdAsync(int id, int userId);
    Task<Project> CreateAsync(Project project);
    Task<Project> UpdateAsync(Project project);
    Task<Project> DeleteAsync(Project project);
}
