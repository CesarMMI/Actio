using Actio.Application.Shared.Dtos;
using Actio.Domain.Models;

namespace Actio.Application.InboxItems.Dtos;

public class InboxItemResponse : BaseResponse
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required int UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public static class InboxItemResponseExtensions
{
    public static InboxItemResponse ToInboxItemResponse(this InboxItem inboxItem)
    {
        return new InboxItemResponse
        {
            Id = inboxItem.Id,
            Title = inboxItem.Title,
            Description = inboxItem.Description,
            UserId = inboxItem.UserId,
            CreatedAt = inboxItem.CreatedAt,
            UpdatedAt = inboxItem.UpdatedAt
        };
    }
}