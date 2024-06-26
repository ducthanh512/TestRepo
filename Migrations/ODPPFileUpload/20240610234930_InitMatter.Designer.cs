﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using odpp_serverless.Model;

#nullable disable

namespace odpp_serverless.Migrations.ODPPFileUpload
{
    [DbContext(typeof(ODPPFileUploadContext))]
    [Migration("20240610234930_InitMatter")]
    partial class InitMatter
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("odpp_serverless.Model.MatterNewChange", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<string>("AccessType")
                        .HasColumnType("text");

                    b.Property<string>("BlockUserEmails")
                        .HasColumnType("text");

                    b.Property<DateTime?>("DateEntered")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("JusticeLinkCaseNumber")
                        .HasColumnType("text");

                    b.Property<string>("LegalTeamEmails")
                        .HasColumnType("text");

                    b.Property<string>("LegalTeams")
                        .HasColumnType("text");

                    b.Property<string>("MatterHREF")
                        .HasColumnType("text");

                    b.Property<string>("MatterName")
                        .HasColumnType("text");

                    b.Property<string>("MatterNumber")
                        .HasColumnType("text");

                    b.Property<string>("MatterState")
                        .HasColumnType("text");

                    b.Property<string>("MatterStatus")
                        .HasColumnType("text");

                    b.Property<string>("MatterSubjects")
                        .HasColumnType("text");

                    b.Property<string>("MatterType")
                        .HasColumnType("text");

                    b.Property<string>("NewOrChange")
                        .HasColumnType("text");

                    b.Property<string>("ODPPOffice")
                        .HasColumnType("text");

                    b.Property<string>("OthersWithEdit")
                        .HasColumnType("text");

                    b.Property<string>("OthersWithRead")
                        .HasColumnType("text");

                    b.Property<string>("PoliceEventNumber")
                        .HasColumnType("text");

                    b.Property<string>("PracticeWithCarriage")
                        .HasColumnType("text");

                    b.Property<string>("PracticeWithCarriageEmail")
                        .HasColumnType("text");

                    b.Property<string>("PracticeWithCarriageManagerHierarchyEmail")
                        .HasColumnType("text");

                    b.Property<string>("PrimaryChargeCategory")
                        .HasColumnType("text");

                    b.Property<string>("Workgroup")
                        .HasColumnType("text");

                    b.HasKey("ID");

                    b.ToTable("MatterNewChange");
                });
#pragma warning restore 612, 618
        }
    }
}
