using Actio.Application.Projects.Shared;
using Actio.Domain.Models;
using Actio.Domain.Repositories;

namespace Actio.Application.Projects.Commands.Create;

internal class CreateProjectCommand(IProjectRepository projectRepository) : ICreateProjectCommand
{
    public async Task<ProjectResult> Handle(CreateProjectQuery query)
    {
        query.Validate();

        var project = new Project
        {
            Name = query.Name,
            Color = query.Color,
            UserId = query.UserId
        };

        project = await projectRepository.CreateAsync(project);

        return project.ToProjectResult();
    }
}
