namespace Actio.Application.Shared.Validators;

internal static class EnumValidators
{
    public static bool IsValidEnum<T>(this T actionType) where T : struct, Enum
    {
        return Enum.IsDefined<T>(actionType);
    }
}
