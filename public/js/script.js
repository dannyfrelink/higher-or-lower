const socket = io();
// Home page
// const usernameForm = document.querySelector('#username');
// const usernameInput = document.querySelector('#username-input');

// if (window.location.pathname === '/') {
//     usernameForm.addEventListener('submit', () => {
//         const username = usernameInput.value;
//         socket.emit('new-user', {
//             username
//         });
//     });
// }

// Game page
const headerText = document.querySelector('h1');
// const leaveRoomButton = document.querySelector('#leave-room');
const higherLowerButtons = document.querySelectorAll('button');
const openCard = document.querySelector('main>img');
const closedCard = document.querySelector('#flip-card-inner img:last-of-type');
const flipContainer = document.querySelector('#flip-card-inner');

if (window.location.pathname === '/game') {
    // leaveRoomButton.addEventListener('click', () => {
    //     socket.emit('disconnect');
    // });

    socket.emit('pass-turn');

    higherLowerButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const clickValue = e.target.id;
            socket.emit('card-choice', {
                choice: clickValue
            });
            socket.emit('pass-turn');
        });
    });

    socket.on('turn', (id) => {
        console.log('New line:')
        console.log('Opgeslagen id: ', id)
        console.log('Socket id nu: ', socket.id)

        console.log(headerText)
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