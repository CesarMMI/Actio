using Actio.Application.Actions.Dto;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Actions.Handlers.CreateAction;

public interface ICreateActionHandler : IHandler<CreateActionRequest, ActionResponse>
{
}
