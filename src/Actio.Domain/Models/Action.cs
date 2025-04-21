using Actio.Domain.Enums;

namespace Actio.Domain.Models;

public class Action
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool Done { get; set; } = false;
    public DateTime? DoneAt { get; set; }
    public EActionType Type { get; set; } = EActionType.Next;

    public int? ProjectId { get; set; }
    public Project? Project { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
