using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace odpp_serverless.Model
{
    public class ODPPFileUploadContext : DbContext
    {
        public ODPPFileUploadContext()
        {
        }

        public ODPPFileUploadContext(DbContextOptions<ODPPFileUploadContext> options)
            : base(options)
        {
        }
        public DbSet<MatterNewChange>? MatterNewChange { get; set; }
    }
}
