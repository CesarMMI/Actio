using Actio.Application.Actions.Dtos;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Dto;
using Actio.Domain.Repositories;

namespace Actio.Application.Actions.Handlers.UpdateAction;

internal class UpdateActionHandler(IActionRepository actionRepository) : IUpdateActionHandler
{
    public async Task<ActionResponse> Handle(UpdateActionRequest request)
    {
        request.Validate();

        var action = new Domain.Models.Action()
        {
            Id = request.Id,
            Title = request.Title,
            Description = request.Description,
            Type = request.Type,
            Done = request.Done,
            UserId = request.UserId,
        };

        var query = new IdQuery { Id = action.Id, UserId = action.UserId };

        action = await actionRepository.UpdateAsync(query, action);

        if (action is null) throw new NotFoundException("Action not found");

        return action.ToActionResponse();
    }
}
