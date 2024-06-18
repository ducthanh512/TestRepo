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
    public class FileUploadGetByHnumber
    {
        private readonly ILogger _logger;
        private readonly CosmosDbContext _context;

        public FileUploadGetByHnumber(ILoggerFactory loggerFactory, CosmosDbContext context)
        {
            _logger = loggerFactory.CreateLogger<MatterGetByHNumber>();
            _context = context;
        }

        [Function("GetFilesUploadByHNumber")]
        [Authorize(Scopes = new[] { "access" })]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "FileUpload/{hNumber}")] HttpRequestData req, string hNumber)
        {
            try
            {
                var filesUpload = await _context.FilesUpload!.Where(file => file.hNumber == hNumber).ToListAsync();

                return new OkObjectResult(filesUpload!);
            }
            catch (Exception ex)
            {
                return new OkObjectResult(ex.Message);
            }
        }

    }
}
