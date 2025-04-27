using Actio.Application.Shared.Exceptions;
using Actio.Application.Stuffs.Shared;
using Actio.Domain.Repositories;

namespace Actio.Application.Stuffs.Commands.Update;

internal class UpdateStuffCommand(IStuffRepository stuffRepository, IProjectRepository projectRepository) : IUpdateStuffCommand
{
    public async Task<StuffResult> Handle(UpdateStuffQuery query)
    {
        query.Validate();

        var stuff = await stuffRepository.GetByIdAsync(query.Id, query.UserId);

        if (stuff is null) throw new NotFoundException("Stuff not found");

        if (query.ProjectId is not null)
        {
            var project = await projectRepository.GetByIdAsync(query.ProjectId.Value, query.UserId);
            if (project is null) throw new NotFoundException("Project not found");
        }

        stuff.Title = query.Title;
        stuff.Description = query.Description;
        stuff.ProjectId = query.ProjectId;
        stuff.UpdatedAt = DateTime.UtcNow;

        stuff = await stuffRepository.UpdateAsync(stuff);

        return stuff.ToStuffResult();
    }
}
