namespace Actio.Domain.Dto;

public struct BaseQueryPaginated
{
    public int UserId { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
