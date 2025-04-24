using Actio.Application.Actions.Dto;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Actions.Handlers.UpdateAction;

public interface IUpdateActionHandler : IHandler<UpdateActionRequest, ActionResponse>
{
}
