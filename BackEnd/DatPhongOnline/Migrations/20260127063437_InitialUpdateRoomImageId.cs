using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatPhongOnline.Migrations
{
    /// <inheritdoc />
    public partial class InitialUpdateRoomImageId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PublicId",
                table: "RoomImages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "RoomImages");
        }
    }
}
