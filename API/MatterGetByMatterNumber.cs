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
    public class MatterGetByMatterNumber
    {
        private readonly ILogger _logger;
        private readonly ODPPFileUploadContext _context;

        public MatterGetByMatterNumber(ILoggerFactory loggerFactory, ODPPFileUploadContext context)
        {
            _logger = loggerFactory.CreateLogger<MatterGetByMatterNumber>();
            _context = context;
        }

        [Function("GetMatterByMatterNumber")]
        [Authorize(Scopes = new[] { "access" })]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "MatterNewChanges/matternumber/{matterNumber}")] HttpRequestData req, string matterNumber)
        {
            try
            {
                var matterNewChange = await _context.MatterNewChange!.FirstOrDefaultAsync(x => x.MatterNumber != null && x.MatterNumber.Length > 0 && x.MatterNumber.Trim() == matterNumber && x.MatterStatus == "ADV");
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
