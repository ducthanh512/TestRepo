using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace odpp_serverless.Model
{
    public class CustomConfiguration
    {
        public int? MaximumTotalFiles { get; set; }
        public int? MaximumFileSize { get; set; }
        public string? UploadFileTypes { get; set; }
    }
}
