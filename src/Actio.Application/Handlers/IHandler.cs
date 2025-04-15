using Actio.Application.Dtos;

namespace Actio.Application.Handlers;

public interface IHandler<TRequest, TResponse> 
{
    Task<BaseResponse<TResponse>> Handle(TRequest request);
}
