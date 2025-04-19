using Actio.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Actio.Infrastructure.Persistence.Context;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<InboxItem> InboxItems { get; set; }
}
