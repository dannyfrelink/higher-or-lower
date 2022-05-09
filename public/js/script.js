const socket = io();

// Home page
const usernameForm = document.querySelector('#username');
const usernameInput = document.querySelector('#username-input');

if (window.location.pathname === '/') {
    usernameForm.addEventListener('submit', () => {
        const username = usernameInput.value;
        socket.emit('new-user', {
            username
        });
    });
}

// Game page
const leaveRoomButton = document.querySelector('#leave-room');
const higherLowerButtons = document.querySelectorAll('button');
const openCard = document.querySelector('main>img');
const closedCard = document.querySelector('#flip-card-inner img:last-of-type');
const flipContainer = document.querySelector('#flip-card-inner');

if (window.location.pathname === '/game') {
    leaveRoomButton.addEventListener('click', () => {
        socket.emit('leave-room')
    })

    higherLowerButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const clickValue = e.target.id;
            socket.emit('pass-turn');
            socket.emit('card-choice', {
                choice: clickValue
            });
        });
    });
}

socket.on('your-turn', () => {
    console.log('test')
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