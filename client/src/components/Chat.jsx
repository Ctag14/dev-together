import {useState} from 'react'


const Chat = ({messages,sendMessage,displayName,roomId}) => {
    const [input,setInput] = useState('')
    const handleSend = e =>{
        e.preventDefault()
        const msgContent = input;
        setInput("");
        e.target.reset()
        sendMessage(msgContent);
        
    }
    return (
        <div className="chat">
            
            <div className="chat__header"> Messages </div>
            
            <div className="chat__body">
                {messages.map((message,index)=>{
                    return(
                        
                        <div 
                            className= {`message ${message.user === 'server'? '-server':''} ${message.user === displayName? '-user':''}`}
                            key={index}
                        >
                            <p className="message__content">{message.content}</p>
                            {message.user !== 'server' && <p className="message__timestamp">{message.user} {message.time}</p>}
                        </div>
                    )
                })}
            </div>
            <form className="chat__form"onSubmit={handleSend}>
                <input
                    autoComplete='off' 
                    className="chat__input"
                    type="text" 
                    id ='content'
                    name='content'
                    placeholder="Type message..."
                    onChange = {(e)=>setInput(e.target.value)}
                    required 
                />
                    
                <button className="chat__button"type="submit">Send Message</button>
            </form>
        </div>
      );
}
 
export default Chat;