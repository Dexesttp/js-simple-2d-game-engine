const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = 5000;

function getMimeType(file_path) {
  switch (path.extname(file_path)) {
    case '.html':
      return 'text/html';
    case '.js':
    case '.mjs':
      return 'application/javascript';
    case '.json':
      return 'application/json';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    default:
      return 'text/plain';
  }
}

http
  .createServer((req, response) => {
    let file_path = path.normalize(path.join(__dirname, req.url));
    if (
      !file_path.startsWith(__dirname) ||
      file_path === __dirname ||
      file_path === __dirname + '/' ||
      file_path === __dirname + '\\'
    ) {
      response.writeHead(301, {
        Location: `/index.html`,
      });
      return response.end();
    }
    fs.readFile(file_path, (err, data) => {
      if (err) {
        response.writeHead(404);
        return response.end();
      }
      response.setHeader('Content-Type', getMimeType(file_path));
      response.writeHead(200);
      return response.end(data);
    });
    return;
  })
  .on('listening', function () {
    console.log(`Server started at http://localhost:${PORT}/`);
  })
  .listen(PORT, 'localhost');
