/*
 * SERVIDOR WEB "KEEP-ALIVE"
 * --------------------------
 * Este servidor Node.js cria uma página web simples para duas finalidades:
 * 1. Manter o projeto Replit ativo 24/7 ao ser monitorado por um serviço externo como o UptimeRobot.
 * 2. Iniciar o script principal da transmissão (stream.sh).
 */

const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// Rota principal que responde ao UptimeRobot e aos visitantes.
app.get('/', (req, res) => {
  const html_response = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live Stream Server</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #1e1e1e; color: #d4d4d4; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; text-align: center; }
            .container { padding: 2rem; background-color: #252526; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
            h1 { color: #4db8ff; }
            code { background-color: #333; padding: 0.2rem 0.4rem; border-radius: 4px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>✅ Live Stream Server Ativo</h1>
            <p>Este servidor está rodando e pronto para manter a transmissão 24/7.</p>
            <p>Monitore esta URL com um serviço como <code>UptimeRobot</code> para evitar que o Replit desligue.</p>
        </div>
    </body>
    </html>
  `;
  res.send(html_response);
});

// Inicia o servidor na porta 3000.
app.listen(port, () => {
  console.log(`✅ Servidor Keep-Alive iniciado em http://localhost:${port}`);
  console.log('🚀 Iniciando o script de transmissão FFmpeg...');

  // Executa o script de shell que contém o comando FFmpeg.
  const streamProcess = exec('bash stream.sh');

  // Exibe a saída do script FFmpeg no console do Replit para depuração.
  streamProcess.stdout.on('data', (data) => {
    console.log(`[FFMPEG-STDOUT]: ${data}`);
  });

  streamProcess.stderr.on('data', (data) => {
    console.error(`[FFMPEG-STDERR]: ${data}`);
  });

  streamProcess.on('close', (code) => {
    console.log(`🔴 Processo FFmpeg encerrado com código ${code}.`);
  });
});