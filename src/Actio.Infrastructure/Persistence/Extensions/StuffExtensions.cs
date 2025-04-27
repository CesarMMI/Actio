using Actio.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Extensions;

internal static class StuffExtensions
{
    public static ModelBuilder ConfigureStuffModel(this ModelBuilder modelBuilder)
    {
        // PK
        modelBuilder.Entity<Stuff>()
            .HasKey(a => a.Id);
        // Fields
        modelBuilder.Entity<Stuff>()
            .Property(a => a.Title)
            .IsRequired()
            .HasMaxLength(100);
        modelBuilder.Entity<Stuff>()
            .Property(a => a.Description)
            .IsRequired(false)
            .HasColumnType("nvarchar(max)");
        modelBuilder.Entity<Stuff>()
            .Property(a => a.Type)
            .IsRequired();
        // Project Relation
        modelBuilder.Entity<Stuff>()
            .Property(a => a.ProjectId)
            .IsRequired(false);
        modelBuilder.Entity<Stuff>()
            .HasOne(a => a.Project)
            .WithMany(u => u.Stuffs)
            .HasForeignKey(a => a.ProjectId)
            .OnDelete(DeleteBehavior.ClientSetNull);
        // User Relation
        modelBuilder.Entity<Stuff>()
            .Property(a => a.UserId)
            .IsRequired();        
        modelBuilder.Entity<Stuff>()
            .HasOne(a => a.User)
            .WithMany(u => u.Stuffs)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        // Timestamps
        modelBuilder.Entity<Stuff>()
            .Property(a => a.CreatedAt)
            .IsRequired();        
        modelBuilder.Entity<Stuff>()
            .Property(a => a.UpdatedAt)
            .IsRequired();
        return modelBuilder;
    }
}
