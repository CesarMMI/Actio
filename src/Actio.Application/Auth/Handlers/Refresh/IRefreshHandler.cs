using Actio.Application.Auth.Dto;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Auth.Handlers.Refresh;

public interface IRefreshHandler : IHandler<RefreshRequest, AuthResponse>
{
}
