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
    public class MatterAPI
    {
        private readonly ILogger _logger;
        private readonly ODPPFileUploadContext _context;

        public MatterAPI(ILoggerFactory loggerFactory, ODPPFileUploadContext context)
        {
            _logger = loggerFactory.CreateLogger<MatterAPI>();
            _context = context;
        }

        [Function("GetAll")]
        [Authorize(Scopes = new[] { "access" })]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
        {
            try
            {
                if (req.Method == HttpMethods.Post)
                {
                    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                    var matterNewChange = JsonConvert.DeserializeObject<MatterNewChange>(requestBody);

                    _context.MatterNewChange!.Add(matterNewChange);
                    await _context.SaveChangesAsync();
                    return new CreatedResult("matter", matterNewChange);

                }

                var matterNewChanges = await _context.MatterNewChange!.ToListAsync();

                return new OkObjectResult(matterNewChanges);
            }
            catch (Exception ex)
            {

                return new OkObjectResult(ex.Message);
            }


        }

    }
}
