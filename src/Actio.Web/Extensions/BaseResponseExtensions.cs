using Actio.Application.Shared.Dtos;
using System.Text.Json;

namespace Actio.Web.Extensions;

public static class BaseResponseExtensions
{
    private static readonly JsonSerializerOptions serializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public static IResult WriteResponse(this BaseResponse response, int statusCode = 200)
    {
        return Results.Json(response, serializerOptions, "application/json", statusCode);
    }
}
