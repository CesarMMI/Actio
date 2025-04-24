using Actio.Application.Actions.Dto;
using Actio.Application.Shared.Dto;
using Actio.Domain.Enums;

namespace Actio.Application.Actions.Handlers.GetActionTypes;

internal class GetActionTypesHandler : IGetActionTypesHandler
{
    public async Task<IList<ActionTypeResponse>> Handle(BaseRequest request)
    {
        var list = Enum.GetValues<EActionType>()
            .Select(e => new ActionTypeResponse
            {
                Label = e.ToString(),
                Value = (int)e
            })
            .ToList();
        
        return await Task.FromResult(list);
    }
}
