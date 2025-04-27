using System.Net.Mail;
using System.Text.RegularExpressions;

namespace Actio.Application.Shared.Validators;

internal static class StringValidators
{
    public static bool IsValidString(this string value)
    {
        return !string.IsNullOrWhiteSpace(value);
    }

    public static bool IsValidEmail(this string value)
    {
        try
        {
            var mail = new MailAddress(value);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public static bool IsValidColor(this string value)
    {
        if (!value.IsValidString()) return false;

        var hexColorRegex = new Regex("^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$");
        return hexColorRegex.IsMatch(value);
    }
}
