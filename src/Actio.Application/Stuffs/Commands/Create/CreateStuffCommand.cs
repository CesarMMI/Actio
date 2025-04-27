using Actio.Application.Shared.Exceptions;
using Actio.Application.Stuffs.Shared;
using Actio.Domain.Enums;
using Actio.Domain.Models;
using Actio.Domain.Repositories;

namespace Actio.Application.Stuffs.Commands.Create;

internal class CreateStuffCommand(IStuffRepository stuffRepository, IProjectRepository projectRepository) : ICreateStuffCommand
{
    public async Task<StuffResult> Handle(CreateStuffQuery query)
    {
        query.Validate();

        if(query.ProjectId is not null)
        {
            var project = await projectRepository.GetByIdAsync(query.ProjectId.Value, query.UserId);
            if (project is null) throw new NotFoundException("Project not found");
        }

        var stuff = new Stuff
        {
            Title = query.Title,
            Description = query.Description,
            Type = EStuffType.Inbox,
            ProjectId = query.ProjectId,
            UserId = query.UserId
        };

        stuff = await stuffRepository.CreateAsync(stuff);

        return stuff.ToStuffResult();
    }
}
