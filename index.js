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
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/')
        .then(res => res.json())
        .then(dataShuffle => {
            let cardsAPI = `https://deckofcardsapi.com/api/deck/${dataShuffle.deck_id}/draw/?count=3`;
            fetch(cardsAPI)
                .then(res => res.json())
                .then(data => changeValues(data.cards))
                .then(filterData)
                .then(data => {
                    io.on('connection', (socket) => {
                        socket.on('card-choice', (choice) => {
                            const values = {
                                valueBase: data[0].value,
                                valueGuess: data[1].value
                            }
                            data.shift();
                            io.emit('card-choice', choice, data, values)
                        });
                    });
                    res.render('game', {
                        data
                    });
                })
                .catch(err => console.log(err));
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

server.listen(PORT, () => {
    console.log(`listening on localhost:${PORT}`);
});