namespace Actio.Application.Auth.Results;

public readonly struct AuthResult
{
    public string AccessToken { get; init; }
    public UserResult User { get; init; }
}

