using Actio.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Extensions;

internal static class UserExtensions
{
    public static ModelBuilder ConfigureUserModel(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);

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
        modelBuilder.Entity<User>()

            .Property(u => u.CreatedAt)
            .IsRequired();
        modelBuilder.Entity<User>()
            .Property(u => u.UpdatedAt)
            .IsRequired();

        return modelBuilder;
    }
}
