using Actio.Application.Actions.Dto;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Actions.Handlers.DeleteAction;

public interface IDeleteActionHandler : IHandler<DeleteActionRequest, ActionResponse>
{
}
