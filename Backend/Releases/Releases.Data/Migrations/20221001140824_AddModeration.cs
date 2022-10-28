using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HostMusic.Releases.Data.Migrations
{
    public partial class AddModeration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ModerationComment",
                table: "Releases",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ModerationPassed",
                table: "Releases",
                type: "boolean",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ModerationComment",
                table: "Releases");

            migrationBuilder.DropColumn(
                name: "ModerationPassed",
                table: "Releases");
        }
    }
}
