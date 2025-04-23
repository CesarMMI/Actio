using Actio.Domain.Enums;

namespace Actio.Domain.Dto;

public class ActionQuery : BaseQuery
{
    public EActionType Type { get; set; }
    public bool Done { get; set; } = false;
}
