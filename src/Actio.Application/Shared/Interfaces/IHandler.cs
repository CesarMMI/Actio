using Actio.Application.Shared.Dtos;

namespace Actio.Application.Shared.Interfaces;

public interface IHandler<TRequest, TResponse> where TRequest : BaseRequest where TResponse : BaseResponse
{
    Task<TResponse> Handle(TRequest request);
}
