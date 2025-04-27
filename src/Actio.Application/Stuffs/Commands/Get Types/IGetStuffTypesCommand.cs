using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Stuffs.Commands.GetTypes;

public interface IGetStuffTypesCommand : ICommand<BaseQuery, IList<GetStuffTypesResult>>
{
}
