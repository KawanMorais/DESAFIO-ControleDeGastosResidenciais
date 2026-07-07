using ControleGastosResidenciais.Data;
using ControleGastosResidenciais.Enums;
using ControleGastosResidenciais.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosResidenciais.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransacoesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoes()
        {
            // Retorna todas as transações e inclui os dados da pessoa associada
            return await _context.Transacoes.Include(t => t.Pessoa).ToListAsync();
        }


        [HttpGet("totais")]
        public async Task<ActionResult> GetTotais()
        {
            // Busca todas as pessoas e suas transações do banco de dados 
            var pessoas = await _context.Pessoas.Include(p => p.Transacoes).ToListAsync();

            // variaveis para somar as receitas e despesas
            decimal totalReceitas = 0;
            decimal totalDespesas = 0;

            // Lista para guardar os dados de cada pessoa
            var relatorioPessoas = new List<object>();


            // Varre cada pessoa para calcular suas receitas, despesas e saldos
            foreach (var p in pessoas)
            {
                decimal receitasDaPessoa = 0;
                decimal despesasDaPessoa = 0;

                // Varre as transações específicas desta pessoa
                foreach (var t in p.Transacoes)
                {
                    if (t.Tipo == TipoTransacao.Receita)
                    {
                        receitasDaPessoa += t.Valor;
                    }
                    else if (t.Tipo == TipoTransacao.Despesa)
                    {
                        despesasDaPessoa += t.Valor;
                    }
                }

                decimal saldoDaPessoa = receitasDaPessoa - despesasDaPessoa;

                // Pega a receita e despesa dessa pessoa e soma ao total geral
                totalReceitas += receitasDaPessoa;
                totalDespesas += despesasDaPessoa;

                // Guarda os dados processados desta pessoa em uma caixinha organizada
                relatorioPessoas.Add(new
                {
                    id = p.Id,
                    nome = p.Nome,
                    receitas = receitasDaPessoa,
                    despesas = despesasDaPessoa,
                    saldo = saldoDaPessoa
                });
            }

            decimal saldoGeralLiquido = totalReceitas - totalDespesas;

            return Ok(new
            {
                pessoas = relatorioPessoas,
                totalReceitas = totalReceitas,
                totalDespesas = totalDespesas,
                saldoGeralLiquido = saldoGeralLiquido
            });

        }



        [HttpPost]
        public async Task<ActionResult<Transacao>> PostTransacao(Transacao transacao)
        {
            // Valida se a pessoa informada realmente existe no banco de dados
            var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
            if (pessoa == null)
            {
                return NotFound(new { mensagem = "A pessoa informada não existe." });
            }

            if (pessoa.Idade < 18 && transacao.Tipo == TipoTransacao.Receita)
            {
                return BadRequest(new { mensagem = "Menores de 18 anos não podem cadastrar receitas, apenas despesas." });
            }

            
            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();

            return Ok(transacao);
        }

    }
}
