import { useState, useEffect } from 'react';
import api from '../services/api';

interface RelatorioPessoa {
  id: string;
  nome: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

interface ResumoTotais {
  pessoas: RelatorioPessoa[];
  totalReceitas: number;
  totalDespesas: number;
  saldoGeralLiquido: number;
}

export default function TabelaTotais() {
  const [dados, setDados] = useState<ResumoTotais | null>(null);

  const buscarTotais = async () => {
    try {
      const response = await api.get('/transacoes/totais');
      setDados(response.data);
    } catch (error) {
      console.error('Erro ao buscar totais do relatório:', error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    buscarTotais();

    window.addEventListener('atualizarTotais', buscarTotais);
    return () => {
      window.removeEventListener('atualizarTotais', buscarTotais);
    };
  }, []);

  // Se os dados ainda não chegaram da API, exibe um aviso em vez de travar a tela
  if (!dados || !dados.pessoas) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px', marginTop: '20px' }}>
        <p style={{ fontWeight: 'bold', color: '#666' }}>A carregar dados do relatório de totais...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginTop: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px', marginTop: 0 }}>📊 Consulta de Totais por Pessoa</h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left' }}>
            <th style={{ padding: '12px 8px' }}>Nome</th>
            <th style={{ padding: '12px 8px' }}>Total Receitas</th>
            <th style={{ padding: '12px 8px' }}>Total Despesas</th>
            <th style={{ padding: '12px 8px' }}>Saldo Individual</th>
          </tr>
        </thead>
        <tbody>
          {dados.pessoas.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: '10px 8px', borderBottom: '1px solid #ddd', fontWeight: '500' }}>{p.nome}</td>
              <td style={{ padding: '10px 8px', borderBottom: '1px solid #ddd', color: '#28a745' }}>R$ {p.receitas?.toFixed(2) || "0.00"}</td>
              <td style={{ padding: '10px 8px', borderBottom: '1px solid #ddd', color: '#dc3545' }}>R$ {p.despesas?.toFixed(2) || "0.00"}</td>
              <td style={{ 
                padding: '10px 8px', 
                borderBottom: '1px solid #ddd', 
                fontWeight: 'bold',
                color: (p.saldo || 0) >= 0 ? '#28a745' : '#dc3545'
              }}>
                R$ {p.saldo?.toFixed(2) || "0.00"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bloco de Totais Gerais */}
      <div style={{ 
        backgroundColor: '#e9ecef', 
        padding: '15px', 
        borderRadius: '6px', 
        display: 'flex', 
        justifyContent: 'space-around', 
        flexWrap: 'wrap',
        gap: '10px',
        fontWeight: 'bold',
        fontSize: '15px'
      }}>
        <div>Total Geral Receitas: <span style={{ color: '#28a745' }}>R$ {dados.totalReceitas?.toFixed(2) || "0.00"}</span></div>
        <div>Total Geral Despesas: <span style={{ color: '#dc3545' }}>R$ {dados.totalDespesas?.toFixed(2) || "0.00"}</span></div>
        <div style={{ borderLeft: '1px solid #ccc', paddingLeft: '20px' }}>
          Saldo Líquido Geral: <span style={{ color: (dados.saldoGeralLiquido || 0) >= 0 ? '#28a745' : '#dc3545' }}>R$ {dados.saldoGeralLiquido?.toFixed(2) || "0.00"}</span>
        </div>
      </div>
    </div>
  );
}