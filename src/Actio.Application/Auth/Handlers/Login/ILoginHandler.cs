using Actio.Application.Auth.Dtos;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Auth.Handlers.Login;

public interface ILoginHandler : IHandler<LoginRequest, AuthResponse>
{
}
