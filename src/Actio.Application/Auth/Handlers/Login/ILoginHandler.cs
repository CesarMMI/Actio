using Actio.Application.Auth.Dto;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Auth.Handlers.Login;

public interface ILoginHandler : IHandler<LoginRequest, AuthResponse>
{
}
