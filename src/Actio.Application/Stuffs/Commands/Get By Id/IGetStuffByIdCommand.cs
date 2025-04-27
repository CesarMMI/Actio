using Actio.Application.Shared.Interfaces;
using Actio.Application.Stuffs.Shared;

namespace Actio.Application.Stuffs.Commands.GetById;

public interface IGetStuffByIdCommand : ICommand<GetStuffByIdQuery, StuffResult>
{
}
