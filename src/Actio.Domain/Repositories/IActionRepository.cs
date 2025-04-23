using Actio.Domain.Dto;

namespace Actio.Domain.Repositories;

public interface IActionRepository
{
    Task<IList<Models.Action>> GetAllAsync(ActionQuery query);
    Task<Models.Action?> GetByIdAsync(IdQuery query);
    Task<Models.Action> CreateAsync(Models.Action action);
    Task<Models.Action?> UpdateAsync(IdQuery query, Models.Action action);
    Task<Models.Action?> DeleteAsync(IdQuery query);
}
