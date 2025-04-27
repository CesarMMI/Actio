using Actio.Domain.Enums;
using Actio.Domain.Models;

namespace Actio.Application.Stuffs.Shared;

public class StuffResult
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public EStuffType Type { get; set; }
    public int? ProjectId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

internal static class StuffResultExtensions
{
    public static StuffResult ToStuffResult(this Stuff stuff)
    {
        return new StuffResult
        {
            Id = stuff.Id,
            Title = stuff.Title,
            Description = stuff.Description,
            Type = stuff.Type,
            ProjectId = stuff.ProjectId,
            CreatedAt = stuff.CreatedAt,
            UpdatedAt = stuff.UpdatedAt
        };
    }
    
}