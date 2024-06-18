using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace odpp_serverless.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FileUpload",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    fileName = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    fileType = table.Column<string>(type: "text", nullable: false),
                    fileSize = table.Column<int>(type: "integer", nullable: false),
                    batchId = table.Column<int>(type: "integer", nullable: true),
                    createdTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    modifiedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    url = table.Column<string>(type: "text", nullable: true),
                    createdUser = table.Column<string>(type: "text", nullable: false),
                    sensitive = table.Column<bool>(type: "boolean", nullable: false),
                    matterNumber = table.Column<string>(type: "text", nullable: true),
                    hNumber = table.Column<string>(type: "text", nullable: true),
                    location = table.Column<string>(type: "text", nullable: true),
                    category = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    briefType = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileUpload", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FileUpload");
        }
    }
}
