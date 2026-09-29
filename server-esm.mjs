import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoCeps = path.join(__dirname, 'data', 'ceps.json');

// Funções utilitárias para o JSON
const lerBancoCeps = async () => {
  const conteudo = await fs.readFile(caminhoCeps, 'utf-8');
  return JSON.parse(conteudo);
};

const salvarBanco = async (dados) =>
  await fs.writeFile(caminhoCeps, JSON.stringify(dados, null, 2));

// Processa o body da requisição (stream de dados em chunks)
const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });

const responder = (res, status, objeto) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(objeto));
};

const server = http.createServer(async (req, res) => {
  const { url, method } = req;
  console.log(`[LOG ESM] Requisição: ${method} -> ${url}`);

  // CORS básico para testes com Thunder Client / Postman
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // GET /ceps - listar todos
  if (url === '/ceps' && method === 'GET') {
    try {
      const ceps = await lerBancoCeps();
      responder(res, 200, ceps);
    } catch (error) {
      responder(res, 500, { erro: `Erro ao ler banco de dados: ${error.message}` });
    }
  }

  // GET /cep?busca=69005-000 - buscar um CEP
  else if (url.startsWith('/cep?') && method === 'GET') {
    try {
      const urlObj = new URL(url, `http://localhost:${PORT}`);
      const buscaCep = urlObj.searchParams.get('busca');
      const ceps = await lerBancoCeps();
      const encontrado = ceps.find(({ cep }) => cep === buscaCep);

      if (encontrado) {
        responder(res, 200, encontrado);
      } else {
        responder(res, 404, { mensagem: `CEP ${buscaCep} não localizado.` });
      }
    } catch (error) {
      responder(res, 500, { erro: `Erro ao ler banco de dados: ${error.message}` });
    }
  }

  // POST /ceps - inserir novo CEP
  else if (url === '/ceps' && method === 'POST') {
    try {
      const novoRegistro = await parseBody(req);
      const { cep, logradouro, bairro, localidade, uf } = novoRegistro;

      if (!cep || !logradouro) {
        return responder(res, 400, { erro: 'CEP e Logradouro são obrigatórios!' });
      }

      const ceps = await lerBancoCeps();

      if (ceps.some((c) => c.cep === cep)) {
        return responder(res, 409, { erro: 'CEP já cadastrado!' });
      }

      ceps.push({ cep, logradouro, bairro, localidade, uf });
      await salvarBanco(ceps);

      responder(res, 201, { mensagem: 'CEP cadastrado com sucesso!', dados: novoRegistro });
    } catch (error) {
      responder(res, 400, { erro: 'JSON inválido enviado no body.' });
    }
  }

  // PUT /ceps - atualizar CEP existente
  else if (url === '/ceps' && method === 'PUT') {
    try {
      const dadosAtualizados = await parseBody(req);
      const { cep, logradouro, bairro, localidade, uf } = dadosAtualizados;

      if (!cep) {
        return responder(res, 400, { erro: 'O campo cep é obrigatório para atualização.' });
      }

      const ceps = await lerBancoCeps();
      const indice = ceps.findIndex((item) => item.cep === cep);

      if (indice === -1) {
        return responder(res, 404, { erro: 'CEP não encontrado para atualização.' });
      }

      ceps[indice] = {
        ...ceps[indice],
        logradouro: logradouro || ceps[indice].logradouro,
        bairro: bairro || ceps[indice].bairro,
        localidade: localidade || ceps[indice].localidade,
        uf: uf || ceps[indice].uf,
      };

      await salvarBanco(ceps);

      responder(res, 200, { mensagem: 'CEP atualizado com sucesso!', dados: ceps[indice] });
    } catch (error) {
      responder(res, 400, { erro: 'Erro no processamento da atualização.' });
    }
  }

  else {
    responder(res, 404, { mensagem: 'Rota não encontrada' });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor ES6+ rodando em: http://localhost:${PORT}`);
});
