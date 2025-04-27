using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Exceptions;
using System.Security.Claims;
using System.Text.Json;

namespace Actio.Web.Extensions;

internal static class EndpointExtensions
{
    public static BaseQuery SetRequestUserId<T>(this HttpContext ctx, T request) where T : BaseQuery
    {
        request.UserId = ctx.GetUserIdFromToken();
        return request;
    }

    public static int GetUserIdFromToken(this HttpContext ctx)
    {
        var userId = ctx.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        try
        {
            return int.Parse(userId!);
        }
        catch (Exception)
        {
            throw new BadRequestException("User id is required");
        }
    }

    private static readonly JsonSerializerOptions serializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public static async Task<IResult> WriteResponse<T>(this Task<T> taskResponse, int statusCode = 200)
    {
        return Results.Json(await taskResponse, serializerOptions, "application/json", statusCode);
    }
}
