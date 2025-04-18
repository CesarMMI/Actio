using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;

namespace Actio.Infrastructure.Identity.Jwt;

internal class JwtBearerEventsHandler : JwtBearerEvents
{
    public JwtBearerEventsHandler()
    {
        OnAuthenticationFailed = OnAuthenticationFailedEvent;
        OnChallenge = OnChallengeEvent;
    }

    private Task OnAuthenticationFailedEvent(AuthenticationFailedContext context)
    {
        if (context.Exception is SecurityTokenExpiredException)
        {
            return WriteResponse(context.Response, "Token expired");
        }

        if (context.Exception is SecurityTokenInvalidSignatureException)
        {
            return WriteResponse(context.Response, "Invalid token");
        }

        return WriteResponse(context.Response, "Token authentication failed");
    }

    private Task OnChallengeEvent(JwtBearerChallengeContext context)
    {
        if (!context.Response.HasStarted)
        {
            return WriteResponse(context.Response, "Invalid token");
        }
        return Task.CompletedTask;
    }

    private static Task WriteResponse(HttpResponse response, string message)
    {
        response.StatusCode = 401;
        response.ContentType = "text/plain";
        return response.WriteAsync(message);
    }
}
