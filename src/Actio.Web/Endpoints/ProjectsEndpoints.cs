using Actio.Application.Projects.Commands.Create;
using Actio.Application.Projects.Commands.Delete;
using Actio.Application.Projects.Commands.GetAll;
using Actio.Application.Projects.Commands.GetById;
using Actio.Application.Projects.Commands.Update;
using Actio.Application.Shared.Dto;
using Actio.Web.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace Actio.Web.Endpoints;

public static class ProjectsEndpoints
{
    public static IEndpointRouteBuilder MapProjectsEndpoints(this IEndpointRouteBuilder builder)
    {
        var group = builder.MapGroup("projects");

        group.MapGet("", [Authorize] async (IGetAllProjectsCommand command, HttpContext ctx) =>
        {
            var query = new GetAllProjectsQuery();
            ctx.SetRequestUserId(query);
            return await command.Handle(query).WriteResponse(200);
        });

        group.MapGet("{id:int}", [Authorize] async (int id, IGetProjectByIdCommand command, HttpContext ctx) =>
        {
            var request = new IdQuery() { Id = id };
            ctx.SetRequestUserId(request);
            return await command.Handle(request).WriteResponse(200);
        });

        group.MapPost("", [Authorize] async (CreateProjectQuery query, ICreateProjectCommand command, HttpContext ctx) =>
        {
            ctx.SetRequestUserId(query);
            return await command.Handle(query).WriteResponse(201);
        });

        group.MapPut("{id:int}", [Authorize] async (int id, UpdateProjectQuery query, IUpdateProjectCommand command, HttpContext ctx) =>
        {
            query.Id = id;
            ctx.SetRequestUserId(query);
            return await command.Handle(query).WriteResponse(200);
        });

        group.MapDelete("{id:int}", [Authorize] async (int id, IDeleteProjectCommand command, HttpContext ctx) =>
        {
            var query = new IdQuery() { Id = id };
            ctx.SetRequestUserId(query);
            await command.Handle(query);
            return Results.NoContent();
        });

        return builder;
    }
}
