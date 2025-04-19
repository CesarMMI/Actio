namespace Actio.Application.Shared.Exceptions;

public class NotFoundException(string message) : AppException(message)
{
    public override int StatusCode => 404;
}
