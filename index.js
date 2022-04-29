const express = require('express');
const app = express();
const PORT = process.env.PORT || 5151;
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const fetch = require('node-fetch');
const { createBrotliCompress } = require('zlib');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('home');
});

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
                    return data
                })
        })
        .catch(err => console.log(err));
}

let cardsData = null;

app.get('/game', async (req, res) => {
    if (!cardsData) {
        cardsData = await fetchCards();
    }
    res.render('game', {
        data: cardsData
    });
});

// let scores
// if (users) {
//     scores = users.map(user => {
//         return {
//             [user.id]: 0
//         }
//     })
// }
// console.log(scores)

let counterUsers = 1;
let counterRooms = 1;
let users = [];
let room;

io.on('connection', (socket) => {
    socket.on('join-room', () => {
        room = `room${counterRooms}`
        socket.join(room)
    })

    socket.on('new-user', (username) => {
        if (counterUsers > 4) {
            counterRooms++
            counterUsers = 1
        }
        const user = {
            [counterRooms]: {
                [counterUsers]: {
                    username,
                    id: socket.id
                }
            }
        }
        users.push(user)
        // console.log(users)
        socket.to(room).emit('joined-room', users, room)
        counterUsers++
    })





    // socket.on('join-server', (username) => {
    //     const user = {
    //         username,
    //         id: socket.id
    //     }
    //     users.push(user);
    //     io.emit('new-user', users);
    // });

    // socket.on('join-room', (roomName, cb) => {
    //     socket.join(roomName);
    //     // cb(messages[roomName]);
    // })

    socket.on('card-choice', (choice) => {
        if (cardsData) {
            const values = {
                valueBase: cardsData[0].value,
                valueGuess: cardsData[1].value
            }
            const correctGuess = (choice.choice === 'higher' && values.valueGuess >= values.valueBase) || (choice.choice === 'lower' && values.valueGuess <= values.valueBase)
            if (correctGuess) {
                console.log('correct')
            } else {
                console.log('fout')
            }

            cardsData.shift();
            // socket.to(roomName).emit('card-choice', choice, cardsData, values)

            // cardsData.shift();
            io.emit('card-choice', choice, cardsData, values)
        }
    });

    socket.on('disconnect', () => {
        users.forEach(user => {
            Object.values(user)
                .filter(value => {
                    Object.values(value)
                        .filter(v => {
                            console.log(v.id)
                            console.log(socket.id)
                            // v.id !== socket.id
                        });
                })
        })
        // console.log(users)
        // users = users.filter(u => {
        //     console.log(u.)
        // });
        io.emit('new-user', users)
    })
});

const changeValues = (data) => {
    data.map(d => {
        // Meerder replaces in 1: https://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings
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