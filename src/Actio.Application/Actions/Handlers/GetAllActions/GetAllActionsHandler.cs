using Actio.Application.Actions.Dtos;
using Actio.Application.Shared.Dtos;
using Actio.Application.Shared.Extensions;
using Actio.Domain.Repositories;

namespace Actio.Application.Actions.Handlers.GetAllActions;

internal class GetAllActionsHandler(IActionRepository actionRepository) : IGetAllActionsHandler
{
    public async Task<BaseResponsePaginated<ActionResponse>> Handle(GetAllActionsRequest request)
    {
        request.Validate();

        var result = await actionRepository.GetAllAsync(request.ToQueryPaginated());

        var actions = result.Data
            .Select(item => item.ToActionResponse())
            .ToList();

        return new BaseResponsePaginated<ActionResponse>
        {
            Data = actions,
            Page = result.Page,
            PageCount = result.PageCount,
            ItemCount = result.ItemCount,
        };
    }
}
