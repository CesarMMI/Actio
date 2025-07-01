namespace Actio.Application.Auth.Queries;

public readonly struct LoginQuery
{
    public string? Email { get; init; }
    public string? Password { get; init; }
}
