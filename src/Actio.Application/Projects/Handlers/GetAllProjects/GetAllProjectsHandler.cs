using Actio.Application.Actions.Dto;
using Actio.Application.Projects.Dto;
using Actio.Domain.Dto;
using Actio.Domain.Repositories;

namespace Actio.Application.Projects.Handlers.GetAllProjects;

internal class GetAllProjectsHandler(IProjectRepository projectRepository) : IGetAllProjectsHandler
{
    public async Task<IList<ProjectResponse>> Handle(GetAllProjectsRequest request)
    {
        request.Validate();

        var query = new BaseQuery
        {
            UserId = request.UserId
        };

        return (await projectRepository
            .GetAllAsync(query))
            .Select(p => p.ToResponse())
            .ToList();
    }
}
