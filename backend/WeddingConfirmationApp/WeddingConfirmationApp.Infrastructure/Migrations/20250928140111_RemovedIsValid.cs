using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeddingConfirmationApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemovedIsValid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsValid",
                table: "PersonConfirmations");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsValid",
                table: "PersonConfirmations",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
