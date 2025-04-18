using Actio.Application.Auth.Dtos;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Auth.Handlers.Register;

public interface IRegisterHandler : IHandler<RegisterRequest, AuthResponse>
{
}
