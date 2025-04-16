using Actio.Application.Dtos.Tasks;

namespace Actio.Application.Handlers.Tasks;

internal class GetAllTasksHandler : IGetAllTasksHandler
{
    public async Task<IEnumerable<TaskResponse>> Handle(GetAllTasksRequest request)
    {
        return [];
    }
}
