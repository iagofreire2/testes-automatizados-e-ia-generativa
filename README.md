# 🧪 Testes Automatizados e IA Generativa | Portfólio de QA

[![Cypress](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express.js-404D59?logo=express)](https://expressjs.com/)

> Repositório dedicado ao estudo prático e demonstração de **Engenharia de Prompt aplicada à Garantia de Qualidade (QA)** e **Automação de Testes**, explorando como IAs Generativas (ChatGPT, GitHub Copilot, Claude) aceleram e elevam o nível de qualidade no ciclo de vida de desenvolvimento de software (SDLC).

Baseado no curso da [Escola Talking About Testing](https://talking-about-testing.vercel.app/), adaptado e expandido como portfólio prático de engenharia de qualidade.

---

## 🎯 Objetivo do Projeto

Demonstrar a aplicação de técnicas modernas de **Engenharia de Prompt** para:
- **Testes de API REST:** Criação e automação de testes completos com Cypress para endpoints RESTful, validando contratos, paginação, filtros e tratamento de erros.
- **Testes de Interface Gráfica (GUI / E2E):** Elaboração de cenários ponta a ponta usando prompts contextuais e multimodais (screenshots e código-fonte).
- **Testes de Componentes Frontend:** Testes isolados de componentes React com Cypress Component Testing (`mount()`).
- **Code Review Automatizado:** Revisão crítica de scripts de teste via IA com foco em manutenibilidade, legibilidade e boas práticas.
- **Análise de Lacunas (*Gap Analysis*):** Identificação de regras de negócio não cobertas confrontando documentações de requisitos contra suítes de testes existentes.

---

## 🧠 Habilidades & Técnicas de Engenharia de Prompt Demonstradas

- **Definição de Papel (*Role Prompting*):** Configuração do contexto para atuação da IA como Engenheiro(a) de Automação de Testes sênior.
- **Pre-prompting & Context Priming:** Estabelecimento de restrições arquiteturais, convenções de código (como ausência de ponto e vírgula, uso de template literals, desestruturação) e padrões antes da geração do código.
- **Padrão AAA (*Arrange, Act, Assert*):** Estruturação organizada e consistente de cada cenário de teste.
- **Prompts Multimodais:** Envio de capturas de tela e trechos visuais da aplicação para inferência de fluxos e seletores de teste.
- **Análise de Limites e Casos de Borda:** Automação de cenários de teste para valores inválidos, limites de paginação e parâmetros inesperados.
- **Detecção de Gaps de Cobertura:** Comparação cruzada entre documentação de produto (Markdown) e especificações de teste para identificar cenários ausentes.

---

## 📁 Estrutura do Repositório

```text
├── server/               # API REST construída em Express + Swagger
│   ├── cypress/          # Suíte de testes automatizados de API (Cypress)
│   │   └── e2e/
│   │       └── api-v1.cy.js
│   ├── db/               # Banco de dados em memória e dados estáticos
│   └── server.js         # Servidor Express e documentação Swagger
│
├── emoji-mart/           # Aplicação E-commerce React + Vite + TypeScript
│   ├── cypress/          # Testes E2E e testes de componentes
│   ├── docs/             # Especificação e regras de negócio da aplicação
│   └── src/              # Código fonte (componentes, context, etc.)
│
├── meal-suggestion/      # Aplicação web estática para exercícios de testes de GUI
│
└── lessons/              # Guias, lições e exercícios práticos de prompt engineering
```

---

## 🚀 Como Executar os Projetos e os Testes

### 📋 Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- npm ou yarn

---

### 1. Testes de API REST (`server/`)

A API expõe o endpoint `/customers` com suporte a paginação e filtros (`size`, `industry`), documentado via Swagger.

1. **Acesse o diretório do servidor e instale as dependências:**
   ```bash
   cd server
   npm install
   ```

2. **Inicie o servidor localmente:**
   ```bash
   npm start
   ```
   > A API estará rodando em `http://localhost:3001` e a documentação Swagger em `http://localhost:3001/api-docs/`.

3. **Executar a suíte de testes com Cypress:**
   - **Modo Interativo (Test Runner):**
     ```bash
     npm run cy:open
     ```
   - **Modo Headless (Terminal):**
     ```bash
     npx cypress run --spec cypress/e2e/api-v1.cy.js
     ```

---

### 2. Aplicação Frontend e Testes E2E / Componentes (`emoji-mart/`)

Aplicação interativa em React, Vite e TypeScript simulando uma loja virtual.

1. **Acesse o diretório e instale as dependências:**
   ```bash
   cd emoji-mart
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   > A aplicação estará acessível em `http://localhost:5173/`.

3. **Executar os testes no Cypress:**
   - **Modo Interativo:**
     ```bash
     npx cypress open
     ```
   - **Modo Headless:**
     ```bash
     npx cypress run
     ```

---

## 🛠️ Tecnologias e Ferramentas

- **Linguagens:** JavaScript (ES6+), TypeScript
- **Test Automation:** Cypress (E2E, API & Component Testing)
- **Backend & APIs:** Node.js, Express, Swagger / OpenAPI
- **Frontend:** React, Vite, Tailwind CSS
- **IA Generativa & Assistentes:** ChatGPT, Claude, GitHub Copilot, Cursor
- **Padrões de QA:** Padrão AAA (Arrange, Act, Assert), Boundary Value Analysis, Test Gap Analysis, Code Review

---

## 📚 Créditos e Referências

- Base do projeto desenvolvida a partir do curso **"Testes Automatizados e IA Generativa"** da [Escola Talking About Testing](https://talking-about-testing.vercel.app/), ministrado por [Walmyr Filho](https://www.linkedin.com/in/walmyr-lima-e-silva-filho).
- Projeto adaptado e mantido por **Iago Freire** para fins de demonstração prática e portfólio profissional de automação de testes.

---

<div align="center">
Desenvolvido com foco em qualidade de software, automação e inovação contínua. 🚀
</div>
