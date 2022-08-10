const http = require('http')
const server = http.createServer()

server.on('request', (req, res) => {
  if (req.url === '/') {
    res.setHeader('content-type', 'text/plain')
    res.setHeader('content-length', 10)
    res.write('helloworld')
  }
})

server.listen(8080, function () {
  console.log('this server is running at http://localhost:8080')
})
