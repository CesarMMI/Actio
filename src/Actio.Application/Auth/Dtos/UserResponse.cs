using Actio.Domain.Models;

namespace Actio.Application.Auth.Dtos;

public class UserResponse
{
    public required int Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
}

public static class UserResponseExtensions
{
    public static UserResponse ToUserResponse(this User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email
        };
    }
}
