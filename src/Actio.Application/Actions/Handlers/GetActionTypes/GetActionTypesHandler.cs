using Actio.Application.Actions.Dtos;
using Actio.Application.Shared.Dtos;
using Actio.Domain.Enums;

namespace Actio.Application.Actions.Handlers.GetActionTypes;

internal class GetActionTypesHandler : IGetActionTypesHandler
{
    public async Task<BaseResponsePaginated<ActionTypeResponse>> Handle(BaseRequest request)
    {
        var list = Enum.GetValues<EActionType>()
            .Select(e => new ActionTypeResponse
            {
                Label = e.ToString(),
                Value = (int)e
            })
            .ToList();
        
        var response = new BaseResponsePaginated<ActionTypeResponse> { Page = 1, PageCount = 1, ItemCount = list.Count, Data = list };
        
        return await Task.FromResult(response);
    }
}
