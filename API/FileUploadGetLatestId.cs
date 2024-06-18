using System.Net;
using Azure;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using odpp_serverless.Model;
using IsolatedFunctionAuth.Authorization;

namespace odpp_serverless.API
{
    
    public class FileUploadGetLatestId
    {
        private readonly ILogger _logger;
        private readonly CosmosDbContext _context;

        public FileUploadGetLatestId(ILoggerFactory loggerFactory, CosmosDbContext context)
        {
            _logger = loggerFactory.CreateLogger<MatterGetByHNumber>();
            _context = context;
        }

        
        [Function("GetLatestId")]
        [Authorize(Scopes = new[] { "access" })]
        public async Task<int> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
        {
            try
            {
                var fileUpload = await _context.FilesUpload!.OrderByDescending(f => f.Id).FirstAsync();

                return fileUpload.Id;
            }
            catch (Exception ex)
            {
                return 0;
            }


        }

    }
}
