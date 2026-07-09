import { useState, useEffect } from 'react';
import api from '../services/api';

// Interfaces atualizadas para bater com o retorno do C#
interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

interface Transacao {
  id?: string;
  descricao: string;
  valor: number;
  tipo: number; // 0 = Receita, 1 = Despesa 
  pessoaId: string; 
  pessoa?: Pessoa; // O .Include(t => t.Pessoa) do C# traz este objeto preenchido
}

export default function Transacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<number>(1); 
  const [pessoaSelecionadaId, setPessoaSelecionadaId] = useState('');

  // Busca transações e pessoas do backend
  const carregarDados = async () => {
    try {
      const resPessoas = await api.get('/pessoas');
      setPessoas(resPessoas.data);
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
    }

    try {
      const resTransacoes = await api.get('/transacoes'); 
      setTransacoes(resTransacoes.data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  };

  useEffect(() => {

    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarDados();

    // Adiciona um listener para o evento customizado "atualizarTransacoes"
    window.addEventListener('atualizarTransacoes', carregarDados);
    
    // Remove o listener quando o componente for desmontado
    return () => {
    window.removeEventListener('atualizarTransacoes', carregarDados);
  };

  }, []);

  const manipularMudancaPessoa = (idSelecionado: string) => {
    setPessoaSelecionadaId(idSelecionado);
    const pessoa = pessoas.find(p => p.id === idSelecionado);
    
    // Se for menor de idade, força o tipo a ser Despesa (1)
    if (pessoa && pessoa.idade < 18) {
      setTipo(1);
    }
  };

  const cadastrarTransacao = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!descricao || !valor || !pessoaSelecionadaId) {
      return alert('Preencha todos os campos!');
    }

    try {
      // Enviando o payload com as chaves correspondentes às propriedades do C#
      await api.post('/transacoes', {
        descricao: descricao,
        valor: Number(valor),
        tipo: tipo,
        pessoaId: pessoaSelecionadaId 
      });

      // Limpa os campos após salvar com sucesso
      setDescricao('');
      setValor('');
      setTipo(1); 
      setPessoaSelecionadaId('');
      
      // Recarrega a listagem de transações
      carregarDados();
      
      // Evento customizado opcional para avisar o componente de Totais que os dados mudaram
      window.dispatchEvent(new Event('atualizarTotais'));
    } catch (error: unknown) {
      console.error('Erro ao cadastrar transação:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Erro ao cadastrar transação. Verifique os dados.');
      }
    }
  };

  const pessoaSelecionada = pessoas.find(p => p.id === pessoaSelecionadaId);
  const menorDeIdade = pessoaSelecionada ? pessoaSelecionada.idade < 18 : false;

  return (
    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      <h2> Cadastro e Listagem de Transações</h2>

      {/* Formulário de Cadastro */}
      <form onSubmit={cadastrarTransacao} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          
          <input
            type="text"
            placeholder="Descrição (ex: Mercado, Salário)"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={{ padding: '8px', flex: 2 }}
          />

          <input
            type="number"
            step="0.01"
            placeholder="Valor (R$)"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            style={{ padding: '8px', flex: 1 }}
          />

          <select
            value={pessoaSelecionadaId}
            onChange={(e) => manipularMudancaPessoa(e.target.value)}
            style={{ padding: '8px', flex: 1 }}
          >
            <option value="">Selecione uma pessoa</option>
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.idade} anos)
              </option>
            ))}
          </select>

          <select
            value={tipo}
            onChange={(e) => setTipo(Number(e.target.value))}
            style={{ padding: '8px', flex: 1 }}
          >
            <option value={1}>Despesa</option>
            {!menorDeIdade && <option value={0}>Receita</option>}
          </select>
        </div>

        {menorDeIdade && (
          <span style={{ color: '#dc3545', fontSize: '12px', fontWeight: 'bold' }}>
            * Menores de 18 anos só podem cadastrar despesas.
          </span>
        )}

        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Cadastrar Transação
        </button>
      </form>

      {/* Tabela de Listagem */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>Descrição</th>
            <th style={{ padding: '8px' }}>Pessoa</th>
            <th style={{ padding: '8px' }}>Tipo</th>
            <th style={{ padding: '8px' }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map((t) => (
            <tr key={t.id}>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{t.descricao}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {t.pessoa ? t.pessoa.nome : 'Desconhecido'}
              </td>
              <td style={{ 
                padding: '8px', 
                borderBottom: '1px solid #ddd', 
                color: t.tipo === 0 ? '#28a745' : '#dc3545', 
                fontWeight: 'bold'
              }}>
                {t.tipo === 0 ? 'Receita' : 'Despesa'}
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                R$ {t.valor.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}