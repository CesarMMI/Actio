namespace Actio.Application.Exceptions;

public class UnauthorizedException(string message) : AppException(message)
{
    public override int StatusCode => 401;
}
