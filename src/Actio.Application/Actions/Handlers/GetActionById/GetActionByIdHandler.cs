using Actio.Application.Actions.Dtos;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Repositories;

namespace Actio.Application.Actions.Handlers.GetActionById;

internal class GetActionByIdHandler(IActionRepository actionRepository) : IGetActionByIdHandler
{
    public async Task<ActionResponse> Handle(GetActionByIdRequest request)
    {
        request.Validate();

        var action = await actionRepository.GetByIdAsync(request.UserId, request.Id);

        if (action is null) throw new NotFoundException("Action not found");

        return action.ToActionResponse();
    }
}
