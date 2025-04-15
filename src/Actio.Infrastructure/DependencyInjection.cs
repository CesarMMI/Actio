using Actio.Application.Interfaces;
using Actio.Domain.Repositories;
using Actio.Infrastructure.Identity;
using Actio.Infrastructure.Persistence;
using Actio.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Actio.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        return services
            .AddDb(configuration)
            .AddRepositories()
            .AddOthers();
    }

    private static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<IUserRepository, EfCoreUserRepository>();
        return services;
    }

    private static IServiceCollection AddOthers(this IServiceCollection services)
    {
        services.AddScoped<IPasswordHasher, AspNetPasswordHasher>();
        return services;
    }

    private static IServiceCollection AddDb(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
        });
        return services;
    }
}
