using Actio.Application.Actions.Dtos;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Actions.Handlers.GetAllActions;

public interface IGetAllActionsHandler : IHandler<GetAllActionsRequest, IList<ActionResponse>>
{
}
