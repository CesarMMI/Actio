using Actio.Application.Actions.Dto;
using Actio.Application.Actions.Handlers.CreateAction;
using Actio.Application.Actions.Handlers.DeleteAction;
using Actio.Application.Actions.Handlers.GetActionById;
using Actio.Application.Actions.Handlers.GetActionTypes;
using Actio.Application.Actions.Handlers.GetAllActions;
using Actio.Application.Actions.Handlers.UpdateAction;
using Actio.Application.Shared.Dto;
using Actio.Domain.Enums;
using Actio.Web.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace Actio.Web.Endpoints;

public static class ActionEndpoints
{
    public static IEndpointRouteBuilder MapActionsEndpoints(this IEndpointRouteBuilder builder)
    {
        var group = builder.MapGroup("actions");

        group.MapGet("", [Authorize] async (EActionType? type, bool? done, IGetAllActionsHandler handler, HttpContext ctx) =>
        {
            var request = new GetAllActionsRequest() { ActionType = type ?? EActionType.Next, Done = done ?? false };
            ctx.SetRequestUserId(request);
            return await handler.Handle(request).WriteResponse(200);
        });

        group.MapGet("{id:int}", [Authorize] async (int id, IGetActionByIdHandler handler, HttpContext ctx) =>
        {
            var request = new GetActionByIdRequest() { Id = id };
            ctx.SetRequestUserId(request);
            return await handler.Handle(request).WriteResponse(200);
        });

        group.MapPost("", [Authorize] async (CreateActionRequest request, ICreateActionHandler handler, HttpContext ctx) =>
        {
            ctx.SetRequestUserId(request);
            return await handler.Handle(request).WriteResponse(201);
        });

        group.MapPut("{id:int}", [Authorize] async (int id, UpdateActionRequest request, IUpdateActionHandler handler, HttpContext ctx) =>
        {
            request.Id = id;
            ctx.SetRequestUserId(request);
            return await handler.Handle(request).WriteResponse(200);
        });

        group.MapDelete("{id:int}", [Authorize] async (int id, IDeleteActionHandler handler, HttpContext ctx) =>
        {
            var request = new DeleteActionRequest() { Id = id };
            ctx.SetRequestUserId(request);
            await handler.Handle(request);
            return Results.NoContent();
        });

        group.MapGet("types", async (IGetActionTypesHandler handler) =>
        {
            return await handler.Handle(new BaseRequest()).WriteResponse(200);
        });

        return builder;
    }
}
