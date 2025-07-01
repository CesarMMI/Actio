using Actio.Application.Auth.Queries;
using Actio.Application.Auth.Results;
using Actio.Application.Shared.Command;

namespace Actio.Application.Auth.Commands.Register;

public interface IRegisterCommand : ICommand<RegisterQuery, AuthResult> { }
