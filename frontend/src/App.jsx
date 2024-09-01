import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
const socket = io("/");

function App() {
  const userInputRef = useRef(null);
  const chatInputRef = useRef(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("USER")));
  const [channel, setChannel] = useState(localStorage.getItem("CHANNEL") ?? "");
  const [message, setMessage] = useState("");
  const [listMessages, setListMessages] = useState([]);

  const handlerSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      user,
      id: crypto.randomUUID(),
      message,
    };
    setListMessages([...listMessages, newMessage]);
    setMessage("");
    socket.emit("channels", { eventSocket: channel, newMessage });
  };

  const handlerUserSubmit = (e) => {
    e.preventDefault();
    if (!userInputRef.current?.value || !chatInputRef.current?.value) return;
    const newUser = {
      name: userInputRef.current.value,
      id: crypto.randomUUID(),
    };
    setUser(newUser);
    setChannel(chatInputRef.current.value);
    localStorage.setItem("USER", JSON.stringify(newUser));
    localStorage.setItem("CHANNEL", chatInputRef.current.value);
  };

  useEffect(() => {
    if (!channel) return;
    socket.on(channel, (message) => {
      setListMessages((state) => [...state, message]);
    });
    return () => socket.off(channel);
  }, [channel]);

  return (
    <div className="container_app">
      <h1>{channel}</h1>
      {!user ? (
        <form onSubmit={handlerUserSubmit}>
          <label>
            <input type="text" placeholder="Chat name" ref={chatInputRef} />
          </label>
          <label>
            <input type="text" placeholder="User name" ref={userInputRef} />
          </label>
          <button>Start</button>
        </form>
      ) : (
        <div className="container_chat">
          <ul>
            {listMessages.map(({ id, message, user: messageUser }) => (
              <li
                key={id}
                style={{
                  marginInline: messageUser.id == user.id ? "auto 0" : "0 auto",
                  backgroundColor: messageUser.id == user.id? 'lightgreen': 'lightblue'
                }}
              >
                <section>
                  <h3>{messageUser.name}</h3>
                  <p>{message}</p>
                </section>
              </li>
            ))}
          </ul>
          <form onSubmit={handlerSubmit}>
            <label>
              <input
                type="text"
                placeholder="Write your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
              <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
