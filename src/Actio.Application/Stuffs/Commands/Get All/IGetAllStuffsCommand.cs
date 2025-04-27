using Actio.Application.Shared.Interfaces;
using Actio.Application.Stuffs.Shared;

namespace Actio.Application.Stuffs.Commands.GetAll;

public interface IGetAllStuffsCommand : ICommand<GetAllStuffsQuery, IList<StuffResult>>
{
}
