using Actio.Application.Projects.Shared;
using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Repositories;

namespace Actio.Application.Projects.Commands.Delete;

internal class DeleteProjectCommand(IProjectRepository projectRepository) : IDeleteProjectCommand
{
    public async Task<ProjectResult> Handle(IdQuery query)
    {
        query.Validate();

        var project = await projectRepository.GetByIdAsync(query.Id, query.UserId);

        if (project is null) throw new NotFoundException("Project not found");

        project = await projectRepository.DeleteAsync(project);

        return project.ToProjectResult();
    }
}
