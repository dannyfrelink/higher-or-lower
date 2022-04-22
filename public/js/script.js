const socket = io();
const chatForm = document.getElementById('chat');
const chatMessage = document.getElementById('chat-message');

if (window.location.pathname === '/chat') {
    const username = new URLSearchParams(window.location.search).get('nickname')

    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (chatMessage.value) {
            socket.emit('chat-message', {
                message: chatMessage.value,
                nickname: username
            });
            chatMessage.value = '';
        }
    });

    socket.on('chat-message', (msg) => {
        const item = document.createElement('li');
        item.textContent = `${msg.nickname}: ${msg.message}`;
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
}