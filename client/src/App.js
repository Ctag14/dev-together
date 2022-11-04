import "./App.css";
import Welcome from "./components/Welcome";
import { useState, useEffect, useRef } from "react";
import Chat from "./components/Chat";
import React from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Editor from "./components/Editor";
import Participants from "./components/Participants";

const socket = io("https://dev-together.adaptable.app/");
function App() {
  const [nameProvided, setNameProvided] = useState(false);
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState("");
  const [people, setPeople] = useState([]);
  const [language, setLanguage] = useState("javascript");
  const room = useRef({
    id: "",
  });
  const displayName = useRef("");

  useEffect(() => {
    socket.on("recieve_message", (sentMessage) => {
      setMessages((list) => [sentMessage, ...list]);
    });
    socket.on("broadcast_code", (value) => {
      console.log("broadcast");

      setCode(value);
    });
    socket.on("update_connected", (listConnected) => {
      console.log(listConnected);
      setPeople(listConnected);
    });
    socket.on("language_change", (lang) => {
      setLanguage(lang);
      console.log(language);
    });
    socket.on("user_left", (listConnected, leaveMessage) => {
      setPeople(listConnected);
      setMessages((list) => [leaveMessage, ...list]);
    });
    socket.io.on("reconnect", (attempt) => {
      console.log(attempt);
      console.log(displayName.current);
      console.log(room.current.id);
      socket.emit("rejoin", displayName.current, room.current.id);
    });
    return () => {
      socket.off("recieve_message");
      socket.off("broadcast_code");
      socket.off("update_connected");
      socket.off("update_positions");
      socket.off("language_change");
      socket.off("user_left");
    };
  }, [socket]);
  function setRoomID(value) {
    room.current.id = value;
  }
  function setDisplayName(value) {
    displayName.current = value;
  }
  function handleJoin() {
    if (displayName.current === "") alert("Please enter your Name");
    else {
      if (room.current.id === "") {
        room.current.id = uuidv4();
      }

      function joinRoom() {
        socket.emit("join", displayName.current, room.current.id);
        setNameProvided(true);
        setMessages([
          {
            user: "server",
            content: `Welcome ${displayName.current}`,
            time:
              new Date(Date.now()).getHours() +
              ":" +
              new Date(Date.now()).getMinutes(),
          },
        ]);
        socket.on("user_joined", (joinedMessage) => {
          setMessages((list) => [joinedMessage, ...list]);
        });
      }
      joinRoom();
    }
  }

  async function sendMessage(msgContent) {
    const sentMessage = {
      user: displayName.current,
      content: msgContent,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    await socket.emit("send_message", sentMessage, room.current.id);
    setMessages((list) => [sentMessage, ...list]);
  }
  function updateCode(value) {
    socket.emit("send_code", value, room.current.id);
  }
  function handleLangChange(lang) {
    setLanguage(lang);
    socket.emit("change_language", lang, room.current.id);
  }
  return (
    <div className="App">
      {!nameProvided ? (
        <Welcome
          setDisplayName={setDisplayName}
          handleJoin={handleJoin}
          roomId={room.current.id}
          setRoomID={setRoomID}
        />
      ) : (
        <>
          <Editor
            updateCode={updateCode}
            code={code}
            setCode={setCode}
            displayName={displayName.current}
            language={language}
          />
          <Chat
            messages={messages}
            sendMessage={sendMessage}
            displayName={displayName.current}
            roomId={room.current.id}
          />
          <Participants
            people={people}
            displayName={displayName.current}
            roomId={room.current.id}
            handleLangChange={handleLangChange}
            language={language}
          />
        </>
      )}
    </div>
  );
}

export default App;
