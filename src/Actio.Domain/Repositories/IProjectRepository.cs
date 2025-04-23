using Actio.Domain.Dto;
using Actio.Domain.Models;

namespace Actio.Domain.Repositories;

public interface IProjectRepository
{
    Task<IList<Project>> GetAllAsync(BaseQuery query);
    Task<Project?> GetByIdAsync(IdQuery query);
    Task<Project> CreateAsync(Project project);
    Task<Project?> UpdateAsync(IdQuery query, Project project);
    Task<Project?> DeleteAsync(IdQuery query);
}
