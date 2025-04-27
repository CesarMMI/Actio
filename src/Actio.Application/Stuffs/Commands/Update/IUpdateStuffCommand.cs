using Actio.Application.Shared.Interfaces;
using Actio.Application.Stuffs.Shared;

namespace Actio.Application.Stuffs.Commands.Update;

public interface IUpdateStuffCommand : ICommand<UpdateStuffQuery, StuffResult>
{
}
