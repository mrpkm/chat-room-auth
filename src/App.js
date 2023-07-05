import { useEffect, useState } from "react";
import './App.css';
import firebase from './firebase';
import { getDatabase, push, ref, set, onChildAdded } from 'firebase/database'

function App() {
  const [name, setName] = useState("");
  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState("");

  const db = getDatabase();
  const chatListRef = ref(db, "chats");

  const handleInputChange = () => {
    const inputName = prompt('Please enter your name:');
    setName(inputName);
  };


  useEffect(() => {
    onChildAdded(chatListRef, (data) => {
      // const c = [...chats];
      // c.push(data.val());
      // setChats(c)
      setChats(chats => [...chats, data.val()])
      console.log(data.val());
    });
  }, [])

  const sendChat = () => {
    const chatRef = push(chatListRef);
    set(chatRef, {
      name, message: msg
    })
    setMsg("");
  }


  return (
    <div className="app">
      {name ? null : <div className="setnamebtn">
        <button className="setbtn" onClick={handleInputChange}>Set Name</button>
      </div>}
      {name ?
        <div>
          <h1>user: {name}</h1>
          <div className="chat-container">
            {chats.map((c, i) => <div key={i} className={`container ${c.name === name ? 'me' : ''}`}>
              <p className="chatbox">
                <strong>{c.message}</strong>
                <span>{c.name}</span>
              </p>
            </div>)}

          </div>
          <div className="botton">
            <input type="text" required onInput={e => setMsg(e.target.value)} placeholder="enter you chat.." value={msg} />
            <button onClick={e => sendChat()}>send</button>
          </div>
        </div> : null}

    </div >
  );
}

export default App;
