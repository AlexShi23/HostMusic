﻿// <auto-generated />
using System;
using HostMusic.Releases.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HostMusic.Releases.Data.Migrations
{
    [DbContext(typeof(ReleasesContext))]
    [Migration("20221001140630_Initial")]
    partial class Initial
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("HostMusic.Releases.Data.Entities.Release", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Artist")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("CoverPath")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<TimeSpan>("Duration")
                        .HasColumnType("interval");

                    b.Property<bool?>("Explicit")
                        .HasColumnType("boolean");

                    b.Property<string>("Featuring")
                        .HasColumnType("text");

                    b.Property<string>("Genre")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Language")
                        .HasColumnType("text");

                    b.Property<int>("NumberOfPlays")
                        .HasColumnType("integer");

                    b.Property<int>("NumberOfTracks")
                        .HasColumnType("integer");

                    b.Property<int>("OwnerId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("ReleaseDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("ReleasedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<string>("Subtitle")
                        .HasColumnType("text");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("Releases");
                });

            modelBuilder.Entity("HostMusic.Releases.Data.Entities.Release", b =>
                {
                    b.OwnsMany("HostMusic.Releases.Data.Entities.Track", "Tracks", b1 =>
                        {
                            b1.Property<Guid>("Id")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("uuid");

                            b1.Property<string>("Artist")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.Property<TimeSpan>("Duration")
                                .HasColumnType("interval");

                            b1.Property<bool?>("Explicit")
                                .HasColumnType("boolean");

                            b1.Property<string>("Featuring")
                                .HasColumnType("text");

                            b1.Property<int>("Index")
                                .HasColumnType("integer");

                            b1.Property<string>("Lyrics")
                                .HasColumnType("text");

                            b1.Property<int>("NumberOfPlays")
                                .HasColumnType("integer");

                            b1.Property<Guid>("ReleaseId")
                                .HasColumnType("uuid");

                            b1.Property<string>("Subtitle")
                                .HasColumnType("text");

                            b1.Property<string>("Title")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.Property<string>("TrackPath")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.HasKey("Id");

                            b1.HasIndex("ReleaseId");

                            b1.ToTable("Track");

                            b1.WithOwner()
                                .HasForeignKey("ReleaseId");
                        });

                    b.Navigation("Tracks");
                });
#pragma warning restore 612, 618
        }
    }
}
