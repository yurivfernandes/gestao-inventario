# Sistema de Análise Tributária

## 📋 Sobre o Projeto

Sistema desenvolvido para auxiliar na análise e tomada de decisão sobre o regime tributário mais adequado para empresas. O sistema realiza simulações e comparações entre diferentes regimes tributários como Simples Nacional (com seus diversos anexos), Lucro Presumido e análise de Livro Caixa, considerando múltiplos fatores que impactam na carga tributária.

## 🎯 Funcionalidades Principais

- Análise comparativa entre regimes tributários
- Simulação de cenários com diferentes variáveis
- Cálculo de impostos por regime tributário
- Análise de enquadramento nos anexos do Simples Nacional
- Geração de relatórios comparativos
- Dashboard com visualização de dados
- Geração de laudos em PDF
- Gestão tributária e arquivos fiscais
- Análise de investimentos e despesas dedutíveis
- Simulação e prévia do Imposto de Renda
- Recomendações para otimização fiscal

## 🛠️ Tecnologias Utilizadas

### Frontend
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)](https://mui.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)
[![Axios](https://img.shields.io/badge/Axios-671DDF?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)

### Backend
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Django REST](https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray)](https://www.django-rest-framework.org/)
[![Token Auth](https://img.shields.io/badge/Token-Authentication-232F3E?style=for-the-badge)](https://www.django-rest-framework.org/api-guide/authentication/)

### Principais Bibliotecas Backend
- Django 4.2.10
- Django REST Framework 3.14.0
- Django CORS Headers 4.3.1
- Django Filter 23.5
- DRF yasg (Swagger) 1.21.7
- DRF Simple JWT 5.3.1
- Django REST Knox 4.2.0
- DRF Filters
- Polars 0.19.3
- Beautiful Soup 4.12.3
- Python dotenv 1.0.1
- Requests 2.31.0
- Faker 22.6.0 (Desenvolvimento)
- JWT Authentication
- Psycopg2 (PostgreSQL) 2.9.9

### Banco de Dados
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js versão 18 ou superior
- npm ou yarn

### Instalação e Execução

1. Clone o repositório
```bash
git clone https://github.com/yurivfernandes/analise-tributaria.git
cd analise-tributaria
```

2. Instale as dependências
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em `http://localhost:5173`

### Autenticação API
Para acessar endpoints protegidos, é necessário:

1. Obter token de autenticação via POST para `/api-token-auth/`:
```bash
curl -X POST http://localhost:8000/api-token-auth/ -d "username=seu_usuario&password=sua_senha"
```

2. Usar o token recebido no header das requisições:
```bash
curl -H "Authorization: Token seu_token_aqui" http://localhost:8000/api/endpoint/
```

## 📊 Status do Desenvolvimento

### Funcionalidades Implementadas
- [x] Setup inicial do projeto
- [x] Configuração do ambiente de desenvolvimento
- [x] Estrutura base do frontend
- [x] Conexão com banco de dados SQLite
- [x] Landing Page
- [x] Páginas de Login e Registro
- [x] Página Home do Sistema
- [x] API de Autenticação e Gestão de Usuários
- [x] API de Cadastro de Clientes
- [x] API de Cadastro de CNAEs
- [x] Task Automatizada de Atualização de CNAEs
- [x] Interface de Cadastro de Clientes
- [x] Interface de Cadastro de CNAEs
- [x] Tela de Premissas do Simples Nacional
- [x] Processo de Carga de Dados das Premissas do Simples Nacional
- [x] Tela de Premissas do Imposto de Renda
- [x] Tela de Premissas do ISS
- [x] Tela de Premissas de Demais Impostos
- [x] Processo de Carga de Dados - Premissas IR
- [x] Processo de Carga de Dados - Premissas ISS
- [x] Processo de Carga de Dados - Demais Impostos
- [x] Tela de Análise Tributária
- [x] Interface de Premissas

### Em Desenvolvimento
- [ ] API de Análise Tributária (Cálculos)
- [ ] Tela de Perfil do Usuário
- [ ] Interface de Simulação
- [ ] APIs de Simulação

### Próximos Passos
- [ ] Módulo de Geração de Laudos em PDF
- [ ] Sistema de Gestão de Arquivos Fiscais
- [ ] Módulo de Análise de Investimentos
- [ ] Calculadora de Despesas Dedutíveis
- [ ] Simulador de Imposto de Renda
- [ ] Gerador de Prévia do IR
- [ ] Sistema de Recomendações Fiscais
- [ ] Dashboard de Análise Financeira
- [ ] Relatórios de Economia Fiscal

### Módulos Planejados
- Módulo de Gestão Tributária
  - Gerenciamento de documentos fiscais
  - Cronograma de obrigações fiscais
  - Alertas e notificações

- Módulo de Planejamento Fiscal
  - Análise de investimentos
  - Gestão de despesas dedutíveis
  - Recomendações de otimização

- Módulo de Imposto de Renda
  - Simulação de declaração
  - Cálculo de restituição
  - Análise de deduções
  - Prévia do IR

## 🤝 Contribuindo

[Instruções para contribuição serão adicionadas]

## 📝 Licença

Este projeto está sob a licença MIT.

---
````
