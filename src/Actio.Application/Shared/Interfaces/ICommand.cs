using Actio.Application.Shared.Dto;

namespace Actio.Application.Shared.Interfaces;

public interface ICommand<TQuery, TResult> where TQuery : BaseQuery
{
    Task<TResult> Handle(TQuery request);
}
