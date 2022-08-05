var express = require('express')
var app = express();
// app.all('*', function (req, res) {
//     //设置可以接收请求的域名
//     res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
//     res.header('Access-Control-Allow-Methods', 'GET, POST,PUT');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     res.header('Content-Type', 'application/json;charset=utf-8');
//     req.next();
// })
app.get('/getUserNameInfo', function (req, res) {
    var userName = req.query.name;
    var callbackFn = req.query.callback;
    var result = {
        id: 10001,
        userName: userName,
        userAge:21
    };
    var data = JSON.stringify(result);
    res.writeHead(200, { 'Content-type': 'application/json' })
    res.write(callbackFn+'('+data+')');
    res.end()
})
app.listen(3000, function () {
    console.log('服务端启动....')
})