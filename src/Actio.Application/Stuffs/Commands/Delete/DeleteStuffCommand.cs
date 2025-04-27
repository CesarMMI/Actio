using Actio.Application.Shared.Exceptions;
using Actio.Application.Stuffs.Shared;
using Actio.Domain.Repositories;

namespace Actio.Application.Stuffs.Commands.Delete;

internal class DeleteStuffCommand(IStuffRepository stuffRepository) : IDeleteStuffCommand
{
    public async Task<StuffResult> Handle(DeleteStuffQuery query)
    {
        query.Validate();

        var stuff = await stuffRepository.GetByIdAsync(query.Id, query.UserId);

        if (stuff is null) throw new NotFoundException("Stuff not found");

        stuff = await stuffRepository.DeleteAsync(stuff);

        return stuff.ToStuffResult();
    }
}
