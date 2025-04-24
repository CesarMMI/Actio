using Actio.Application.Projects.Dto;
using Actio.Application.Projects.Handlers.GetAllProjects;
using Actio.Web.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace Actio.Web.Endpoints;

public static class ProjectsEndpoints
{
    public static IEndpointRouteBuilder MapProjectsEndpoints(this IEndpointRouteBuilder builder)
    {
        var group = builder.MapGroup("projects");

        group.MapGet("", [Authorize] async (IGetAllProjectsHandler handler, HttpContext ctx) =>
        {
            var request = new GetAllProjectsRequest();
            ctx.SetRequestUserId(request);
            return await handler.Handle(request).WriteResponse(200);
        });

        return builder;
    }
}
