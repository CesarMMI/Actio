namespace Actio.Application.Shared.Exceptions;

public class BadRequestException(string message) : AppException(message)
{
    public override int StatusCode => 400;
}
