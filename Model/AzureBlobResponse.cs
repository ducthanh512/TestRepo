using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace odpp_serverless.Model
{
    public class AzureBlobResponse
    {
        public int StatusCode { get; set; }
        public string ReasonPhrase { get; set; }
        public Uri BlobUri { get; set; }
        public bool IsError { get; set; }
        public string FileName { get; set; }
        public byte[]? FileBytes { get; set; }
        public string ErrorMessage { get; set; }
    }
}
