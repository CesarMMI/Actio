using Actio.Infrastructure.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
            return context.Response.WriteResponse("Token expired");
        }

        if (context.Exception is SecurityTokenInvalidSignatureException)
        {
            return context.Response.WriteResponse("Invalid token");
        }

        return context.Response.WriteResponse("Token authentication failed");
    }

    public Task OnChallengeEvent(JwtBearerChallengeContext context)
    {
        if (!context.Response.HasStarted)
        {
            return context.Response.WriteResponse("Invalid token");
        }
        return Task.CompletedTask;
    }
}
