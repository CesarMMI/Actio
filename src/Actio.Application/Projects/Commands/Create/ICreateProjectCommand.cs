using Actio.Application.Shared.Interfaces;
using Actio.Application.Projects.Shared;

namespace Actio.Application.Projects.Commands.Create;

public interface ICreateProjectCommand : ICommand<CreateProjectQuery, ProjectResult>
{
}
