namespace Actio.Application.Exceptions;

internal class UnauthorizedException(string message) : AppException(message)
{
    public override int StatusCode => 401;
}
