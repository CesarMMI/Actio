using Actio.Application.Shared.Dtos;
using Actio.Application.Shared.Exceptions;
using System.Security.Claims;

namespace Actio.Web.Extensions;

internal static class EndpointExtensions
{
    public static BaseRequest SetRequestUserId<T>(this HttpContext ctx, T request) where T : BaseRequest
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
}
