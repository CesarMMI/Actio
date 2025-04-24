using Actio.Application.Actions.Dto;
using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Actions.Handlers.GetActionTypes;

public interface IGetActionTypesHandler : IHandler<BaseRequest, IList<ActionTypeResponse>>
{
}
