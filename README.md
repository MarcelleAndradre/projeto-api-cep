# API de CEP com Node.js

Projeto da **Aula Prática WebServer**: um servidor web feito apenas com o módulo nativo `http` do Node.js (sem Express), com uma API de consulta, cadastro e atualização de CEPs. Os dados ficam em um arquivo JSON que simula um banco de dados.

## Tecnologias

- Node.js (módulo `http` nativo)
- CommonJS (`require`) e ES Modules (`import`)
- JavaScript moderno: arrow functions, template literals, destructuring e `fs/promises`

## Estrutura do projeto

```
projeto-api-cep/
├── server-cjs.js      # Servidor em CommonJS (rotas de texto, HTML, CSS, JS, XML e JSON)
├── server-esm.mjs     # Servidor em ESM (API de CEP: GET, POST e PUT)
├── data/
│   └── ceps.json      # Banco de dados simulado
└── README.md
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior

## Como executar

Clone o repositório e entre na pasta:

```bash
git clone https://github.com/SEU-USUARIO/projeto-api-cep.git
cd projeto-api-cep
```

Servidor em CommonJS:

```bash
node server-cjs.js
```

Servidor em ESM (API de CEP completa):

```bash
node server-esm.mjs
```

Os dois usam a porta **3000**, então execute um de cada vez.

## Rotas

### `server-cjs.js`

| Método | Rota          | Retorno                     |
|--------|---------------|-----------------------------|
| GET    | `/texto`      | Texto puro                  |
| GET    | `/html`       | Página HTML                 |
| GET    | `/style.css`  | Arquivo CSS                 |
| GET    | `/script.js`  | Arquivo JavaScript          |
| GET    | `/ceps`       | Lista de CEPs em JSON       |
| GET    | `/xml`        | Resposta em XML             |

### `server-esm.mjs`

| Método | Rota                    | Descrição                              | Status                  |
|--------|-------------------------|----------------------------------------|-------------------------|
| GET    | `/ceps`                 | Lista todos os CEPs                    | 200, 500                |
| GET    | `/cep?busca=69005-000`  | Busca um CEP específico                | 200, 404                |
| POST   | `/ceps`                 | Cadastra um novo CEP                   | 201, 400, 409           |
| PUT    | `/ceps`                 | Atualiza um CEP existente              | 200, 400, 404           |

## Exemplos de teste

Use o Thunder Client, o Postman ou o `curl`.

### Buscar um CEP

```bash
curl "http://localhost:3000/cep?busca=01001-000"
```

### Cadastrar um CEP (POST)

Headers: `Content-Type: application/json`

```json
{
  "cep": "20040-002",
  "logradouro": "Avenida Rio Branco",
  "bairro": "Centro",
  "localidade": "Rio de Janeiro",
  "uf": "RJ"
}
```

Regras:
- `cep` e `logradouro` são obrigatórios (senão retorna `400`).
- Um CEP já cadastrado retorna `409`.

### Atualizar um CEP (PUT)

Headers: `Content-Type: application/json`

```json
{
  "cep": "01001-000",
  "logradouro": "Praça da Sé - Lado Ímpar",
  "bairro": "Sé (Centro Histórico)"
}
```

Regras:
- O campo `cep` identifica o registro e é obrigatório.
- Campos não enviados mantêm o valor anterior.
- Um CEP inexistente retorna `404`.

## Formato dos dados

```json
{
  "cep": "01001-000",
  "logradouro": "Praça da Sé",
  "bairro": "Sé",
  "localidade": "São Paulo",
  "uf": "SP"
}
```

## Referência

Exemplo de API pública de CEP: <https://cep.awesomeapi.com.br/json/>

## Autora

Marcelle Andrade