namespace Actio.Application.Shared.Dtos;

public class BaseResponsePaginated<T> : BaseResponse
{
    public int Page { get; set; }
    public int PageCount { get; set; }
    public int ItemCount { get; set; }
    public IList<T> Data { get; set; } = [];
}
