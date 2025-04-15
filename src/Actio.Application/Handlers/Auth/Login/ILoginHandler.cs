using Actio.Application.Dtos.Auth;

namespace Actio.Application.Handlers.Auth.Login;

public interface ILoginHandler : IHandler<LoginRequest, AuthResponse>
{
}
