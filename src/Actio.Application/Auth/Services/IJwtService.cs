using Actio.Domain.Models;

namespace Actio.Application.Auth.Services;

public interface IJwtService
{
    public string GenerateAccessToken(User user);
}
