using Actio.Application.Shared.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;

namespace Actio.Web.Extensions;

internal static class HandlerExtensions
{
    //public static Delegate Handle<TRequest, THandler>(int successStatusCode = 200)
    //    where THandler : ICommandHandler<TRequest>
    //{
    //    return async (TRequest request, THandler handler) =>
    //    {
    //        var result = await handler.Handle(request);
    //        return Results.Json(result, statusCode: successStatusCode);
    //    };
    //}

    public static Delegate Handle<THandler, TRequest, TResponse>(int successStatusCode = 200)
        where THandler : IHandler<TRequest, TResponse>
    {
        return [Authorize] async (TRequest request, THandler handler) =>
        {
            return Results.Json((await handler.Handle(request)), new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }, "application/json", successStatusCode);
        };
    }

    public static Delegate HandleNoAuth<THandler, TRequest, TResponse>(int successStatusCode = 200)
        where THandler : IHandler<TRequest, TResponse>
    {
        return async (TRequest request, THandler handler) =>
        {
            return Results.Json((await handler.Handle(request)), new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }, "application/json", successStatusCode);
        };
    }
}
