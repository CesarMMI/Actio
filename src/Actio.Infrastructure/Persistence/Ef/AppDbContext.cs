using Actio.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Ef;

internal class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // User
        modelBuilder.Entity<User>(b =>
        {
            // Id
            b.HasKey(u => u.Id);
            b.Property(u => u.Id).ValueGeneratedOnAdd();
            // Name
            b.Property(u => u.Name).IsRequired().HasMaxLength(100);
            // Email
            b.HasIndex(u => u.Email);
            b.Property(u => u.Email).IsRequired().HasMaxLength(100);
            // HashedPassword
            b.Property(u => u.HashedPassword).IsRequired().HasMaxLength(100);
            // Timestamps
            b.Property(u => u.CreatedAt).IsRequired().ValueGeneratedOnAdd();
            b.Property(u => u.UpdatedAt).IsRequired().ValueGeneratedOnAddOrUpdate();
        });
    }
}
