const express = require('express');
const app = express();
const PORT = process.env.PORT || 5151;
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const fetch = require('node-fetch');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/game', (req, res) => {
    let cardsAPI = 'https://deckofcardsapi.com/api/deck/new/draw/?count=52';
    fetch(cardsAPI)
        .then(res => res.json())
        .then(data => changeValues(data.cards))
        .then(data => filterData(data))
        .then(data => {
            console.log(data)


            io.on('connection', (socket) => {
                socket.on('card-choice', (choice) => {

                    const values = {
                        valueBase: data[0].value,
                        valueGuess: data[1].value
                    }
                    // console.log(valueBase)
                    // console.log(valueGuess);
                    data.shift();
                    io.emit('card-choice', choice, data, values)
                })
            });

            res.render('game', {
                data
            })
        })
        .catch(err => console.log(err));
});

const changeValues = (data) => {
    data.map(d => {
        // Meerder replaces in 1: https://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings
        const changes = {
            JACK: 11,
            QUEEN: 12,
            KING: 13,
            ACE: 14
        }
        d.value = d.value.replace(/JACK|QUEEN|KING|ACE/, function (matched) {
            return changes[matched];
        });
    });
    return data
}

const filterData = (data) => {
    return data.map(card => {
        return {
            code: card.code,
            image: card.image,
            value: card.value,
            suit: card.suit
        }
    });
}



// io.emit('connected', 'a user has connected');

// socket.on('disconnect', () => {
//     io.emit('disconnected', 'a user has disconnected');
// });

// socket.on('send-nickname', (nickname) => {
//     socket.nickname = nickname;
// });

// socket.on('chat-message', (msg) => {
//     io.emit('chat-message', msg);
// });
// });

server.listen(PORT, () => {
    console.log(`listening on localhost:${PORT}`);
});