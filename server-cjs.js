const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer(function (req, res) {
  const url = req.url;
  const method = req.method;

  console.log(`[LOG CJS] Requisição recebida: ${method} ${url}`);

  if (url === '/texto' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Olá! Este é um retorno em Texto Puro.');
  }

  else if (url === '/html' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>API de CEP</h1><p>Servidor rodando com sucesso!</p>');
  }

  else if (url === '/style.css' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.end('body { background-color: #f0f2f5; font-family: sans-serif; }');
  }

  else if (url === '/script.js' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end('console.log("Script estático carregado com sucesso!");');
  }

  else if (url === '/ceps' && method === 'GET') {
    const caminhoJson = path.join(__dirname, 'data', 'ceps.json');
    fs.readFile(caminhoJson, 'utf-8', function (err, data) {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ erro: 'Erro ao ler o banco de dados.' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(data);
    });
  }

  else if (url === '/xml' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
    const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<resposta>
  <status>Sucesso</status>
  <mensagem>Dados formatados em XML</mensagem>
</resposta>`;
    res.end(xmlResponse);
  }

  else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 - Rota Não Encontrada</h1>');
  }
});

server.listen(PORT, function () {
  console.log(`Servidor CommonJS rodando em: http://localhost:${PORT}`);
});
