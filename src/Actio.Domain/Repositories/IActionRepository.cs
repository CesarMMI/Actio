using Actio.Domain.Dto;

namespace Actio.Domain.Repositories;

public interface IActionRepository
{
    Task<IList<Models.Action>> GetAllAsync(ActionQuery query);
    Task<Models.Action?> GetByIdAsync(int id, int userId);
    Task<Models.Action> CreateAsync(Models.Action action);
    Task<Models.Action> UpdateAsync(Models.Action action);
    Task<Models.Action> DeleteAsync(Models.Action action);
}
