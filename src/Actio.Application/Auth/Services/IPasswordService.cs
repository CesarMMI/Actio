namespace Actio.Application.Auth.Services;

public interface IPasswordService
{
    public string Hash(string password);
    public bool Verify(string password, string hashedPassword);
}
