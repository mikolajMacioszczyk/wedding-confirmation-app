using Microsoft.EntityFrameworkCore;
using WeddingConfirmationApp.Domain.Entities;

namespace WeddingConfirmationApp.Infrastructure;

public class WeddingDbContext : DbContext
{
    public WeddingDbContext(DbContextOptions<WeddingDbContext> options): base(options)
    {}

    public DbSet<Invitation> Invitations { get; set; }

    public DbSet<Person> Persons { get; set; }

    public DbSet<PersonConfirmation> PersonConfirmations { get; set; }

    public DbSet<DrinkType> DrinkTypes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Invitation>()
            .HasIndex(i => i.PublicId);

        modelBuilder.Entity<DrinkType>()
            .HasIndex(i => i.Type);
    }
}
