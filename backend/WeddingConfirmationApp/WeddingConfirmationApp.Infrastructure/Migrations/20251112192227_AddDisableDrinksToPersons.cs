using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeddingConfirmationApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDisableDrinksToPersons : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "DisableDrinks",
                table: "Persons",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DisableDrinks",
                table: "Persons");
        }
    }
}
