using Actio.Application.Shared.Dtos;
using Actio.Domain.Dto;

namespace Actio.Web.Extensions;

public static class BaseRequestExtensions
{
    public static T AssignPagination<T>(this T request, int? page, int? pageSize) where T : BaseRequestPaginated
    {
        request.Page = page ?? request.Page;
        request.PageSize = pageSize ?? request.PageSize;
        return request;
    }
}
