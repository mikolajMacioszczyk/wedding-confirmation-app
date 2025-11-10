using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeddingConfirmationApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCreationDateTimeToInvitation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreationDateTime",
                table: "Invitations",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreationDateTime",
                table: "Invitations");
        }
    }
}
