using Actio.Application.Shared.Exceptions;
using Actio.Application.Stuffs.Shared;
using Actio.Domain.Repositories;

namespace Actio.Application.Stuffs.Commands.GetById;

internal class GetStuffByIdCommand(IStuffRepository stuffRepository) : IGetStuffByIdCommand
{
    public async Task<StuffResult> Handle(GetStuffByIdQuery query)
    {
        query.Validate();

        var stuff = await stuffRepository.GetByIdAsync(query.Id, query.UserId);

        if (stuff is null) throw new NotFoundException("Stuff not found");

        return stuff.ToStuffResult();
    }
}
