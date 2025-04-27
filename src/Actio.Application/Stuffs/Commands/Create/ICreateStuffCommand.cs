using Actio.Application.Shared.Interfaces;
using Actio.Application.Stuffs.Shared;

namespace Actio.Application.Stuffs.Commands.Create;

public interface ICreateStuffCommand : ICommand<CreateStuffQuery, StuffResult>
{
}
