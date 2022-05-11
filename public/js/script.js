const socket = io();

// Game page
const playerId = document.querySelector('header p');
const headerText = document.querySelector('header h1');
const scoreboard = document.querySelector('header ul');
const higherLowerButtons = document.querySelectorAll('button');
const openCard = document.querySelector('main>img');
const closedCard = document.querySelector('#flip-card-inner img:last-of-type');
const flipContainer = document.querySelector('#flip-card-inner');

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
        scoreboard.innerHTML = '';
        Object.entries(users)
            .forEach(user => {
                const userScore = document.createElement('li');
                userScore.textContent = `${user[0]}: ${user[1]}`;
                scoreboard.appendChild(userScore);
            });
        console.log('New line:')
        console.log('Whos turn: ', id)
        console.log('My id: ', socket.id)

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
        flipContainer.classList.add('flip');

        setTimeout(() => {
            flipContainer.classList.remove('flip');
        }, 1500);
        setTimeout(() => {
            openCard.src = data[0].image;
            closedCard.src = data[1].image;
        }, 2000);
    });
}