using Actio.Domain.Models;
using Actio.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Ef.Repositories;

internal class UserEfRepository(AppDbContext appContext) : IUserRepository
{
    public async Task<User> CreateAsync(User user)
    {
        appContext.Users.Add(user);
        await appContext.SaveChangesAsync();
        return user;
    }

    public Task<User?> FindByEmailAsync(string email)
    {
        return appContext.Users.Where(u => u.Email == email).FirstOrDefaultAsync();
    }
}
