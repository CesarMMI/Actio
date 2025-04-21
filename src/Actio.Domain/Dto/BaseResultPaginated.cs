namespace Actio.Domain.Dto;

public struct BaseResultPaginated<T>
{
    public int Page { get; set; }
    public int PageCount { get; set; }
    public int ItemCount { get; set; }
    public IList<T> Data { get; set; }
}
