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

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<DrinkType>()
            .HasIndex(i => i.Type);

        modelBuilder.Entity<DrinkType>()
            .HasMany<PersonConfirmation>()
            .WithOne(d => d.SelectedDrink)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Invitation>()
            .HasIndex(i => i.PublicId);

        modelBuilder.Entity<Invitation>()
            .HasMany<PersonConfirmation>()
            .WithOne(d => d.Invitation)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<Person>()
            .HasMany<PersonConfirmation>()
            .WithOne(d => d.Person)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
