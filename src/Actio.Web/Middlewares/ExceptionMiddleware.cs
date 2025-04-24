using Actio.Application.Shared.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Actio.Web.Middlewares;

public static class ExceptionMiddleware
{
    public static IApplicationBuilder UseAppExceptionHandler(this IApplicationBuilder app)
    {
        app.UseExceptionHandler(exceptionApp =>
        {
            exceptionApp.Run(async context =>
            {
                var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

                switch (exception)
                {
                    case AppException ex:
                        var appEx = (AppException)exception;
                        await context.WriteProblemAsync(appEx.StatusCode, appEx.Title, appEx.Message);
                        break;
                    case Exception ex:
                        await context.WriteProblemAsync(500, "Internal server error", "Internal server error");
                        break;
                }
            });
        });
        return app;
    }

    private static async Task WriteProblemAsync(this HttpContext context, int statusCode, string title, string message)
    {
        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = message,
            Instance = context.Request.Path
        };

        await Results.Problem(problemDetails).ExecuteAsync(context);
    }
}
