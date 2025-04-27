using Actio.Application.Stuffs.Shared;
using Actio.Domain.Enums;
using Actio.Domain.Models;
using Actio.Domain.Repositories;

namespace Actio.Application.Stuffs.Commands.Create;

internal class CreateStuffCommand(IStuffRepository stuffRepository) : ICreateStuffCommand
{
    public async Task<StuffResult> Handle(CreateStuffQuery query)
    {
        query.Validate();

        var stuff = new Stuff
        {
            Title = query.Title,
            Description = query.Description,
            Type = EStuffType.Inbox,
            UserId = query.UserId
        };

        stuff = await stuffRepository.CreateAsync(stuff);

        return stuff.ToStuffResult();
    }
}
