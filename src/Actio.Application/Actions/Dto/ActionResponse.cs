using Actio.Domain.Enums;

namespace Actio.Application.Actions.Dto;

public class ActionResponse
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public bool Done { get; set; } = false;
    public DateTime? DoneAt { get; set; }
    public EActionType Type { get; set; }
    public int? ProjectId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public static class ActionResponseExtensions
{
    public static ActionResponse ToResponse(this Domain.Models.Action action)
    {
        return new ActionResponse
        {
            Id = action.Id,
            Title = action.Title,
            Description = action.Description,
            Done = action.Done,
            DoneAt = action.DoneAt,
            Type = action.Type,
            ProjectId = action.ProjectId,
            CreatedAt = action.CreatedAt,
            UpdatedAt = action.UpdatedAt
        };
    }
}