using Actio.Application.Auth.Shared.Results;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.Auth.Commands.Register;

public interface IRegisterCommand : ICommand<RegisterQuery, AuthResult>
{
}
