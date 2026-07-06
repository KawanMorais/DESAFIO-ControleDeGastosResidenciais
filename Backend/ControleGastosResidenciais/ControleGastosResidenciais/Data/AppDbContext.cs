using Microsoft.EntityFrameworkCore;
using ControleGastosResidenciais.Models;
using System.Reflection.Emit;

namespace ControleGastosResidenciais.Data
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Mapeia a classe Pessoa para virar uma tabela chamada Pessoas no Banco de Dados
        public DbSet<Pessoa> Pessoas { get; set; }

        public DbSet<Transacao> Transacoes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            base.OnModelCreating(modelBuilder);

            // Explica para o EF como as tabelas se relacionam
            modelBuilder.Entity<Pessoa>()
                .HasMany(p => p.Transacoes)       
                .WithOne(t => t.Pessoa)          
                .HasForeignKey(t => t.PessoaId)   
                .OnDelete(DeleteBehavior.Cascade); 
        }

    }
}
