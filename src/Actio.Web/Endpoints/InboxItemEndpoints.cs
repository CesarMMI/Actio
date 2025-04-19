using Actio.Application.InboxItems.Dtos;
using Actio.Application.InboxItems.Handlers.CreateInboxItem;
using Actio.Application.InboxItems.Handlers.DeleteInboxItem;
using Actio.Application.InboxItems.Handlers.GetAllInboxItems;
using Actio.Application.InboxItems.Handlers.GetInboxItemById;
using Actio.Application.InboxItems.Handlers.UpdateInboxItem;
using Actio.Web.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace Actio.Web.Endpoints;

public static class InboxItemEndpoints
{
    public static IEndpointRouteBuilder MapInboxItemsEndpoints(this IEndpointRouteBuilder builder)
    {
        var group = builder.MapGroup("inbox-items");
        group.MapGet("", [Authorize] async (IGetAllInboxItemsHandler handler, HttpContext ctx) =>
        {
            var request = new GetAllInboxItemsRequest();
            ctx.SetRequestUserId(request);
            return (await handler.Handle(request)).WriteResponse(200);
        });
        group.MapGet("{id:int}", [Authorize] async (int id, IGetInboxItemByIdHandler handler, HttpContext ctx) =>
        {
            var request = new GetInboxItemByIdRequest() { Id = id };
            ctx.SetRequestUserId(request);
            return (await handler.Handle(request)).WriteResponse(200);
        });
        group.MapPost("", [Authorize] async (CreateInboxItemRequest request, ICreateInboxItemHandler handler, HttpContext ctx) =>
        {
            ctx.SetRequestUserId(request);
            return (await handler.Handle(request)).WriteResponse(201);
        });
        group.MapPut("{id:int}", [Authorize] async (int id, UpdateInboxItemRequest request, IUpdateInboxItemHandler handler, HttpContext ctx) =>
        {
            request.Id = id;
            ctx.SetRequestUserId(request);
            return (await handler.Handle(request)).WriteResponse(200);
        });
        group.MapDelete("{id:int}", [Authorize] async (int id, IDeleteInboxItemHandler handler, HttpContext ctx) =>
        {
            var request = new DeleteInboxItemRequest() { Id = id };
            ctx.SetRequestUserId(request);
            await handler.Handle(request);
            return Results.NoContent();
        });
        return builder;
    }
}
