import Pessoas from './components/Pessoas';
import Transacoes from './components/Transacoes';
import TabelaTotais from './components/TabelaTotais';

function App() {
  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto'}}>
      <h1>Controle de Gastos Residenciais</h1>
      <hr style={{ marginBottom: '20px' }} />
      
      <Pessoas/>
      
      <Transacoes />

      <TabelaTotais />
    </div>
  )
}

export default App