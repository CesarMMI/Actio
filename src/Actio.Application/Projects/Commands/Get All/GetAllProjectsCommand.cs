using Actio.Application.Projects.Shared;
using Actio.Domain.Repositories;

namespace Actio.Application.Projects.Commands.GetAll;

internal class GetAllProjectsCommand(IProjectRepository projectRepository) : IGetAllProjectsCommand
{
    public async Task<IList<ProjectResult>> Handle(GetAllProjectsQuery query)
    {
        query.Validate();

        return (await projectRepository
            .GetAllAsync(query.UserId))
            .Select(p => p.ToProjectResult())
            .ToList();
    }
}
