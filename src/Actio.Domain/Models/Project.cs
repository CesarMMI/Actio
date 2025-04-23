namespace Actio.Domain.Models;

public class Project
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
    public string? Color { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public ICollection<Action> Actions { get; set; } = [];

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
