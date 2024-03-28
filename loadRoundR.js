const http = require('http');
const crypto = require('crypto');

const servers = [
    { host: 'localhost', port: 3000 },
    { host: 'localhost', port: 3001 },
];

let nextServerIndex = 0;

const server = http.createServer((req, res) => {
    const selectedServer = servers[nextServerIndex];
    nextServerIndex = (nextServerIndex + 1) % servers.length;

    const { host, port } = selectedServer;
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
