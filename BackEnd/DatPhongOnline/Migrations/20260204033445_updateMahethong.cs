using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatPhongOnline.Migrations
{
    /// <inheritdoc />
    public partial class updateMahethong : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaGiaoDichHeThong",
                table: "DatCocs");

            migrationBuilder.AlterColumn<string>(
                name: "MaGiaoDichVNPay",
                table: "DatCocs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "MaGiaoDichVNPay",
                table: "DatCocs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaGiaoDichHeThong",
                table: "DatCocs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
