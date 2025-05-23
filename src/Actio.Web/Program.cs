using Actio.Application;
using Actio.Infrastructure;
using Actio.Web.Endpoints;
using Actio.Web.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddOpenApi()
    .AddInfrastructure(builder.Configuration)
    .AddApplication();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app
    .UseHttpsRedirection()
    .UseAppExceptionHandler()
    .UseAuthentication()
    .UseAuthorization();

app.MapEndpoints();

app.Run();
