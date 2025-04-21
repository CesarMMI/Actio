using Actio.Domain.Dto;

namespace Actio.Domain.Repositories;

public interface IActionRepository
{
    Task<BaseResultPaginated<Models.Action>> GetAllAsync(BaseQueryPaginated query);
    Task<Models.Action?> GetByIdAsync(int userId, int id);
    Task<Models.Action> CreateAsync(Models.Action action);
    Task<Models.Action?> UpdateAsync(int userId, int id, Models.Action action);
    Task<Models.Action?> DeleteAsync(int userId, int id);
}
