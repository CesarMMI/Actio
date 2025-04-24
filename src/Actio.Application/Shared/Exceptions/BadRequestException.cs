namespace Actio.Application.Shared.Exceptions;

public class BadRequestException(string message) : AppException(message)
{
    public override string Title => "Bad Request";
    public override int StatusCode => 400;
}
