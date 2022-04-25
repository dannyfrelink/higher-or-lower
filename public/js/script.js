const socket = io();
const higherLowerButtons = document.querySelectorAll('button');
const openCard = document.querySelector('main>img');
const closedCard = document.querySelector('#flip-card-inner img:last-of-type');
const flipContainer = document.querySelector('#flip-card-inner');

higherLowerButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const clickValue = e.target.id;
        socket.emit('card-choice', {
            choice: clickValue
        })
    });
});

socket.on('card-choice', (choice, data, values) => {
    console.log(values)

    flipContainer.classList.add('flip');
    if (choice.choice === 'higher' && values.valueGuess > values.valueBase) {
        console.log('higher')
    } else if (choice.choice === 'lower' && values.valueBase > values.valueGuess) {
        console.log('lower')
    }

    setTimeout(() => {
        flipContainer.classList.remove('flip');
    }, 2200);
    setTimeout(() => {
        openCard.src = data[0].image;
        closedCard.src = data[1].image;
    }, 3000);
});

// if (window.location.pathname === '/game') {
    // const username = new URLSearchParams(window.location.search).get('nickname')

    // chatForm.addEventListener('submit', (event) => {
    //     event.preventDefault();
    //     if (chatMessage.value) {
    //         socket.emit('chat-message', {
    //             message: chatMessage.value,
    //             nickname: username
    //         });
    //         chatMessage.value = '';
    //     }
    // });

    // socket.on('chat-message', (msg) => {
    //     const item = document.createElement('li');
    //     item.textContent = `${msg.nickname}: ${msg.message}`;
    //     messages.appendChild(item);
    //     window.scrollTo(0, document.body.scrollHeight);
    // });

    // socket.on('connected', (msg) => {
    //     const item = document.createElement('li');
    //     item.textContent = msg;
    //     messages.appendChild(item);
    //     window.scrollTo(0, document.body.scrollHeight);
    // });

    // socket.on('disconnected', (msg) => {
    //     const item = document.createElement('li');
    //     item.textContent = msg;
    //     messages.appendChild(item);
    //     window.scrollTo(0, document.body.scrollHeight);
    // });
// }