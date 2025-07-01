using System.Net.Mail;

namespace Actio.Application.Shared.Extensions;

internal static class StringExtensions
{
    public static bool IsNullOrWhiteSpace(this string? value)
    {
        return string.IsNullOrWhiteSpace(value);
    }

    public static bool IsValidEmail(this string? value)
    {
        if (value.IsNullOrWhiteSpace()) return false;
        try
        {
            var mail = new MailAddress(value!);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
