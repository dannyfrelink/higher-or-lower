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
    console.log(data)
    console.log(choice.choice)
    console.log(values)
    flipContainer.classList.add('flip');



    setTimeout(() => {
        flipContainer.classList.remove('flip');
    }, 2200);
    setTimeout(() => {
        openCard.src = data[0].image;
        closedCard.src = data[1].image;
    }, 3000);
});