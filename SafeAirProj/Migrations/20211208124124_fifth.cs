using Microsoft.EntityFrameworkCore.Migrations;

namespace SafeAirProj.Migrations
{
    public partial class fifth : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Devices__RoomId__2F9A1060",
                table: "Devices");

            migrationBuilder.DropForeignKey(
                name: "FK__DevicesHi__Devic__32767D0B",
                table: "DevicesHistory");

            migrationBuilder.AddForeignKey(
                name: "FK__Devices__RoomId__2F9A1060",
                table: "Devices",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "RoomId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK__DevicesHi__Devic__32767D0B",
                table: "DevicesHistory",
                column: "DeviceId",
                principalTable: "Devices",
                principalColumn: "DeviceId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Devices__RoomId__2F9A1060",
                table: "Devices");

            migrationBuilder.DropForeignKey(
                name: "FK__DevicesHi__Devic__32767D0B",
                table: "DevicesHistory");

            migrationBuilder.AddForeignKey(
                name: "FK__Devices__RoomId__2F9A1060",
                table: "Devices",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "RoomId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK__DevicesHi__Devic__32767D0B",
                table: "DevicesHistory",
                column: "DeviceId",
                principalTable: "Devices",
                principalColumn: "DeviceId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
