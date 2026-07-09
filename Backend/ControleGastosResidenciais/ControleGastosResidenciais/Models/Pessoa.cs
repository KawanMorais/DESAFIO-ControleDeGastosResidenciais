using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ControleGastosResidenciais.Models
{

    
    // Esta classe representa a tabela de Pessoas no banco de dados.
    public class Pessoa
    {

        // Identificador único da pessoa, gerado automaticamente.
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "O nome da pessoa é obrigatório.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "A idade é obrigatória.")]
        public int Idade { get; set; }

        //Lista para armazenar as transações(receita e despesa) associadas a pessoa.
        [JsonIgnore]
        public virtual ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}

