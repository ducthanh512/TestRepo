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
    public class MatterGetByHNumber
    {
        private readonly ILogger _logger;
        private readonly ODPPFileUploadContext _context;

        public MatterGetByHNumber(ILoggerFactory loggerFactory, ODPPFileUploadContext context)
        {
            _logger = loggerFactory.CreateLogger<MatterGetByHNumber>();
            _context = context;
        }

        [Function("GetMatterByHNumber")]
        [Authorize(Scopes = [ "access"])]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "MatterNewChanges/hnumber/{hnumber}")] HttpRequestData req, string hnumber)
        {
            try
            {
                var matterNewChange = await _context.MatterNewChange!.FirstOrDefaultAsync(x => x.MatterHREF!.Contains(hnumber));
                if (matterNewChange == null || matterNewChange.ID == -1) { return new NotFoundObjectResult(matterNewChange); };
                return new OkObjectResult(matterNewChange);
            }
            catch (Exception ex)
            {
                return new NotFoundObjectResult(ex.Message);
            }


        }

    }
}
