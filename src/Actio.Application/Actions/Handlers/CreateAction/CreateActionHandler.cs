using Actio.Application.Actions.Dto;
using Actio.Domain.Repositories;

namespace Actio.Application.Actions.Handlers.CreateAction;

internal class CreateActionHandler(IActionRepository actionRepository) : ICreateActionHandler
{
    public async Task<ActionResponse> Handle(CreateActionRequest request)
    {
        request.Validate();

        var action = new Domain.Models.Action
        {
            UserId = request.UserId,
            Title = request.Title,
            Description = request.Description,
            Type = request.Type,
            Done = request.Done,
            DoneAt = request.Done ? DateTime.UtcNow : null
        };

        action = await actionRepository.CreateAsync(action);

        return action.ToResponse();
    }
}
