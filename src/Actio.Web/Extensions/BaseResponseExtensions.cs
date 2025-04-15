using Actio.Application.Dtos;

namespace Actio.Web.Extensions;

public static class BaseResponseExtensions
{
    public static IResult ToResult<T>(this BaseResponse<T> response, int statusCode)
    {
        return Results.Json(response, statusCode: statusCode);
    }
}
