using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Extensions;

internal static class ActionExtensions
{
    public static ModelBuilder ConfigureActionModel(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Domain.Models.Action>()
            .HasKey(a => a.Id);
        modelBuilder.Entity<Domain.Models.Action>()
            .Property(a => a.Title)
            .IsRequired()
            .HasMaxLength(100);
        modelBuilder.Entity<Domain.Models.Action>()
            .Property(a => a.Description)
            .IsRequired(false)
            .HasColumnType("nvarchar(max)");
        modelBuilder.Entity<Domain.Models.Action>()
            .Property(a => a.Type)
            .IsRequired();
        modelBuilder.Entity<Domain.Models.Action>()
            .Property(a => a.Done)
            .IsRequired();
        modelBuilder.Entity<Domain.Models.Action>()
            .Property(a => a.DoneAt)
            .IsRequired(false);
        modelBuilder.Entity<Domain.Models.Action>()
            .Property(a => a.UserId)
            .IsRequired();
        modelBuilder.Entity<Domain.Models.Action>()
            .HasOne(a => a.User)
            .WithMany(u => u.Actions)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Domain.Models.Action>()
            .Property(a => a.CreatedAt)
            .IsRequired();
        modelBuilder.Entity<Domain.Models.Action>()
            .Property(a => a.UpdatedAt)
            .IsRequired();
        return modelBuilder;
    }
}
