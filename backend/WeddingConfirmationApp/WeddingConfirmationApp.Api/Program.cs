using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using WeddingConfirmationApp.Api;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Scopes.Invitations.Mappings;
using WeddingConfirmationApp.Application.Scopes.Persons.Commands.CreatePerson;
using WeddingConfirmationApp.Application.Scopes.Persons.Mappings;
using WeddingConfirmationApp.Infrastructure;
using WeddingConfirmationApp.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
const string CorsAllPolicy = "All";

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure AutoMapper
builder.Services.AddAutoMapper(cfg => { }, typeof(PersonMappingProfile).Assembly);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<WeddingDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(
    Assembly.GetExecutingAssembly(),
    typeof(CreatePersonCommandHandler).Assembly));

// Register repositories
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddHostedService<DatabaseMigrator>();

var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string>()!;

builder.Services.AddCors(o => o.AddPolicy(CorsAllPolicy, corsBulder =>
{
    corsBulder
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .WithOrigins(allowedOrigins.Split(","));
}));

var app = builder.Build();

app.UseCors(CorsAllPolicy);

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
