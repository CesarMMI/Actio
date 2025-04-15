namespace Actio.Application.Dtos.Auth;

public class AuthResponse
{
    public required UserResponse User { get; set; }
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}
