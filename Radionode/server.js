const http = require('http');
const app= require('./app');

const port=8000;

const server=http.createServer(app);
console.log('Server running on 127.0.0.1');
server.listen(port, '127.0.0.1');
