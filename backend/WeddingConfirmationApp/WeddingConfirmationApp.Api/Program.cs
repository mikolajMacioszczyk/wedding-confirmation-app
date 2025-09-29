using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;
using WeddingConfirmationApp.Api;
using WeddingConfirmationApp.Application.Config;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Scopes.Invitations.Mappings;
using WeddingConfirmationApp.Application.Scopes.Persons.Commands.CreatePerson;
using WeddingConfirmationApp.Application.Scopes.Persons.Mappings;
using WeddingConfirmationApp.Application.Scopes.Users.Contracts;
using WeddingConfirmationApp.Application.Scopes.Users.Services;
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

// Register services
builder.Services.Configure<JwtConfiguration>(
    builder.Configuration.GetSection("Jwt")
);
builder.Services.AddScoped<IAuthService, AuthService>();

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new ArgumentNullException("Jwt:Key");
var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "WeddingConfirmationApp",
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "WeddingConfirmationApp",
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
