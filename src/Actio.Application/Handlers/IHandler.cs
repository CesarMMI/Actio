namespace Actio.Application.Handlers;

public interface IHandler<TRequest, TResponse> 
{
    Task<TResponse> Handle(TRequest request);
}
