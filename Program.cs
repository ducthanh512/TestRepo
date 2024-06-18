using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json.Serialization;
using System.Text.Json;
using odpp_serverless.Model;
using IsolatedFunctionAuth.Middleware;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using System.Reflection.PortableExecutable;
using odpp_serverless.AuthorizationPolicies;


[assembly: FunctionsStartup(typeof(Program))]

public class Program
{
    private static void Main(string[] args)
    {
        var config = new ConfigurationBuilder();

        var host = new HostBuilder()
       .ConfigureFunctionsWorkerDefaults(builder =>
       {
           builder.UseMiddleware<AuthenticationMiddleware>();
           builder.UseMiddleware<AuthorizationMiddleware>();
       })

    .ConfigureServices((appBuilder, services) =>
    {
        Console.WriteLine("go to the main");
        var configuration = appBuilder.Configuration;
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddMicrosoftIdentityWebApi(options =>
        {
            configuration.Bind("AzureAdB2C", options);
            options.TokenValidationParameters.NameClaimType = "name";
        },
        options => { configuration.Bind("AzureAdB2C", options); });
        
        services.Configure<JsonSerializerOptions>(options =>
        {
            options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.Converters.Add(new JsonStringEnumConverter());
        });
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
        services.AddCors(options =>
        {
            options.AddPolicy("AllRequests", builder =>
            {
                builder.AllowAnyHeader()
                .AllowAnyMethod()
                .SetIsOriginAllowed(
                    origin =>origin == "http://localhost:4200");
            });
        });

        var sqlConnectionString = Environment.GetEnvironmentVariable("SQLServerConnection");
       // services.AddDbContext<ODPPFileUploadContext>(opt => opt.UseSqlServer(sqlConnectionString!));
        services.AddDbContext<ODPPFileUploadContext>(opt => opt.UseNpgsql(sqlConnectionString!));


        var cosmosConnectionString = Environment.GetEnvironmentVariable("CosmosConnection");
        services.AddDbContext<CosmosDbContext>(opt => opt.UseNpgsql(cosmosConnectionString!));
        
    })
    .Build();

        host.Run();
    }
}