using Actio.Application.Actions.Dtos;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Repositories;

namespace Actio.Application.Actions.Handlers.DeleteAction;

internal class DeleteActionHandler(IActionRepository actionRepository) : IDeleteActionHandler
{
    public async Task<ActionResponse> Handle(DeleteActionRequest request)
    {
        request.Validate();

        var action = await actionRepository.DeleteAsync(request.UserId, request.Id);

        if (action is null) throw new NotFoundException("Action not found");

        return action.ToActionResponse();
    }
}
