using Actio.Application.Actions.Dtos;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Actions.Handlers.CreateAction;

public interface ICreateActionHandler : IHandler<CreateActionRequest, ActionResponse>
{
}
