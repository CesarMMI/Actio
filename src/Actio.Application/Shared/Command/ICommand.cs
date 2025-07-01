namespace Actio.Application.Shared.Command;

public interface ICommand<TReq, TRes> where TReq : struct
{
    public Task<TRes> ExecuteAsync(TReq query);
}

public interface ICommand<TReq> where TReq : struct
{
    public Task ExecuteAsync(TReq query);
}
