# Controle de Gastos Residenciais

Este projeto foi desenvolvido como parte de um desafio técnico. Trata-se de um sistema residencial para gerenciamento de finanças composto por uma API desenvolvida em .NET Core (C#) e uma interface SPA desenvolvida em React com TypeScript (Vite).

## Estrutura do Repositório

O repositório está organizado em duas partes principais:
- **Backend:** API REST desenvolvida em .NET Core responsável pelas regras de negócio e persistência de dados.
- **Frontend:** Aplicação em React que gerencia a interface do usuário e consome os dados da API.

---

## Pré-requisitos

Para rodar o projeto localmente, certifique-se de ter instalado em sua máquina:
- .NET SDK (Versão 8.0 ou superior)
- Node.js (Versão 18 ou superior)

---

## Como Rodar o Projeto

Siga as instruções abaixo para inicializar tanto o servidor do backend quanto o servidor de desenvolvimento do frontend.

### 1. Inicializando o Backend (API)

O banco de dados utilizado é o SQLite (em arquivo local). As migrações correspondentes serão gerenciadas e aplicadas automaticamente na inicialização da aplicação.

1. Abra o terminal na pasta raiz do projeto.
2. Navegue até o diretório do backend:
   ```bash
   cd Backend
Execute o comando para restaurar as dependências e rodar a aplicação:

Bash
dotnet run
A API ficará disponível por padrão em: http://localhost:5136

2. Inicializando o Frontend (Interface)
Abra um novo terminal na pasta raiz do projeto (mantendo o terminal do backend rodando).

Navegue até o diretório do frontend:

Bash
cd Frontend
Instale os pacotes de dependências do Node.js:

Bash
npm install
Inicie o servidor de desenvolvimento do Vite:

Bash
npm run dev
Abra o endereço indicado no terminal (geralmente http://localhost:5173) no seu navegador web para testar a aplicação.

Regras de Negócio Implementadas
Gerenciamento de Moradores: Cadastro, listagem e exclusão de pessoas da residência.

Controle de Lançamentos: Cadastro de transações financeiras vinculadas a um morador específico, categorizadas entre Receita e Despesa.

Validação de Maioridade: Restrição em tempo real que impede menores de 18 anos de registrarem transações do tipo Receita.

Painel Consolidado: Tabela informativa exibindo o total de receitas, despesas e saldo individual por pessoa, acompanhado do saldo líquido acumulado geral da residência.

Tecnologias Utilizadas
Backend: C# / .NET Core ASP.NET Web API, Entity Framework Core, SQLite.

Frontend: React, TypeScript, Vite, Axios.
