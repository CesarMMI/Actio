using Actio.Application.Projects.Shared;
using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Exceptions;
using Actio.Domain.Repositories;

namespace Actio.Application.Projects.Commands.GetById;

internal class GetProjectByIdCommand(IProjectRepository ProjectRepository) : IGetProjectByIdCommand
{
    public async Task<ProjectResult> Handle(IdQuery query)
    {
        query.Validate();

        var project = await ProjectRepository.GetByIdAsync(query.Id, query.UserId);

        if (project is null) throw new NotFoundException("Project not found");

        return project.ToProjectResult();
    }
}
