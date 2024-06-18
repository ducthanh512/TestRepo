using System.Net;
using Azure.Storage.Blobs;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using odpp_serverless.Model;
using IsolatedFunctionAuth.Authorization;

namespace odpp_serverless.API
{
    public class CustomConfigurationGet
    {
        private readonly ILogger _logger;

        public CustomConfigurationGet(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<CustomConfigurationGet>();
        }

        [Function("configuration")]
        [Authorize(Scopes = new[] { "access" })]
        public HttpResponseData Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
        {
            _logger.LogInformation("Get custom configurations");

            var response = req.CreateResponse(HttpStatusCode.OK);
            
            try
            {
                var maximumFileSize = Environment.GetEnvironmentVariable("MaximumFileSize")!;
                var uploadFileTypes = Environment.GetEnvironmentVariable("UploadFileTypes")!;
                var maximumTotalFiles = Environment.GetEnvironmentVariable("MaximumTotalFiles")!;

                var customConfiguration = new CustomConfiguration()
                {
                    MaximumFileSize = Int32.Parse(maximumFileSize),
                    UploadFileTypes = uploadFileTypes,
                    MaximumTotalFiles = Int32.Parse(maximumTotalFiles)
                };
                response.WriteAsJsonAsync(customConfiguration);
            }
            catch (Exception ex)
            {
                response.Headers.Add("Content-Type", "text/plain; charset=utf-8");
                response.WriteString(ex.Message);
            }


            return response;
        }
    }
}
