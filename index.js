const express = require('express');
const app = express();
const PORT = process.env.PORT || 5151;
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/chat', (req, res) => {
    res.render('chat');
});

io.on('connection', (socket) => {
    io.emit('connected', 'a user has connected');

    socket.on('disconnect', () => {
        io.emit('disconnected', 'a user has disconnected');
    });

    socket.on('send-nickname', (nickname) => {
        socket.nickname = nickname;
    });

    socket.on('chat-message', (msg) => {
        io.emit('chat-message', msg);
    });
});

server.listen(PORT, () => {
    console.log(`listening on localhost:${PORT}`);
});