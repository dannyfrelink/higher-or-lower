const socket = io();
const form = document.getElementById('form');
const nicknameForm = document.getElementById('nickname');
const input = document.getElementById('input');
const nicknameInput = document.getElementById('nickname-input');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value) {
        socket.emit('chat-message', input.value);
        input.value = '';
    }
});

nicknameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (nicknameInput.value) {
        socket.emit('send-nickname', nicknameInput.value);
        nicknameInput.value = '';
    }
});

socket.on('chat-message', (msg) => {
    const item = document.createElement('li');
    console.log(socket.nickname);
    item.textContent = `${msg.nickname}: ${msg.msg}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('connected', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('disconnected', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});