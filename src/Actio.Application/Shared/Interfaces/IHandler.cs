using Actio.Application.Shared.Dto;

namespace Actio.Application.Shared.Interfaces;

public interface IHandler<TRequest, TResponse> where TRequest : BaseRequest
{
    Task<TResponse> Handle(TRequest request);
}
