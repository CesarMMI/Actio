using Actio.Application.Auth.Dtos;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Auth.Handlers.Refresh;

public interface IRefreshHandler : IHandler<RefreshRequest, AuthResponse>
{
}
