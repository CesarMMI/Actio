using Actio.Application.Actions.Dtos;
using Actio.Application.Shared.Dtos;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Actions.Handlers.GetActionTypes;

public interface IGetActionTypesHandler : IHandler<BaseRequest, BaseResponsePaginated<ActionTypeResponse>>
{
}
