using Actio.Application.Shared.Dtos;
using Actio.Domain.Dto;

namespace Actio.Application.Shared.Extensions;

internal static class BaseRequestPaginatedExtensions
{
    public static BaseQueryPaginated ToQueryPaginated(this BaseRequestPaginated request)
    {
        return new BaseQueryPaginated
        {
            Page = request.Page,
            PageSize = request.PageSize,
            UserId = request.UserId
        };
    }
}
