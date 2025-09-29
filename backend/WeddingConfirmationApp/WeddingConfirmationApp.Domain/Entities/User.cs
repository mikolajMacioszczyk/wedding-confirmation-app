using System.ComponentModel.DataAnnotations;

namespace WeddingConfirmationApp.Domain.Entities;

public class User : BaseDomainEntity
{
    [Required]
    [StringLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Role { get; set; } = "Guest";

    public DateTime LastLoginAt { get; set; }
}