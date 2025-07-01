using Actio.Domain.Models;

namespace Actio.Domain.Repositories;

public interface IUserRepository
{
    Task<User> CreateAsync(User user);
    Task<User?> FindByEmailAsync(string email);
}
