using Actio.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Extensions;

internal static class UserExtensions
{
    public static ModelBuilder ConfigureUserModel(this ModelBuilder modelBuilder)
    {
        // PK
        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);
        // Fields
        modelBuilder.Entity<User>()
            .Property(u => u.Name)
            .IsRequired()
            .HasMaxLength(100);
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
        modelBuilder.Entity<User>()
            .Property(u => u.Password)
            .IsRequired();
        // Stuff Relation
        modelBuilder.Entity<User>()
            .HasMany(u => u.Stuffs)
            .WithOne(s => s.User);
        // Project Relation
        modelBuilder.Entity<User>()
            .HasMany(u => u.Projects)
            .WithOne(s => s.User);
        // Timestamps
        modelBuilder.Entity<User>()
            .Property(u => u.CreatedAt)
            .IsRequired();
        modelBuilder.Entity<User>()
            .Property(u => u.UpdatedAt)
            .IsRequired();
        return modelBuilder;
    }
}
