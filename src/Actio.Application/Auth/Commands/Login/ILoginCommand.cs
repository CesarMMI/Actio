using Actio.Application.Auth.Queries;
using Actio.Application.Auth.Results;
using Actio.Application.Shared.Command;

namespace Actio.Application.Auth.Commands.Login;

public interface ILoginCommand : ICommand<LoginQuery, AuthResult> { }
