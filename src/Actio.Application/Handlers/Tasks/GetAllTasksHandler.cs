using Actio.Application.Dtos;
using Actio.Application.Dtos.Tasks;

namespace Actio.Application.Handlers.Tasks;

internal class GetAllTasksHandler : IGetAllTasksHandler
{
    public async Task<BaseResponse<IEnumerable<TaskResponse>>> Handle(GetAllTasksRequest request)
    {
        return new BaseResponse<IEnumerable<TaskResponse>> { Data = [] };
    }
}
