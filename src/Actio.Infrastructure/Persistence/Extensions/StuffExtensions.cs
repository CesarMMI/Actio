using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Extensions;

internal static class StuffExtensions
{
    public static ModelBuilder ConfigureStuffModel(this ModelBuilder modelBuilder)
    {
        // PK
        modelBuilder.Entity<Domain.Models.Stuff>()
            .HasKey(a => a.Id);
        // Fields
        modelBuilder.Entity<Domain.Models.Stuff>()
            .Property(a => a.Title)
            .IsRequired()
            .HasMaxLength(100);
        modelBuilder.Entity<Domain.Models.Stuff>()
            .Property(a => a.Description)
            .IsRequired(false)
            .HasColumnType("nvarchar(max)");
        modelBuilder.Entity<Domain.Models.Stuff>()
            .Property(a => a.Type)
            .IsRequired();        
        // User Relation
        modelBuilder.Entity<Domain.Models.Stuff>()
            .Property(a => a.UserId)
            .IsRequired();        
        modelBuilder.Entity<Domain.Models.Stuff>()
            .HasOne(a => a.User)
            .WithMany(u => u.Stuffs)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        // Timestamps
        modelBuilder.Entity<Domain.Models.Stuff>()
            .Property(a => a.CreatedAt)
            .IsRequired();        
        modelBuilder.Entity<Domain.Models.Stuff>()
            .Property(a => a.UpdatedAt)
            .IsRequired();
        return modelBuilder;
    }
}
