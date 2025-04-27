using Actio.Application.Shared.Interfaces;
using Actio.Application.Projects.Shared;

namespace Actio.Application.Projects.Commands.GetAll;

public interface IGetAllProjectsCommand : ICommand<GetAllProjectsQuery, IList<ProjectResult>>
{
}
