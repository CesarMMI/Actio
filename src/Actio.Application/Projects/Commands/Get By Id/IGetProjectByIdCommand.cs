using Actio.Application.Projects.Shared;
using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Projects.Commands.GetById;

public interface IGetProjectByIdCommand : ICommand<IdQuery, ProjectResult>
{
}
