using Microsoft.EntityFrameworkCore;
using WeddingConfirmationApp.Api;
using WeddingConfirmationApp.Infrastructure;
using WeddingConfirmationApp.Infrastructure.Repositories;
using System.Reflection;
using WeddingConfirmationApp.Application.Scopes.Persons.Contracts;
using WeddingConfirmationApp.Application.Scopes.Persons.Commands.CreatePerson;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<WeddingDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(
    Assembly.GetExecutingAssembly(),
    typeof(CreatePersonCommandHandler).Assembly));

// Register repositories
builder.Services.AddScoped<IPersonRepository, PersonRepository>();

builder.Services.AddHostedService<DatabaseMigrator>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
