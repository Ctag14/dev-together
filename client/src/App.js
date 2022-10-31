import "./App.css";
import Welcome from "./components/Welcome";
import { useState, useEffect, useRef } from "react";
import Chat from "./components/Chat";
import React from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Editor from "./components/Editor";
import Participants from "./components/Participants";

const socket = io("https://dev-together-folzfmsyn-ctag14.vercel.app/server/index.js");

function App() {
  const [displayName, setDisplayName] = useState("");
  const [nameProvided, setNameProvided] = useState(false);
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState("");
  const [people, setPeople] = useState([]);
  const [positions, setPositions] = useState([]);
  const [language, setLanguage] = useState("javascript");
  const room = useRef({
    id: "",
  });
  const myPos = useRef({
    user: displayName,
    position: { top: 0, left: 0 },
  });

  useEffect(() => {
    socket.on("recieve_message", (sentMessage) => {
      setMessages((list) => [sentMessage, ...list]);
    });
    socket.on("broadcast_code", (value) => {
      console.log("broadcast");

      setCode(value);
    });
    socket.on("update_connected", (listConnected) => {
      setPeople(listConnected);
    });
    socket.on("update_positions", (listPositions) => {
      console.log();
      const filtered = listPositions.filter(
        (item) => item.displayName !== displayName
      );

      setPositions(filtered);
    });
    socket.on("language_change", (lang) => {
      setLanguage(lang);
      console.log(language);
    });
    socket.on("user_left", (listConnected, leaveMessage) => {
      setPeople(listConnected);
      setMessages((list) => [leaveMessage, ...list]);
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

  function handleJoin() {
    if (displayName === "") alert("Please enter your Name");
    else {
      if (window.location.href === "http://localhost:3000/") {
        room.current.id = uuidv4();
      } else {
        room.current.id = window.location.href.slice(22);
      }
      function joinRoom() {
        socket.emit("join", displayName, room.current.id);
        setNameProvided(true);
        setMessages([
          {
            user: "server",
            content: `Welcome ${displayName}`,
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
      user: displayName,
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
        />
      ) : (
        <>
          <p
            className="userPos"
            style={{
              position: "fixed",
              top: myPos.current.position.top,
              left: myPos.current.position.left,
              backgroundColor: "#7600bc",
              maxheight: "100%",
              maxWidth: "100%",
              zIndex: 100,
            }}
          >
            {myPos.current.user}
          </p>

          {positions.map((item, index) => {
            if (
              item.position.left != "24px" &&
              item.displayName != displayName
            ) {
              return (
                <p
                  key={index}
                  className="userPos"
                  style={{
                    position: "fixed",
                    top: item.position.top,
                    left: item.position.left,
                    backgroundColor: "#7600bc",
                    maxheight: "100%",
                    maxWidth: "100%",
                    zIndex: 100,
                  }}
                >
                  {item.displayName}
                </p>
              );
            }
          })}
          <Editor
            updateCode={updateCode}
            code={code}
            setCode={setCode}
            displayName={displayName}
            language={language}
          />
          <Chat
            messages={messages}
            sendMessage={sendMessage}
            displayName={displayName}
            roomId={room.current.id}
          />
          <Participants
            people={people}
            displayName={displayName}
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
