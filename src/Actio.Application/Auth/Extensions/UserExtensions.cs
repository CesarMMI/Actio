using Actio.Application.Auth.Results;
using Actio.Domain.Models;

namespace Actio.Application.Auth.Extensions;

public static class UserExtensions
{
    public static UserResult ToResult(this User user)
    {
        return new UserResult
        {
            Name = user.Name
        };
    }
}
