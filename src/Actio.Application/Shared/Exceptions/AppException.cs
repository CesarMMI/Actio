namespace Actio.Application.Shared.Exceptions;

public abstract class AppException(string message) : Exception(message)
{
    public abstract string Title { get; }
    public abstract int StatusCode { get; }
}