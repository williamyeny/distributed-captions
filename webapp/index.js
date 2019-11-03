const express = require('express')
const ws = require('ws')

const app = express()
const port = process.env.PORT || '8000'

app.set('view engine', 'pug')
app.set('views', './views')

const server = new ws.Server({ server: app.listen(port) })

server.on('connection', socket => {
    socket.on('message', msg => {
        /*
        server.clients.forEach(client => {
            client.send(msg);
        })
        */
        console.log(msg)
    })
})

app.get('/', (req, res) => {
    res.render('index')
})
