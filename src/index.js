import http from 'http';

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Lab #1');
});

server.listen(PORT, HOST, () => {
  console.log(`App listening on http://${HOST}:${PORT}`);
});
