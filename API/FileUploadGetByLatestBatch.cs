using System.Net;
using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using odpp_serverless.Model;
using IsolatedFunctionAuth.Authorization;

namespace odpp_serverless.API
{
    public class FileUploadGetByLatestBatch
    {
        private readonly ILogger _logger;
        private readonly CosmosDbContext _context;

        public FileUploadGetByLatestBatch(ILoggerFactory loggerFactory, CosmosDbContext context)
        {
            _logger = loggerFactory.CreateLogger<MatterGetByHNumber>();
            _context = context;
        }

        [Function("GetLatestBatch")]
        [Authorize(Scopes = new[] { "access" })]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req)
        {
            try
            {
                var batchId = await _context.FilesUpload!.OrderByDescending(f => f.batchId).Select(x => x.batchId).FirstAsync();
                var filesUpload = await _context.FilesUpload!.Where(file => file.batchId == batchId).ToListAsync();

                return new OkObjectResult(filesUpload!);
            }
            catch (Exception ex)
            {
                return new OkObjectResult(ex.Message);
            }


        }

    }
}
