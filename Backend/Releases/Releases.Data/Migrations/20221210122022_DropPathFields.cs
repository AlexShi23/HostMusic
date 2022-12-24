using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HostMusic.Releases.Data.Migrations
{
    public partial class DropPathFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TrackPath",
                table: "Track");

            migrationBuilder.DropColumn(
                name: "CoverPath",
                table: "Releases");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TrackPath",
                table: "Track",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CoverPath",
                table: "Releases",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
