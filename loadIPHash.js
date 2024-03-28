const http = require('http');
const crypto = require('crypto');

// List of backend servers
const servers = [
    { host: 'localhost', port: 3000 },
    { host: 'localhost', port: 3001 },
    { host: 'localhost', port: 3002 },
    // Add more servers as needed
];

function calculateIPHash(ip) {
    const hash = crypto.createHash('sha1');
    hash.update(ip);
    const hashValue = hash.digest('hex');
    return parseInt(hashValue.substring(0, 8), 16); // Use first 8 bytes for simplicity
}

const server = http.createServer((req, res) => {
    // const clientIP = req.socket.remoteAddress;
    const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const hashValue = calculateIPHash(clientIP);
    const selectedServer = servers[hashValue % servers.length];
    const { host, port } = selectedServer;

    console.log(`Request received from client IP: ${clientIP}`);
    console.log(`Hash value: ${hashValue}`);
    console.log(`Selected server: ${selectedServer.host}:${selectedServer.port}`);
    console.log(`Proxying request to ${selectedServer.host}:${selectedServer.port} ${req.method} ${req.url}`);

    const options = {
        hostname: host,
        port: port,
        path: req.url,
        method: req.method,
        headers: req.headers
    };

    const proxyReq = http.request(options, proxyRes => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', err => {
        console.error('Proxy request error:', err);
        res.writeHead(500);
        res.end('Proxy request error');
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Load balancer running on port ${PORT}`);
});