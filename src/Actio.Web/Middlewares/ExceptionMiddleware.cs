using Actio.Application.Shared.Exceptions;
using Microsoft.AspNetCore.Diagnostics;

namespace Actio.Web.Middlewares;

public static class ExceptionMiddleware
{
    public static IApplicationBuilder UseAppExceptionHandler(this IApplicationBuilder app)
    {
        app.UseExceptionHandler(errorApp =>
        {
            errorApp.Run(async context =>
            {
                var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

                switch (exception)
                {
                    case AppException ex:
                        var appEx = (AppException)exception;
                        await context.WriteAsJsonAsync(appEx.StatusCode, appEx.Message);
                        break;
                    case Exception ex:
                        await context.WriteAsJsonAsync(500, "Internal server error");
                        break;
                }
            });
        });
        return app;
    }

    private static async Task WriteAsJsonAsync(this HttpContext context, int statusCode, string message)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "text/plain";
        await context.Response.WriteAsync(message);
    }
}
