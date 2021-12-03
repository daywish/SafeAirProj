using Microsoft.EntityFrameworkCore.Migrations;

namespace SafeAirProj.Migrations
{
    public partial class third : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BuildingAddres",
                table: "Buildings");

            migrationBuilder.AddColumn<string>(
                name: "BuildingAddress",
                table: "Buildings",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BuildingAddress",
                table: "Buildings");

            migrationBuilder.AddColumn<string>(
                name: "BuildingAddres",
                table: "Buildings",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }
    }
}
