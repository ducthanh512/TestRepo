using System.Net;
using System.Text;
using Azure;
using Azure.Core;
using Azure.Storage.Blobs;
using HttpMultipartParser;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using odpp_serverless.Model;
using IsolatedFunctionAuth.Authorization;

namespace odpp_serverless.API
{
    public class AzureBlobStorage
    {
        private readonly ILogger _logger;
        private readonly ODPPFileUploadContext _context;
        private readonly CosmosDbContext _cosmosContext;
        private readonly BlobContainerClient _blobContainerClientFile;
        private readonly BlobContainerClient _blobContainerClientMetadata;
        public AzureBlobStorage(ILoggerFactory loggerFactory, ODPPFileUploadContext context, CosmosDbContext cosmosContext)
        {
            _logger = loggerFactory.CreateLogger<AzureBlobStorage>();
            this._blobContainerClientFile = new BlobContainerClient(new Uri(Environment.GetEnvironmentVariable("KyndrylEvidence")!));
            this._blobContainerClientMetadata = new BlobContainerClient(new Uri(Environment.GetEnvironmentVariable("KydrylMetadata")!));
            _context = context;
            _cosmosContext = cosmosContext;
        }

        [Function("uploadclient")]
        //[Authorize(Scopes = new[] { "access" })]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Blob/uploadclient")] HttpRequestData req)
        {
            try
            {

                var parsedFormBody = MultipartFormDataParser.ParseAsync(req.Body);
                var file = parsedFormBody.Result.Files[0];

                var result = await UploadFileAsync("", file.FileName, file.Data, parsedFormBody.Result.Parameters);

                return new OkObjectResult(result);
            }
            catch (Exception ex)
            {
                return new NotFoundObjectResult(ex.Message);
            }
        }

        public FileUpload CreateFileUpload(IReadOnlyList<ParameterPart> form)
        {
            var fileUpload = new FileUpload() {
                fileName = form.FirstOrDefault(x => x.Name == "FileName")!.Data,
                fileType = form.FirstOrDefault(x => x.Name == "FileType")!.Data,
                batchId = int.Parse(form.FirstOrDefault(x => x.Name == "batchId")!.Data),
                createdTime = DateTime.UtcNow,
                createdUser = form.FirstOrDefault(x => x.Name == "createdUser")!.Data,
                sensitive = form.FirstOrDefault(x => x.Name == "sensitive")!.Data== "sensitive"?true: false,
                matterNumber = form.FirstOrDefault(x => x.Name == "matterNumber")!.Data,
                hNumber = form.FirstOrDefault(x => x.Name == "hNumber")!.Data,
                location = form.FirstOrDefault(x => x.Name == "location")!.Data,
                category = form.FirstOrDefault(x => x.Name == "category")!.Data,
                status = "New",
                briefType = form.FirstOrDefault(x => x.Name == "DocumentType")!.Data
            };

            return fileUpload;
        }
        public async Task<AzureBlobResponse> UploadFileAsync(string DirectoryName, string fileName, Stream fileStream, IReadOnlyList<ParameterPart> form)
        {
            var blobResponse = new AzureBlobResponse();
            var fileUpload = CreateFileUpload(form);
            try
            {
                
                _cosmosContext.Add(fileUpload);
                await _cosmosContext.SaveChangesAsync();

              


                var blobResult = await _blobContainerClientFile.UploadBlobAsync(fileName, fileStream);
                var metaResult = await _blobContainerClientMetadata.UploadBlobAsync(fileName + ".json", this.CreateJsonFile(form));

                await UpdateFileUpload(fileUpload, _cosmosContext, "Success", _blobContainerClientFile.Uri.AbsoluteUri);


                
                blobResponse = new AzureBlobResponse()
                {
                    FileName = fileName,
                    StatusCode = blobResult.GetRawResponse().Status,
                    ReasonPhrase = blobResult.GetRawResponse().ReasonPhrase,
                };
            }
            catch (RequestFailedException rfex)
            {
                
                if(rfex.Status == 409)
                {
                    await UpdateFileUpload(fileUpload, _cosmosContext, "Existed",null);
                }
                else
                {
                    await UpdateFileUpload(fileUpload, _cosmosContext, "Failed (" + rfex.Message + ")", null);
                }
                blobResponse.IsError = true;
                blobResponse.StatusCode = rfex.Status;
                blobResponse.ErrorMessage = rfex.Message;

            }
            catch (Exception ex)
            {
                await UpdateFileUpload(fileUpload, _cosmosContext, "Failed ("+ ex.Message +")", null);
                blobResponse.IsError = true;
                blobResponse.StatusCode = 500;
                blobResponse.ErrorMessage = ex.Message;
                _logger.LogWarning("Upload file failed: " + ex.Message);
            }
            return blobResponse;

        }

        private async Task UpdateFileUpload(FileUpload fileUpload, CosmosDbContext context, string status, string? uri)
        {

            if(uri!=null) fileUpload.url = uri;
            fileUpload.status = status;
            fileUpload.modifiedTime = DateTime.UtcNow;
            context.FilesUpload!.Update(fileUpload);
            await context.SaveChangesAsync();
        }


        private MemoryStream CreateJsonFile(IReadOnlyList<ParameterPart> form)
        {
            MetadataFile metadataFile = new MetadataFile()
            {
                HrefNo = form.FirstOrDefault(x => x.Name == "hNumber")!.Data,
                FileName = form.FirstOrDefault(x => x.Name == "FileName")!.Data,
                FileType = form.FirstOrDefault(x => x.Name == "FileType")!.Data,
                MatterNo = form.FirstOrDefault(x => x.Name == "matterNumber")!.Data,
                DocumentType = form.FirstOrDefault(x => x.Name == "DocumentType")!.Data,
                DateUploaded = DateTime.Now.ToString(),
                UploadedBy = form.FirstOrDefault(x => x.Name == "createdUser")!.Data,
                LastName = form.FirstOrDefault(x => x.Name == "lastName")!.Data,
                FirstName = form.FirstOrDefault(x => x.Name == "firstName")!.Data,
                ContainerType = form.FirstOrDefault(x => x.Name == "category")!.Data,
                Location = form.FirstOrDefault(x => x.Name == "location")!.Data,
                RecipientGroupEmail = form.FirstOrDefault(x => x.Name == "PracticeWithCarriageManagerHierarchyEmail")!.Data,
                Sensitivity = form.FirstOrDefault(x => x.Name == "sensitive")!.Data
            };


            JObject json = (JObject)JToken.FromObject(metadataFile);
            // convert string to stream
            byte[] byteArray = Encoding.ASCII.GetBytes(json.ToString());
            MemoryStream stream = new MemoryStream(byteArray);

            return stream;
        }



    }
}
