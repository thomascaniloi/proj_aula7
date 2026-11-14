# Controle Financeiro Pessoal

Projeto desenvolvido para a disciplina de Web Mobile utilizando NestJS, MongoDB Atlas, HTML, CSS e JavaScript.

A aplicação permite cadastrar receitas e despesas, consultar o histórico de transações e visualizar métricas financeiras calculadas pelo back-end.

## Tecnologias utilizadas

- NestJS
- MongoDB Atlas
- Mongoose
- HTML
- CSS
- JavaScript

## Estrutura do projeto

O back-end é responsável pelo cadastro das transações e pelo processamento das métricas financeiras.

O front-end está localizado em:

src/public/

Essa pasta contém:

index.html
nova-transacao.html
style.css
script.js

O NestJS disponibiliza esses arquivos estáticos juntamente com a API.

## Configuração do MongoDB

Antes de executar o projeto, crie um arquivo chamado .env na raiz do projeto.

Utilize a seguinte estrutura:

MONGODB_URI=mongodb+srv://<db_user>:<db_password>@<cluster>/controle_financeiro
PORT=3000

Substitua os valores <db_user>, <db_password> e <cluster> pelos dados de uma conexão válida do MongoDB Atlas.

O arquivo .env não deve ser publicado em repositórios públicos.

## Instalação

No terminal, dentro da pasta do projeto, execute:

npm install

## Execução

Para iniciar a aplicação:

npm run start

Após a inicialização, acesse:

http://localhost:3000

O endereço abrirá a interface principal do Controle Financeiro.

## Funcionalidades

### Nova transação

A tela de cadastro permite informar:

- Descrição
- Valor
- Tipo: Receita ou Despesa
- Categoria
- Se o gasto foi consciente ou por impulso

Ao salvar, o front-end envia os dados para a API utilizando:

POST /transacoes

### Dashboard financeiro

A tela principal consulta:

GET /transacoes

A resposta da API contém o histórico das transações e as métricas calculadas pelo back-end.

O dashboard exibe:

- Saldo Total
- Total de Despesas
- Total Gasto por Impulso
- Histórico dos lançamentos

Os cálculos financeiros são realizados pelo back-end. O JavaScript do front-end apenas utiliza os valores retornados pela API.

## Endpoints

POST /transacoes
GET /transacoes

### Exemplo de cadastro

{
  "descricao": "Conta de Luz",
  "valor": 180,
  "tipo": "despesa",
  "categoria": "Moradia",
  "consumoConsciente": true
}

### Exemplo de resposta da consulta

{
  "historico": [],
  "metricas": {
    "saldoTotal": 0,
    "totalDespesas": 0,
    "totalGastoImpulso": 0
  }
}

## Testes

Após iniciar a aplicação, verifique:

1. Se a página inicial abre normalmente em http://localhost:3000.
2. Se uma nova receita ou despesa pode ser cadastrada.
3. Se o histórico é atualizado com as transações cadastradas.
4. Se as métricas são exibidas corretamente no dashboard.
5. Se o layout permanece organizado em telas menores, seguindo a proposta Mobile First.
