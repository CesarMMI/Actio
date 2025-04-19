namespace Actio.Domain.Models;

public class InboxItem
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool Resolved { get; set; } = false;

    public int UserId { get; set; }
    public User User { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}
