namespace Actio.Application.Auth.Shared.Results;

public class AuthResult
{
    public required UserResult User { get; set; }
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}
