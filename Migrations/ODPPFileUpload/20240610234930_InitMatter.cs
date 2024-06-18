using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace odpp_serverless.Migrations.ODPPFileUpload
{
    /// <inheritdoc />
    public partial class InitMatter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MatterNewChange",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MatterNumber = table.Column<string>(type: "text", nullable: true),
                    MatterName = table.Column<string>(type: "text", nullable: true),
                    MatterSubjects = table.Column<string>(type: "text", nullable: true),
                    MatterHREF = table.Column<string>(type: "text", nullable: true),
                    MatterStatus = table.Column<string>(type: "text", nullable: true),
                    PrimaryChargeCategory = table.Column<string>(type: "text", nullable: true),
                    MatterType = table.Column<string>(type: "text", nullable: true),
                    MatterState = table.Column<string>(type: "text", nullable: true),
                    PracticeWithCarriage = table.Column<string>(type: "text", nullable: true),
                    PracticeWithCarriageEmail = table.Column<string>(type: "text", nullable: true),
                    PracticeWithCarriageManagerHierarchyEmail = table.Column<string>(type: "text", nullable: true),
                    LegalTeams = table.Column<string>(type: "text", nullable: true),
                    LegalTeamEmails = table.Column<string>(type: "text", nullable: true),
                    OthersWithRead = table.Column<string>(type: "text", nullable: true),
                    OthersWithEdit = table.Column<string>(type: "text", nullable: true),
                    BlockUserEmails = table.Column<string>(type: "text", nullable: true),
                    DateEntered = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    NewOrChange = table.Column<string>(type: "text", nullable: true),
                    Workgroup = table.Column<string>(type: "text", nullable: true),
                    ODPPOffice = table.Column<string>(type: "text", nullable: true),
                    JusticeLinkCaseNumber = table.Column<string>(type: "text", nullable: true),
                    PoliceEventNumber = table.Column<string>(type: "text", nullable: true),
                    AccessType = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatterNewChange", x => x.ID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MatterNewChange");
        }
    }
}
