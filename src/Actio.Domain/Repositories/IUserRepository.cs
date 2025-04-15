using Actio.Domain.Models;

namespace Actio.Domain.Repositories;

public interface IUserRepository
{
    Task<User?> FindByIdAsync(int id);
    Task<User?> FindByEmailAsync(string email);
    Task<User> CreateAsync(User user);
}
