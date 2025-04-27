using Actio.Domain.Models;

namespace Actio.Domain.Repositories;

public interface IStuffRepository
{
    Task<IList<Stuff>> GetAllAsync(int userId);
    Task<Stuff?> GetByIdAsync(int id, int userId);
    Task<Stuff> CreateAsync(Stuff stuff);
    Task<Stuff> UpdateAsync(Stuff stuff);
    Task<Stuff> DeleteAsync(Stuff stuff);
}
