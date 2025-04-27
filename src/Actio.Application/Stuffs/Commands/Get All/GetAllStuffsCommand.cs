using Actio.Application.Stuffs.Shared;
using Actio.Domain.Repositories;

namespace Actio.Application.Stuffs.Commands.GetAll;

internal class GetAllStuffsCommand(IStuffRepository stuffRepository) : IGetAllStuffsCommand
{
    public async Task<IList<StuffResult>> Handle(GetAllStuffsQuery query)
    {
        query.Validate();

        return (await stuffRepository
            .GetAllAsync(query.UserId))
            .Select(s => s.ToStuffResult())
            .ToList();
    }
}
