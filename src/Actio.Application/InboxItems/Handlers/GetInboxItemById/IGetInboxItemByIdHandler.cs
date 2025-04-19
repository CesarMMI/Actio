using Actio.Application.InboxItems.Dtos;
using Actio.Application.Shared.Interfaces;

namespace Actio.Application.InboxItems.Handlers.GetInboxItemById;

public interface IGetInboxItemByIdHandler : IHandler<GetInboxItemByIdRequest, InboxItemResponse>
{
}
