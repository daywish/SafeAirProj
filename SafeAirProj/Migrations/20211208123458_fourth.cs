using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SafeAirProj.Migrations
{
    public partial class fourth : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "BuildingAddress",
                table: "Buildings",
                maxLength: 100,
                nullable: false,
                defaultValueSql: "(N'')",
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.CreateTable(
                name: "Devices",
                columns: table => new
                {
                    DeviceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoomId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Devices__49E12311C766877D", x => x.DeviceId);
                    table.ForeignKey(
                        name: "FK__Devices__RoomId__2F9A1060",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DevicesHistory",
                columns: table => new
                {
                    RecordingId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DeviceId = table.Column<int>(nullable: false),
                    RequestDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    TemperatureDate = table.Column<double>(nullable: true),
                    WetnessData = table.Column<double>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DevicesH__5CA5A94CCD830D9F", x => x.RecordingId);
                    table.ForeignKey(
                        name: "FK__DevicesHi__Devic__32767D0B",
                        column: x => x.DeviceId,
                        principalTable: "Devices",
                        principalColumn: "DeviceId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "UQ__Devices__328639383009586A",
                table: "Devices",
                column: "RoomId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DevicesHistory_DeviceId",
                table: "DevicesHistory",
                column: "DeviceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DevicesHistory");

            migrationBuilder.DropTable(
                name: "Devices");

            migrationBuilder.AlterColumn<string>(
                name: "BuildingAddress",
                table: "Buildings",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldDefaultValueSql: "(N'')");
        }
    }
}
