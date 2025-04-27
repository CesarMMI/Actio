using Actio.Application.Shared.Dto;
using Actio.Domain.Enums;
using Actio.Domain.Repositories;

namespace Actio.Application.Stuffs.Commands.GetTypes;

internal class GetStuffTypesCommand() : IGetStuffTypesCommand
{
    public async Task<IList<GetStuffTypesResult>> Handle(BaseQuery query)
    {
        var list = Enum.GetValues<EStuffType>()
            .Select(e => new GetStuffTypesResult { Label = e.ToString(), Value = (int)e })
            .ToList();

        return await Task.FromResult(list);
    }
}
