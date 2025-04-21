using Actio.Application.Shared.Dtos;
using Actio.Domain.Enums;

namespace Actio.Application.Actions.Dtos;

public class ActionResponse : BaseResponse
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public bool Done { get; set; } = false;
    public DateTime? DoneAt { get; set; }
    public EActionType Type { get; set; }
    public int? ProjectId { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public static class ActionResponseExtensions
{
    public static ActionResponse ToActionResponse(this Domain.Models.Action action)
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
            UserId = action.UserId,
            CreatedAt = action.CreatedAt,
            UpdatedAt = action.UpdatedAt
        };
    }
}