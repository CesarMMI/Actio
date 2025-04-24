using Actio.Application.Actions.Dto;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Repositories;

namespace Actio.Application.Actions.Handlers.UpdateAction;

internal class UpdateActionHandler(IActionRepository actionRepository) : IUpdateActionHandler
{
    public async Task<ActionResponse> Handle(UpdateActionRequest request)
    {
        request.Validate();

        var action = await actionRepository.GetByIdAsync(request.Id, request.UserId);

        if (action is null) throw new NotFoundException("Action not found");

        action.Title = request.Title;
        action.Description = request.Description;
        action.Type = request.Type;
        action.DoneAt = request.Done && !action.Done ? DateTime.UtcNow : null;
        action.Done = request.Done;
        action.UpdatedAt = DateTime.UtcNow;

        action = await actionRepository.UpdateAsync(action);

        return action.ToResponse();
    }
}
