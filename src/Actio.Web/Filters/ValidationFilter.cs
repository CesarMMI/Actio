using System.ComponentModel.DataAnnotations;

namespace Actio.Web.Filters;

public static class ValidationFilter
{
    public static RouteHandlerBuilder Validate<T>(this RouteHandlerBuilder builder)
    {
        builder.AddEndpointFilter(async (context, next) =>
        {
            var argument = context.Arguments.OfType<T>().FirstOrDefault();
            if (argument is null)
            {
                return await next(context);
            }

            var response = argument.DataAnnotationsValidate();
            if (!response.IsValid)
            {
                var errorMessage = response.Results.FirstOrDefault()?.ErrorMessage;
                return Results.Content(errorMessage);
            }

            return await next(context);
        });
        return builder;
    }

    private static (List<ValidationResult> Results, bool IsValid) DataAnnotationsValidate(this object model)
    {
        var results = new List<ValidationResult>();
        var context = new ValidationContext(model);

        var isValid = Validator.TryValidateObject(model, context, results, true);

        return (results, isValid);
    }
}