const socket = io();

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

function addMessage(msg){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li); 
}

let roomName;

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", nickNameSubmit);
}

function nickNameSubmit(event){
    event.preventDefault();
    const input = room.querySelector('#name input');
    const myName = input.value;
    socket.emit("nickname", myName);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector('#msg input');
    const myMsg = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${myMsg}`);
    });
    input.value = "";
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}
form.addEventListener("submit", handleRoomSubmit);

socket.on("joined", (user) => {
    addMessage(`${user} joined` );
})

socket.on("out", (user) => {
    addMessage(`${user} out!`);
})

socket.on("new_message", addMessage);
/* 
const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`)

function makeMessage(type, payload) {
    const msg = {type, payload};
    return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
    console.log("Connected to Server ^^");
});

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server");
});


function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    messageList.append(li);
    socket.send(makeMessage("new_message", input.value));
    input.value = "";
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
*/