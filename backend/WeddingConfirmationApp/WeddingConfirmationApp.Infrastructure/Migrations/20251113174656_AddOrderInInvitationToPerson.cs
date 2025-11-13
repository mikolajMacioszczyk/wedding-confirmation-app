using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeddingConfirmationApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderInInvitationToPerson : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrderInInvitation",
                table: "Persons",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderInInvitation",
                table: "Persons");
        }
    }
}
