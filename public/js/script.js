const socket = io();
const chatForm = document.getElementById('chat');
// const nicknameForm = document.getElementById('nickname');
const chatMessage = document.getElementById('chat-message');
// const nicknameInput = document.getElementById('nickname-input');

if (window.location.pathname === '/chat') {
    const username = new URLSearchParams(window.location.search).get('nickname')

    console.log(username)

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
        console.log(msg.nickname)
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

// form.addEventListener('submit', (event) => {
//     event.preventDefault();
//     if (input.value) {
//         socket.emit('chat-message', input.value);
//         input.value = '';
//     }
// });

// nicknameForm.addEventListener('submit', (event) => {
//     event.preventDefault();
//     if (nicknameInput.value) {
//         socket.emit('send-nickname', nicknameInput.value);
//         nicknameInput.value = '';
//     }
// });

