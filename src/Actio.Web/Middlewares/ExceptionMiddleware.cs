using Actio.Application.Dtos;
using Actio.Application.Exceptions;
using Microsoft.AspNetCore.Diagnostics;

namespace Actio.Web.Middlewares;

public static class ExceptionMiddleware
{
    public static WebApplication UseAppExceptionHandler(this WebApplication app)
    {
        app.UseExceptionHandler(errorApp =>
        {
            errorApp.Run(async context =>
            {
                context.Response.ContentType = "application/json";

                var exceptionHandler = context.Features.Get<IExceptionHandlerFeature>();
                var exception = exceptionHandler?.Error;

                switch (exception)
                {
                    case AppException:
                        var ex = (AppException)exception;
                        await context.WriteAsJsonAsync(ex.StatusCode, ex.Message);
                        break;
                    case Exception:
                        await context.WriteAsJsonAsync(500, exception.Message);
                        break;
                }
            });
        });
        return app;
    }

    private static async Task WriteAsJsonAsync(this HttpContext context, int statusCode, string message)
    {
        context.Response.StatusCode = statusCode;
        await context.Response.WriteAsJsonAsync(new BaseResponse<dynamic> { Message = message });
    }
}
