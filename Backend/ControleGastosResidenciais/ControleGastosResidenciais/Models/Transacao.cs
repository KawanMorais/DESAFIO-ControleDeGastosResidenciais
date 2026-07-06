using ControleGastosResidenciais.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;



namespace ControleGastosResidenciais.Models
{
    public class Transacao
    {

        // Chave primária gerada automaticamente
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "A descrição da transação é obrigatória.")]
        [StringLength(250, ErrorMessage = "A descrição não pode passar de 250 caracteres.")]
        public string Descricao { get; set; } = string.Empty;

        [Required(ErrorMessage = "O valor é obrigatório.")]
        [Column(TypeName = "decimal(18,2)")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor da transação deve ser maior que zero.")]
        public decimal Valor { get; set; }

        [Required(ErrorMessage = "O tipo de transação (Receita ou Despesa) é obrigatório.")]
        public TipoTransacao Tipo { get; set; }



        // Chave estrangeira para a tabela Pessoa(vai armazenar o id da pessoa)
        [Required(ErrorMessage = "O identificador da pessoa é obrigatório.")]
        public Guid PessoaId { get; set; }

        // Vai armazenar a pessoa associada a transação, permitindo o acesso aos detalhes da pessoa relacionada.
        [ForeignKey("PessoaId")]
        public virtual Pessoa? Pessoa { get; set; }

    }
}
