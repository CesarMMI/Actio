using Actio.Application.Actions.Dto;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Repositories;

namespace Actio.Application.Actions.Handlers.GetActionById;

internal class GetActionByIdHandler(IActionRepository actionRepository) : IGetActionByIdHandler
{
    public async Task<ActionResponse> Handle(GetActionByIdRequest request)
    {
        request.Validate();

        var action = await actionRepository.GetByIdAsync(request.Id, request.UserId);

        if (action is null) throw new NotFoundException("Action not found");

        return action.ToResponse();
    }
}
