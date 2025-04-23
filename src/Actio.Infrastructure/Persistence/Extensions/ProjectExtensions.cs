using Actio.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Extensions;

internal static class ProjectExtensions
{
    public static ModelBuilder ConfigureProjectModel(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Project>()
            .HasKey(p => p.Id);

        modelBuilder.Entity<Project>()
            .Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(100);
        modelBuilder.Entity<Project>()
            .Property(p => p.Color)
            .IsRequired(false)
            .HasMaxLength(7);

        modelBuilder.Entity<Project>()
            .Property(p => p.UserId)
            .IsRequired();
        modelBuilder.Entity<Project>()
            .HasOne(p => p.User)
            .WithMany(p => p.Projects)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Project>()
            .Property(p => p.CreatedAt)
            .IsRequired();
        modelBuilder.Entity<Project>()
            .Property(p => p.UpdatedAt)
            .IsRequired();

        return modelBuilder;
    }
}
