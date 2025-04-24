using Actio.Application.Actions.Dto;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Repositories;

namespace Actio.Application.Actions.Handlers.DeleteAction;

internal class DeleteActionHandler(IActionRepository actionRepository) : IDeleteActionHandler
{
    public async Task<ActionResponse> Handle(DeleteActionRequest request)
    {
        request.Validate();

        var action = await actionRepository.GetByIdAsync(request.Id, request.UserId);

        if (action is null) throw new NotFoundException("Action not found");

        action = await actionRepository.DeleteAsync(action);

        return action.ToResponse();
    }
}
