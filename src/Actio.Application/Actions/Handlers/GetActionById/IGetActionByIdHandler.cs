using Actio.Application.Actions.Dto;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Actions.Handlers.GetActionById;

public interface IGetActionByIdHandler : IHandler<GetActionByIdRequest, ActionResponse>
{
}
