using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeddingConfirmationApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedUniqueIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PersonConfirmations_DrinkType_SelectedDrinkId",
                table: "PersonConfirmations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DrinkType",
                table: "DrinkType");

            migrationBuilder.RenameTable(
                name: "DrinkType",
                newName: "DrinkTypes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DrinkTypes",
                table: "DrinkTypes",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Invitations_PublicId",
                table: "Invitations",
                column: "PublicId");

            migrationBuilder.CreateIndex(
                name: "IX_DrinkTypes_Type",
                table: "DrinkTypes",
                column: "Type");

            migrationBuilder.AddForeignKey(
                name: "FK_PersonConfirmations_DrinkTypes_SelectedDrinkId",
                table: "PersonConfirmations",
                column: "SelectedDrinkId",
                principalTable: "DrinkTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PersonConfirmations_DrinkTypes_SelectedDrinkId",
                table: "PersonConfirmations");

            migrationBuilder.DropIndex(
                name: "IX_Invitations_PublicId",
                table: "Invitations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DrinkTypes",
                table: "DrinkTypes");

            migrationBuilder.DropIndex(
                name: "IX_DrinkTypes_Type",
                table: "DrinkTypes");

            migrationBuilder.RenameTable(
                name: "DrinkTypes",
                newName: "DrinkType");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DrinkType",
                table: "DrinkType",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PersonConfirmations_DrinkType_SelectedDrinkId",
                table: "PersonConfirmations",
                column: "SelectedDrinkId",
                principalTable: "DrinkType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
