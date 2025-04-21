using Actio.Application.Actions.Dtos;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Actions.Handlers.UpdateAction;

public interface IUpdateActionHandler : IHandler<UpdateActionRequest, ActionResponse>
{
}
