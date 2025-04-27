using Actio.Domain.Models;

namespace Actio.Application.Projects.Shared;

public class ProjectResult
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Color { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

internal static class ProjectResultExtensions
{
    public static ProjectResult ToProjectResult(this Project stuff)
    {
        return new ProjectResult
        {
            Id = stuff.Id,
            Name = stuff.Name,
            Color = stuff.Color,
            CreatedAt = stuff.CreatedAt,
            UpdatedAt = stuff.UpdatedAt
        };
    }
    
}