using Actio.Application.Shared.Dtos;

namespace Actio.Application.Auth.Dtos;

public class AuthResponse : BaseResponse
{
    public required UserResponse User { get; set; }
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}
