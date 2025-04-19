namespace Actio.Application.Shared.Dtos;

public class BaseResponsePaginated<T> : BaseResponse
{
    public List<T> Data { get; set; } = [];
}
