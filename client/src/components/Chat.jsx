import {useState} from 'react'
import{IoMdSend} from "react-icons/io/"


const Chat = ({messages,sendMessage,displayName,roomId}) => {
    const [input,setInput] = useState('')
    const handleSend = e =>{
        e.preventDefault()
        const msgContent = input;
        setInput("");
        e.target.reset()
        sendMessage(msgContent);
        
    }
    function msgId(messages,index){
        let message = messages[index] 
        if (message.user !== displayName && message.user!== 'server'){
            if(messages[index+1] != undefined && message.user !== messages[index+1].user) return true;
        }
        return false;
    }
    function timestamp (message){
        if (message.user !== 'server'){
            return(
                <div className="message__timestamp"> {message.time}</div>
            )
        } 
    }
    function firstMsg (messages,index){
        if (messages[index].user === 'server' )return false;
        if(messages[index].user != messages[index+1].user)return true;
        return false; 

    } 

    return (
        <div className="chat">
            
            <div className="chat__header"> Messages </div>
            
            <div className="chat__body">
                {messages.map((message,index)=>{
                    return(
                    <>   
                        

                        <div 
                            className= {`message 
                                ${message.user === 'server'? '-server':''} 
                                ${message.user === displayName? '-user':''}`
                            }
                            key={index}
                        >
                            {firstMsg(messages,index) && message.user === displayName && <div className="outgoing"/>}
                            {firstMsg(messages,index) && message.user !== displayName && <div className ="incoming"/>}
                            {msgId(messages,index) && <div className="message__userLabel">{message.user}</div> }
                            <span className="message__content">{message.content}</span>
                            {timestamp(message)}
                        </div>
                        {firstMsg(messages,index)&&<div className='spacer'></div>}
                    </> 
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
                    
                <button className="chat__button"type="submit"><IoMdSend/></button>
            </form>
        </div>
      );
}
 
export default Chat;