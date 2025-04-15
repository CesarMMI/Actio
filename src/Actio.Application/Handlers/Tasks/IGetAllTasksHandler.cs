using Actio.Application.Dtos.Tasks;

namespace Actio.Application.Handlers.Tasks;

public interface IGetAllTasksHandler : IHandler<GetAllTasksRequest, IEnumerable<TaskResponse>>
{
}
