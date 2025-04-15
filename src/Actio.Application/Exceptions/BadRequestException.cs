namespace Actio.Application.Exceptions;

internal class BadRequestException(string message) : AppException(message)
{
    public override int StatusCode => 400;
}
