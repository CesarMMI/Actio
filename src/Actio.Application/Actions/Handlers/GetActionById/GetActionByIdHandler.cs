using Actio.Application.Actions.Dtos;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Dto;
using Actio.Domain.Repositories;

namespace Actio.Application.Actions.Handlers.GetActionById;

internal class GetActionByIdHandler(IActionRepository actionRepository) : IGetActionByIdHandler
{
    public async Task<ActionResponse> Handle(GetActionByIdRequest request)
    {
        request.Validate();

        var query = new IdQuery { Id = request.Id, UserId = request.UserId };

        var action = await actionRepository.GetByIdAsync(query);

        if (action is null) throw new NotFoundException("Action not found");

        return action.ToActionResponse();
    }
}
