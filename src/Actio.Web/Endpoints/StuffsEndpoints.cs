using Actio.Application.Shared.Dto;
using Actio.Application.Stuffs.Commands.Create;
using Actio.Application.Stuffs.Commands.Delete;
using Actio.Application.Stuffs.Commands.GetAll;
using Actio.Application.Stuffs.Commands.GetById;
using Actio.Application.Stuffs.Commands.GetTypes;
using Actio.Application.Stuffs.Commands.Update;
using Actio.Web.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace Actio.Web.Endpoints;

public static class StuffsEndpoints
{
    public static IEndpointRouteBuilder MapStuffsEndpoints(this IEndpointRouteBuilder builder)
    {
        var group = builder.MapGroup("stuffs");

        group.MapGet("", [Authorize] async (IGetAllStuffsCommand command, HttpContext ctx) =>
        {
            var query = new GetAllStuffsQuery();
            ctx.SetRequestUserId(query);
            return await command.Handle(query).WriteResponse(200);
        });

        group.MapGet("{id:int}", [Authorize] async (int id, IGetStuffByIdCommand command, HttpContext ctx) =>
        {
            var request = new GetStuffByIdQuery() { Id = id };
            ctx.SetRequestUserId(request);
            return await command.Handle(request).WriteResponse(200);
        });

        group.MapPost("", [Authorize] async (CreateStuffQuery query, ICreateStuffCommand command, HttpContext ctx) =>
        {
            ctx.SetRequestUserId(query);
            return await command.Handle(query).WriteResponse(201);
        });

        group.MapPut("{id:int}", [Authorize] async (int id, UpdateStuffQuery query, IUpdateStuffCommand command, HttpContext ctx) =>
        {
            query.Id = id;
            ctx.SetRequestUserId(query);
            return await command.Handle(query).WriteResponse(200);
        });

        group.MapDelete("{id:int}", [Authorize] async (int id, IDeleteStuffCommand command, HttpContext ctx) =>
        {
            var query = new DeleteStuffQuery() { Id = id };
            ctx.SetRequestUserId(query);
            await command.Handle(query);
            return Results.NoContent();
        });

        group.MapGet("types", async (IGetStuffTypesCommand command) =>
        {
            return await command.Handle(new BaseQuery()).WriteResponse(200);
        });

        return builder;
    }
}
