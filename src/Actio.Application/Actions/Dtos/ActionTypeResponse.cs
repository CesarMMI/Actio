using Actio.Application.Shared.Dtos;

namespace Actio.Application.Actions.Dtos;

public class ActionTypeResponse
{
    public required string Label { get; set; }
    public int Value { get; set; }
}
