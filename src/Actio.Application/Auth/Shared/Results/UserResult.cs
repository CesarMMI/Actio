using Actio.Domain.Models;

namespace Actio.Application.Auth.Shared.Results;

public class UserResult
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
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
