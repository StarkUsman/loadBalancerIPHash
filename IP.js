// const http = require('http');

// const server = http.createServer((req, res) => {
//     const clientIP = req.socket.remoteAddress;
//     console.log(`Client IP address: ${clientIP}`);
// });

// server.listen(8080);

const http = require('http');

const server = http.createServer((req, res) => {
    // const clientIP = req.socket.remoteAddress;
    const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('IP:' + clientIP + ' Hello from server!\n');
    console.log(`Client IP address: ${clientIP}`);
});

// server.listen(8080, '127.0.0.1'); // Bind explicitly to IPv4 loopback address
server.listen(8080); // Bind explicitly to IPv4 loopback address
