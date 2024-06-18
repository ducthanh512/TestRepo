using System.ComponentModel;
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
    public class FileUploadAddNew
    {
        private readonly ILogger _logger;
        private readonly CosmosDbContext _context;

        public FileUploadAddNew(ILoggerFactory loggerFactory, CosmosDbContext context)
        {
            _logger = loggerFactory.CreateLogger<FileUploadAddNew>();
            _context = context;
        }

        [Function("AddFileUpload")]
        [Authorize(Scopes = new[] { "access" })]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "FileUploads")] HttpRequestData req)
        {
            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var fileUpload = JsonConvert.DeserializeObject<FileUpload>(requestBody);
                _context.FilesUpload!.Add(fileUpload!);
                await _context.SaveChangesAsync();
                return new OkObjectResult(fileUpload);
            }
            catch (Exception ex)
            {
                return new NotFoundObjectResult(ex.Message);
            }


        }

        public async Task<int> AddNewFileUpload(FileUpload fileUpload)
        {
            _context.FilesUpload!.Add(fileUpload!);
            await _context.SaveChangesAsync();
            return fileUpload.Id;
        }
    }
}
