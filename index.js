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

const fetchCards = () => {
    return fetch('https://deckofcardsapi.com/api/deck/new/shuffle/')
        .then(res => res.json())
        .then(dataShuffle => {
            let cardsAPI = `https://deckofcardsapi.com/api/deck/${dataShuffle.deck_id}/draw/?count=52`;
            return fetch(cardsAPI)
                .then(res => res.json())
                // .then(data => changeValues(data.cards))
                .then(data => filterData(data.cards))
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
    // // const values = {
    // //     valueBase: cardsData[0].value,
    // //     valueGuess: cardsData[1].value
    // // }
    // io.emit('card-choice', cardsData)
    res.render('game', {
        data: cardsData
    });
});

io.on('connection', (socket) => {
    socket.on('card-choice', async choice => {
        await changeValues(cardsData);
        const values = {
            valueBase: cardsData[0].value,
            valueGuess: cardsData[1].value
        }
        console.log(choice.choice)
        console.log(values.valueGuess)
        console.log(values.valueBase)
        if (choice.choice === 'higher') {
            if (values.valueGuess > values.valueBase) {
                console.log('goed');
            } else {
                console.log('fout');
            }
            // console.log('correct')
        }
        // if (choice.choice === 'lower' && values.valueGuess < values.valueBase) {
        //     console.log('correct')
        // }


        cardsData.shift();
        io.emit('card-choice', choice, cardsData, values)
    });
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