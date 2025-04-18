namespace Actio.Application.Auth.Dtos;

public class AuthResponse
{
    public required UserResponse User { get; set; }
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}
