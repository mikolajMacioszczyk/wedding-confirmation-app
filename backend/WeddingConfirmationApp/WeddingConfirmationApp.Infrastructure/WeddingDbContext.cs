using Microsoft.EntityFrameworkCore;
using WeddingConfirmationApp.Domain.Models;

namespace WeddingConfirmationApp.Infrastructure;

public class WeddingDbContext : DbContext
{
    public WeddingDbContext(DbContextOptions<WeddingDbContext> options): base(options)
    {}

    public DbSet<Invitation> Invitations { get; set; }
}
