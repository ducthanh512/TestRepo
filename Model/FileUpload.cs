using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace odpp_serverless.Model
{
    [Table("FileUpload")]
    public class FileUpload
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(500)]
        public string fileName { get; set; }
        public string fileType { get; set; }
        public int fileSize { get; set; }
        public int? batchId { get; set; }
        public DateTime createdTime { get; set; }
        public DateTime? modifiedTime { get; set; }
        public string? url { get; set; }
        public string createdUser { get; set; }
        public bool sensitive { get; set; }
        public string? matterNumber { get; set; }
        public string? hNumber { get; set; }
        public string? location { get; set; }
        public string category { get; set; }
        public string status { get; set; }

        public string? briefType { get; set; }
    }
}
