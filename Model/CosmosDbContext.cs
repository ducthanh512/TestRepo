using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace odpp_serverless.Model
{

    public  class CosmosDbContext : DbContext
    {
        public CosmosDbContext()
        {
        }

        public CosmosDbContext(DbContextOptions<CosmosDbContext> options)
            : base(options)
        {
        }

        public DbSet<FileUpload>? FilesUpload { get; set; }

    }
}
