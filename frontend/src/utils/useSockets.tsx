import { io } from "socket.io-client";

export default useSockets = () => {
  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("Socket connected");
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  const setListeners = () => {};
};

socket.on("shareDataLogin", (data) => {
  // console.log('users in room before anyone joined (must be empty):', usersInRoom)
  // console.log("user (not you!) just logged in, id and username:", data.id,data.user);
  updateUsers({ id: data.id, username: data.user });
  socket.emit("loginResponse", {
    socket: data.id,
    data: { username: thisUser, coordinates: myCoordinates },
  });
  // console.log(`${data.user} logged in, you sent callback`);
});
socket.on("receiveLoginResponse", (data) => {
  // console.log('i just logged in and received data from other user:(username,id,coordinates)', data);
  updateUsers(data);
});
socket.on("newMessage", (data) => {
  let msg = document.createElement("p");
  msg.innerHTML = `${data.username}: ${data.message}`;
  document.getElementById("chatbox").appendChild(msg);
});

const sendMessage = (e) => {
  e.preventDefault();
  let msg = document.getElementById("messageinput").value;
  socket.emit("messageSent", {
    username: thisUser,
    room: thisRoom,
    message: msg,
  });
  document.getElementById("messageinput").value = "";
};
document.getElementById("messageform").addEventListener("submit", sendMessage);
const newUserElement = (data) => {
  let div = document.createElement("div");
  div.classList.add("userDiv");
  div.id = "user-" + data.username;
  div.innerHTML = "<span>" + data.username + "</span>";
  div.style.left = data.coordinates ? data.coordinates.x + "px" : "400px";
  div.style.top = data.coordinates ? data.coordinates.y + "px" : "200px";
  return div;
};
const updateUsers = (data) => {
  let targetUser = usersInRoom.find((u) => u.username == data.username);
  // console.log('empty if just logged in (for both users), not empty if updating on move:', targetUser);
  if (targetUser) {
    targetUser.coordinates = data.coordinates;
    let userElement = document.getElementById("user-" + data.username);
    // console.log('this showing and not empty only if moving!:', userElement)
    userElement.style.left = data.coordinates.x + "px";
    userElement.style.top = data.coordinates.y + "px";
  } else {
    // console.log('update user: usersInroom before inserting new user / if just logged in then before receiving other users info, this log cant show if receiving other users moving', usersInRoom);
    usersInRoom.push(data);
    // console.log('update user: usersInroom after inserting new user / receiving other users', usersInRoom);
    document.getElementById(thisRoom).appendChild(newUserElement(data));
  }
};

socket.on("receiveUpdate", (data) => {
  updateUsers(data);
});

socket.on("userLeft", ({ id }) => {
  // console.log('user left with id', id);
  let left = usersInRoom.findIndex((u) => u.id == id);
  if (left > -1) {
    // console.log('target dom element to remove:',document.getElementById('user-'+usersInRoom[left].username));
    let leftDom = document.getElementById("user-" + usersInRoom[left].username);
    leftDom.remove();
    let goodbye = document.createElement("p");
    goodbye.innerHTML = `${usersInRoom[left].username} left lobby`;
    document.getElementById("chatbox").appendChild(goodbye);
    usersInRoom.splice(left, 1);
  }
  // console.log('userLeft array after removing',usersInRoom)
});
