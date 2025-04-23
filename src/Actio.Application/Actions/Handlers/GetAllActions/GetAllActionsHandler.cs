using Actio.Application.Actions.Dtos;
using Actio.Domain.Dto;
using Actio.Domain.Repositories;

namespace Actio.Application.Actions.Handlers.GetAllActions;

internal class GetAllActionsHandler(IActionRepository actionRepository) : IGetAllActionsHandler
{
    public async Task<IList<ActionResponse>> Handle(GetAllActionsRequest request)
    {
        request.Validate();

        var query = new ActionQuery
        {
            Done = request.Done,
            Type = request.ActionType,
            UserId = request.UserId
        };

        var actions = (await actionRepository
            .GetAllAsync(query))
            .Select(item => item.ToActionResponse())
            .ToList();

        return actions;
    }
}
