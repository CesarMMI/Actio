using Actio.Application.Auth.Shared.Results;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Auth.Commands.Refresh;

public interface IRefreshCommand : ICommand<RefreshQuery, AuthResult>
{
}
