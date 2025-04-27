using Actio.Application.Shared.Interfaces;
using Actio.Application.Projects.Shared;

namespace Actio.Application.Projects.Commands.Update;

public interface IUpdateProjectCommand : ICommand<UpdateProjectQuery, ProjectResult>
{
}
