using Actio.Application.Projects.Dto;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Projects.Handlers.GetAllProjects;

public interface IGetAllProjectsHandler : IHandler<GetAllProjectsRequest, IList<ProjectResponse>>
{
}
