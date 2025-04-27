using Actio.Domain.Models;
using Actio.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Context;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Stuff> Stuffs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder
            .ConfigureUserModel()
            .ConfigureStuffModel();
    }
}
