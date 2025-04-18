using System.Net.Mail;

namespace Actio.Application.Shared.Validators;

internal static class StringValidators
{
    public static bool IsValidString(this string value)
    {
        return !string.IsNullOrWhiteSpace(value);
    }

    public static bool IsValidEmail(this string email)
    {
        try
        {
            var mail = new MailAddress(email);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
