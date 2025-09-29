using Microsoft.EntityFrameworkCore;
using WeddingConfirmationApp.Domain.Entities;
using WeddingConfirmationApp.Infrastructure;

namespace WeddingConfirmationApp.Api;

public class DatabaseSeeder : IHostedService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IConfiguration _configuration;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(IServiceProvider serviceProvider, IConfiguration configuration, ILogger<DatabaseSeeder> logger)
    {
        _serviceProvider = serviceProvider;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<WeddingDbContext>();

        try
        {
            await SeedDefaultAdminAsync(dbContext);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    private async Task SeedDefaultAdminAsync(WeddingDbContext dbContext)
    {
        var adminUsername = _configuration["DefaultAdmin:Username"];
        var adminPassword = _configuration["DefaultAdmin:Password"];

        if (string.IsNullOrEmpty(adminUsername) || string.IsNullOrEmpty(adminPassword))
        {
            _logger.LogWarning("Default admin credentials not found in configuration. Skipping admin user seeding.");
            return;
        }

        // Check if admin user already exists
        var existingAdmin = await dbContext.Users.FirstOrDefaultAsync();
        if (existingAdmin != null)
        {
            _logger.LogInformation("Admin user already exists. Skipping seeding.");
            return;
        }

        // Create default admin user
        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            Username = adminUsername,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
            Role = "Administrator",
            LastLoginAt = DateTime.UtcNow
        };

        dbContext.Users.Add(adminUser);
        await dbContext.SaveChangesAsync();

        _logger.LogInformation("Default admin user seeded successfully with username: {Username}", adminUsername);
    }
}