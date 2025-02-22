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

let cardsData = null

const fetchCards = () => {
    return fetch('https://deckofcardsapi.com/api/deck/new/shuffle/')
        .then(res => res.json())
        .then(dataShuffle => {
            let cardsAPI = `https://deckofcardsapi.com/api/deck/${dataShuffle.deck_id}/draw/?count=52`;
            return fetch(cardsAPI)
                .then(res => res.json())
                .then(data => changeValues(data.cards))
                .then(filterData)
                .then(data => {
                    cardsData = data;
                })
        })
        .catch(err => console.log(err));
}
fetchCards()

app.get('/game', (req, res) => {
    res.render('game', {
        data: cardsData
    });
});

let users = {};
let turn = -1;

io.on('connection', (socket) => {
    users[socket.id] = 0;
    socket.on('disconnect', () => {
        delete users[socket.id];
    });

    socket.on('card-choice', (choice) => {
        if (cardsData) {
            const values = {
                valueBase: cardsData[0].value,
                valueGuess: cardsData[1].value
            }
            const correctGuess = (choice.choice === 'higher' && values.valueGuess >= values.valueBase) || (choice.choice === 'lower' && values.valueGuess <= values.valueBase);
            if (correctGuess) {
                Object.keys(users).filter(user => {
                    if (user == choice.id) {
                        users[user]++;
                    }
                });
            }

            cardsData.shift();
            io.emit('card-choice', choice, cardsData, values);
        }
    });

    socket.on('pass-turn', () => {
        const sortedUsers = Object.entries(users)
            .sort(([, a], [, b]) => b - a)
            .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

        turn += 1;
        if (turn === Object.keys(users).length) {
            turn = 0;
        }
        io.emit('turn', Object.keys(users)[turn], sortedUsers);
        if (cardsData.length === 1) {
            io.emit('game-finished', sortedUsers);
            fetchCards();
        }
    });
});

const changeValues = (data) => {
    data.map(d => {
        // Multiple replaces in 1: https://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings
        const changes = {
            10: 91,
            JACK: 92,
            QUEEN: 93,
            KING: 94,
            ACE: 95
        }
        d.value = d.value.replace(/10|JACK|QUEEN|KING|ACE/, function (matched) {
            return changes[matched];
        });
    });
    return data
}

const filterData = (data) => {
    return data.map(card => {
        return {
            image: card.image,
            value: card.value,
        }
    });
}

server.listen(PORT, () => {
    console.log(`listening on localhost:${PORT}`);
});