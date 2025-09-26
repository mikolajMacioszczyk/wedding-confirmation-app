using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeddingConfirmationApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Added_SelectedDrink : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SelectedDrinkId",
                table: "PersonConfirmations",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "DrinkType",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DrinkType", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PersonConfirmations_SelectedDrinkId",
                table: "PersonConfirmations",
                column: "SelectedDrinkId");

            migrationBuilder.AddForeignKey(
                name: "FK_PersonConfirmations_DrinkType_SelectedDrinkId",
                table: "PersonConfirmations",
                column: "SelectedDrinkId",
                principalTable: "DrinkType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PersonConfirmations_DrinkType_SelectedDrinkId",
                table: "PersonConfirmations");

            migrationBuilder.DropTable(
                name: "DrinkType");

            migrationBuilder.DropIndex(
                name: "IX_PersonConfirmations_SelectedDrinkId",
                table: "PersonConfirmations");

            migrationBuilder.DropColumn(
                name: "SelectedDrinkId",
                table: "PersonConfirmations");
        }
    }
}
