using Actio.Application.Projects.Shared;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Repositories;

namespace Actio.Application.Projects.Commands.Update;

internal class UpdateProjectCommand(IProjectRepository ProjectRepository) : IUpdateProjectCommand
{
    public async Task<ProjectResult> Handle(UpdateProjectQuery query)
    {
        query.Validate();

        var project = await ProjectRepository.GetByIdAsync(query.Id, query.UserId);

        if (project is null) throw new NotFoundException("Project not found");

        project.Name = query.Name;
        project.Color = query.Color;
        project.UpdatedAt = DateTime.UtcNow;

        project = await ProjectRepository.UpdateAsync(project);

        return project.ToProjectResult();
    }
}
