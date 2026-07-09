import { useState, useEffect } from 'react';
import api from '../services/api';

// Define a estrutura de uma Pessoa para o TypeScript
interface Pessoa {
  id?: string;
  nome: string;
  idade: number;
}

export default function Pessoas() {
  // Guarda a lista de pessoas que vem do backend
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  
  // Estados do formulário (o que o usuário digita)
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');

  // Função para buscar as pessoas do backend (GET)
  const buscarPessoas = async () => {
    try {
      const response = await api.get('/pessoas');
      setPessoas(response.data); // Guarda a lista vinda do C# na variável pessoas
    } catch (error) {
      console.error('Erro ao buscar pessoas:', error);
    }
  };

  // Roda automaticamente assim que a tela abre
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    buscarPessoas();
  }, []);

  // Função para enviar os dados para o backend (POST)
  const cadastrarPessoa = async (e: React.SyntheticEvent) => {
    e.preventDefault(); // Impede a página de atualizar sozinha ao enviar
    if (!nome || !idade) return alert("Preencha todos os campos!");

    try {
      // Envia os dados para o backend
      await api.post('/pessoas', { 
        nome: nome, 
        idade: Number(idade) 
      }); 

      // Limpa os campos da tela depois de salvar
      setNome('');
      setIdade('');
      
      // Recarrega a lista para mostrar a pessoa nova na tabela
      buscarPessoas(); 

      //Dispara o evento para a Tabela de Totais se atualizar também
      window.dispatchEvent(new Event('atualizarTotais'));

    } catch (error) {
      console.error("Erro ao cadastrar pessoa:", error);
    }
  };


  const deletarPessoa = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm("Tem certeza que deseja deletar esta pessoa? Todas as suas transações vinculadas serão apagadas.")) {
      try {
        await api.delete(`/pessoas/${id}`);
    
        buscarPessoas();

        // Dispara o evento para a Tabela de Totais se atualizar também
        window.dispatchEvent(new Event('atualizarTotais')); 

        // Dispara um evento para avisar o componente de Transações se atualizar (caso necessário)
        window.dispatchEvent(new Event('atualizarTransacoes'));
        

      } catch (error) {
        console.error("Erro ao deletar pessoa:", error);
        alert("Erro ao tentar deletar a pessoa.");
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      <h2> Cadastro e Listagem de Pessoas</h2>

      {/* Formulário de Cadastro */}
      <form onSubmit={cadastrarPessoa} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Nome da pessoa" 
          value={nome} 
          // altera o estado do nome toda vez que o usuário digitar algo
          onChange={(e) => setNome(e.target.value)}
          style={{ padding: '8px', flex: 1 }}
        />
        <input 
          type="number" 
          placeholder="Idade" 
          value={idade} 
          onChange={(e) => setIdade(e.target.value)}
          style={{ padding: '8px', width: '80px' }}
        />
        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Cadastrar
        </button>
      </form>

      {/* Tabela que exibe os dados */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>ID</th>
            <th style={{ padding: '8px' }}>Nome</th>
            <th style={{ padding: '8px' }}>Idade</th>
            <th style={{ padding: '8px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* Loop que desenha uma linha <tr> para cada pessoa da lista */}
          {pessoas.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{p.id}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{p.nome}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{p.idade} anos</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                <button onClick={() => deletarPessoa(p.id)} style={{ padding: '4px 10px', backgroundColor: '#dc3545',color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}} >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}