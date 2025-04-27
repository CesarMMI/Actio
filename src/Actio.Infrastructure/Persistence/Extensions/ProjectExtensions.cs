using Actio.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Extensions;

internal static class ProjectExtensions
{
    public static ModelBuilder ConfigureProjectModel(this ModelBuilder modelBuilder)
    {
        // PK
        modelBuilder.Entity<Project>()
            .HasKey(a => a.Id);
        // Fields
        modelBuilder.Entity<Project>()
            .Property(a => a.Name)
            .IsRequired()
            .HasMaxLength(100);
        modelBuilder.Entity<Project>()
            .Property(a => a.Color)
            .IsRequired(false)
            .HasMaxLength(7);
        // Stuff Relation
        modelBuilder.Entity<Project>()
            .HasMany(p => p.Stuffs)
            .WithOne(s => s.Project);
        // User Relation
        modelBuilder.Entity<Project>()
            .Property(a => a.UserId)
            .IsRequired();
        modelBuilder.Entity<Project>()
            .HasOne(a => a.User)
            .WithMany(u => u.Projects)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        // Timestamps
        modelBuilder.Entity<Project>()
            .Property(a => a.CreatedAt)
            .IsRequired();        
        modelBuilder.Entity<Project>()
            .Property(a => a.UpdatedAt)
            .IsRequired();
        return modelBuilder;
    }
}
