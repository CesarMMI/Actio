using Actio.Application.Actions.Dto;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Dto;
using Actio.Domain.Repositories;

namespace Actio.Application.Actions.Handlers.DeleteAction;

internal class DeleteActionHandler(IActionRepository actionRepository) : IDeleteActionHandler
{
    public async Task<ActionResponse> Handle(DeleteActionRequest request)
    {
        request.Validate();

        var query = new IdQuery { Id = request.Id, UserId = request.UserId };

        var action = await actionRepository.DeleteAsync(query);

        if (action is null) throw new NotFoundException("Action not found");

        return action.ToResponse();
    }
}
