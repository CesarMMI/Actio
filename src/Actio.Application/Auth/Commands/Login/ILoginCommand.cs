using Actio.Application.Auth.Shared.Results;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Auth.Commands.Login;

public interface ILoginCommand : ICommand<LoginQuery, AuthResult>
{
}
