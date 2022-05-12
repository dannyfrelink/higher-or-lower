const socket = io();

// Game page
const playerId = document.querySelector('header #your-id');
const headerText = document.querySelector('header h1');
const lastGuess = document.querySelector('header #guess');
const scoreboard = document.querySelector('header ol');
const higherLowerButtons = document.querySelectorAll('main button');
const openCard = document.querySelector('main>img');
const closedCard = document.querySelector('#flip-card-inner img:last-of-type');
const flipContainer = document.querySelector('#flip-card-inner');
const finishPopUp = document.querySelector('#finish-pop-up');
const finishedMessageTitle = document.querySelector('#finished-message h2');

if (window.location.pathname === '/game') {
    socket.on('connect', () => {
        playerId.textContent = `Your id: ${socket.id}`;
    });

    socket.emit('pass-turn');

    higherLowerButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const clickValue = e.target.id;
            socket.emit('card-choice', {
                choice: clickValue,
                id: socket.id
            });
            socket.emit('pass-turn');
        });
    });

    socket.on('turn', (id, users) => {
        scoreboard.textContent = '';
        Object.entries(users)
            .forEach(user => {
                const userScore = document.createElement('li');
                userScore.textContent = `${user[0]}: ${user[1]}`;
                if (user[0] === socket.id) {
                    userScore.classList.add('player');
                }
                scoreboard.appendChild(userScore);
            });

        if (socket.id !== id) {
            headerText.textContent = 'Please wait for your opponents turn';
            higherLowerButtons.forEach(button => {
                button.disabled = true;
            });
        } else {
            headerText.textContent = 'Time to make your guess';
            higherLowerButtons.forEach(button => {
                button.disabled = false
            });
        }
    })

    socket.on('card-choice', (choice, data) => {
        const guess = choice.choice
        lastGuess.textContent = `Last guess: ${guess.charAt(0).toUpperCase()}${guess.slice(1)}`;
        flipContainer.classList.add('flip');

        setTimeout(() => {
            flipContainer.classList.remove('flip');
        }, 1500);
        setTimeout(() => {
            openCard.src = data[0].image;
            closedCard.src = data[1].image;
        }, 2000);
    });

    socket.on('game-finished', scores => {
        finishPopUp.classList.remove('hidden');
        scoreKeys = Object.keys(scores);
        scoreValues = Object.values(scores);

        scoreKeys.forEach(key => {
            if (scores[key] === scoreValues[0]) {
                if (socket.id === key) {
                    finishedMessageTitle.textContent = 'Yess! You totally rocked this game!';
                }
            }
        });
    });
}