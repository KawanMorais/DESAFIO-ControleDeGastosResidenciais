using ControleGastosResidenciais.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// === 1. CONFIGURAÇÃO DOS SERVIÇOS (Tudo antes do builder.Build) ===

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// CONFIGURAÇÃO DO SQLITE (Movido para o lugar correto)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// Configuração do CORS para o React conseguir acessar o Back-end depois
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


var app = builder.Build();

// === 2. CONFIGURAÇÃO DO PIPELINE DE REQUISIÇÕES (Depois do builder.Build) ===

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Ativa o CORS para o front-end
app.UseCors("ReactApp");

app.UseAuthorization();
app.MapControllers();

// Executa as migrações automaticamente ao iniciar
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.Migrate();
}

app.Run();