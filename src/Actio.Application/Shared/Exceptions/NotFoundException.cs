namespace Actio.Application.Shared.Exceptions;

public class NotFoundException(string message) : AppException(message)
{
    public override string Title => "Not Found";
    public override int StatusCode => 404;
}
