const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello from server running on port '+ PORT +' \n');
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// for (let i = 0; i < 10; i++) {
//     server.listen(PORT + i, () => {
//         console.log(`Server running on port ${PORT + i}`);
//     });
// }