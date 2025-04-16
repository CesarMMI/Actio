using Actio.Application.Dtos.Tasks;
using Actio.Application.Handlers.Tasks;
using Actio.Web.Extensions;
using Actio.Web.Filters;
using Microsoft.AspNetCore.Authorization;

namespace Actio.Web.Endpoints;

public static class TasksEndpoints
{
    public static IEndpointRouteBuilder MapTasksEndpoints(this IEndpointRouteBuilder builder)
    {
        var group = builder.MapGroup("tasks");

        group
            .MapGet("", [Authorize]
            async (IGetAllTasksHandler handler) => (await handler.Handle(null))
            .ToResult(200))
            .Validate<GetAllTasksRequest>();
        
        return builder;
    }
}
