using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace odpp_serverless.Model
{
    public class MetadataFile
    {
        public string? HrefNo { get; set; }
        public string? FileName { get; set; }
        public string? FileType { get; set; }
        public string? MatterNo { get; set; }
        public string? DocumentType { get; set; }
        public string? DateUploaded { get; set; }
        public string? UploadedBy { get; set; }
        public string? LastName { get; set; }
        public string? FirstName { get; set; }
        public string? ContainerType { get; set; }
        public string? Location { get; set; }
        public string? RecipientGroupEmail { get; set; }
        public string? Sensitivity { get; set; }
    }
}
