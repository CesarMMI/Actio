using Actio.Application.Auth.Services;
using Actio.Domain.Repositories;
using Actio.Infrastructure.Identity;
using Actio.Infrastructure.Persistence.Ef;
using Actio.Infrastructure.Persistence.Ef.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Actio.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("SqlServer")));
        
        services.AddScoped<IUserRepository, UserEfRepository>();
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<IJwtService, JwtService>();

        return services;
    }
}
