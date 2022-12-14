import * as http from 'node:http';
import router from './routes.js';

const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT) || 8080;

const server = http.createServer((req, res) => {
  router.handleRequest(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`App listening on http://${HOST}:${PORT}`);
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

process.on('SIGINT', () => {
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
  });
});
