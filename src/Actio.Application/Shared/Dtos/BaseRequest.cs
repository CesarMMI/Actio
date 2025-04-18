namespace Actio.Application.Shared.Dtos;

public abstract class BaseRequest
{
    public int UserId { get; set; }

    public abstract void Validate();
}
