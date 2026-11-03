import { readFileSync, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deliverForm } from './form-mail.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const envFile = join(root, 'form.env');

if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

const indexHtml = existsSync(join(root, 'index.html'))
  ? readFileSync(join(root, 'index.html'))
  : null;

function send(res, status, body, type = 'application/json; charset=utf-8') {
  const payload = typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(payload);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');

  if (url.pathname === '/api/forms') {
    if (req.method !== 'POST') {
      send(res, 405, { error: 'Use POST.' });
      return;
    }
    try {
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 20_000) {
          send(res, 413, { error: 'That note is too long.' });
          return;
        }
        chunks.push(chunk);
      }
      const input = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
      const result = await deliverForm(input);
      send(res, 200, result);
    } catch (error) {
      const status = error.statusCode || 500;
      send(res, status, { error: status === 400 ? error.message : 'The note could not be sent. Email ZachWaltmanFoundation@gmail.com instead.' });
    }
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 404, { error: 'Not found.' });
    return;
  }

  if (!indexHtml) {
    send(res, 404, { error: 'Not found.' });
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(req.method === 'HEAD' ? undefined : indexHtml);
});

server.listen(3000);
