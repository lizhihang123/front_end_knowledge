const http = require('http')
const server = http.createServer()

server.on('request', (req, res) => {
  if (req.url === '/') {
    // 表示文本text/plain
    // res.setHeader('content-type', 'text/plain')

    // text/html
    res.setHeader('content-type', 'text/html; charset=utf8')
    res.setHeader('content-length', 10)
    res.setHeader('Transfer-Encoding', 'chunked')
    res.write('<p>第一次传输</p><br />')
    setTimeout(() => {
      res.write('<p>第2次传输</p><br />')
    }, 1000)
    setTimeout(() => {
      res.write('<p>第3次传输</p><br />')
      // res.end()
    }, 3000)
  }
})

server.listen(8080, function () {
  console.log('this server is running at http://localhost:8080')
})
