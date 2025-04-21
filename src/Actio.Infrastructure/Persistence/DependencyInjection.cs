using Actio.Domain.Repositories;
using Actio.Infrastructure.Persistence.Context;
using Actio.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Actio.Infrastructure.Persistence;

internal static class DependencyInjection
{
    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
        });

        services.AddScoped<IUserRepository, EfCoreUserRepository>();
        services.AddScoped<IActionRepository, EfCoreActionRepository>();

        return services;
    }
}
