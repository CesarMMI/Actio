using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Interfaces;
using Actio.Application.Stuffs.Shared;

namespace Actio.Application.Stuffs.Commands.GetById;

public interface IGetStuffByIdCommand : ICommand<IdQuery, StuffResult>
{
}
