using Actio.Domain.Models;

namespace Actio.Application.Auth.Shared.Results;

public class UserResult
{
    public required int Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
}

public static class UserResponseExtensions
{
    public static UserResult ToUserResult(this User user)
    {
        return new UserResult
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email
        };
    }
}
