import { useEffect, useState } from "react";
import './App.css';
import firebase from './firebase';
import { getDatabase, push, ref, set, onChildAdded } from 'firebase/database'
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";


function App() {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const googleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        setUser({ name: result.user.displayName, email: result.user.email });
        console.log("object,", token, user)
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        console.log("errorCode", errorCode)
        const errorMessage = error.message;
        // The email of the user's account used.
        console.log("errorMessage", errorMessage)
        const email = error.customData.email;
        // The AuthCredential type that was used.
        console.log('eamil', email)
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log("crede", credential)
        // ...
      });
  }

  const [user, setUser] = useState("");
  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState("");

  const db = getDatabase();
  const chatListRef = ref(db, "chats");



  // const handleInputChange = () => {
  //   const inputName = prompt('Please enter your name:');
  //   setName(inputName);
  // };

  const updateHeight = () => {
    const el = document.getElementById('chat');
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }


  useEffect(() => {
    onChildAdded(chatListRef, (data) => {
      setChats(chats => [...chats, data.val()])
      setTimeout(() => {
        updateHeight();
      }, 100);
    });
  }, [])



  const sendChat = () => {
    const chatRef = push(chatListRef);
    set(chatRef, {
      user, message: msg
    })
    setMsg("");
  }


  return (
    <div className="app">
      {user.email ? null : <div className="setnamebtn">
        {/* <button className="setbtn" onClick={handleInputChange}>Set Name</button> */}
        <button className="setbtn" onClick={e => { googleLogin() }}>SignIn With Google</button>
      </div>}
      {user.email ?
        <div className='app-container'>
          <h1>user: {user.name}</h1>
          <div className="chat-container" id="chat">
            {chats.map((c, i) => <div key={i} className={`container ${c.user.email === user.email ? 'me' : ''}`}>
              <p className="chatbox">
                <strong>{c.message}</strong>
                <span>{c.user.name}</span>
              </p>
            </div>)}
          </div>
          <div className="botton">
            <input type="text" required onInput={e => setMsg(e.target.value)} placeholder="enter you chat.." value={msg} />
            <button onClick={e => sendChat()}>send</button>
          </div>

        </div>
        : null}

    </div >
  );
}

export default App;
