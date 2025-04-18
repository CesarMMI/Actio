namespace Actio.Web.Endpoints;

public static class Endpoints
{
    public static WebApplication MapEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("api");

        group.MapAuthEndpoints();

        return app;
    }
}
