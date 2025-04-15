using Actio.Application.Dtos.Auth;

namespace Actio.Application.Handlers.Auth.Register;

public interface IRegisterHandler : IHandler<RegisterRequest, AuthResponse>
{
}
