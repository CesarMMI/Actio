using Actio.Application.Shared.Exceptions;
using Actio.Application.Stuffs.Shared;
using Actio.Domain.Repositories;

namespace Actio.Application.Stuffs.Commands.Update;

internal class UpdateStuffCommand(IStuffRepository stuffRepository) : IUpdateStuffCommand
{
    public async Task<StuffResult> Handle(UpdateStuffQuery query)
    {
        query.Validate();

        var stuff = await stuffRepository.GetByIdAsync(query.Id, query.UserId);

        if (stuff is null) throw new NotFoundException("Stuff not found");

        stuff.Title = query.Title;
        stuff.Description = query.Description;
        stuff.UpdatedAt = DateTime.UtcNow;

        stuff = await stuffRepository.UpdateAsync(stuff);

        return stuff.ToStuffResult();
    }
}
