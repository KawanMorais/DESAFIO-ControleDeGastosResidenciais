using System;
using ControleGastosResidenciais.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastosResidenciais.Models;

namespace ControleGastosResidenciais.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Injeção de dependência do contexto do banco de dados
        public PessoasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pessoa>>> GetPessoas()
        {

            // Pega tudo da tabela pessoas transforma numa lista e retorna sem travar a aplicação
            return await _context.Pessoas.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Pessoa>> PostPessoa(Pessoa pessoa)
        {
            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();

            return Ok(pessoa);
        }

        [HttpDelete("{id}")]

        public async Task<IActionResult> DeletePessoa(Guid id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa == null)
            {
                return NotFound(new { mensagem = "Pessoa não encontrada." });
            }

            // no AppDbContext é garantido que ao deletar uma pessoa tudo relacionado a ela vai ser deletado.
            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
