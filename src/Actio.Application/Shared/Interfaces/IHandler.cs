namespace Actio.Application.Shared.Interfaces;

public interface IHandler<TRequest, TResponse> 
{
    Task<TResponse> Handle(TRequest request);
}
