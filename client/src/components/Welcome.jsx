import React from "react";


function Welcome({setDisplayName,handleJoin,setRoomID}) {
    return (
        <div className="welcome__container">
            <div className="welcome__title">Dev - Together</div>
            <form className="welcome__form" >
                <input
                    autoComplete="off" 
                    className="welcome__NameInput"
                    name="displayName" 
                    type="text" 
                    placeholder="What should we call you?"
                    required 
                    onChange={(e)=>{setDisplayName(e.target.value)}}
                />
                                
                <input
                    autoComplete="off" 
                    className="welcome__RoomID"
                    name="inviteCode" 
                    type="text" 
                    placeholder="Join an existing Room" 
                    onChange={(e)=>{setRoomID(e.target.value)}}
                />
                <button 
                    className="welcome__formButton"
                    type="submit" 
                    onClick={()=>{
                        handleJoin();
                        
                    }}
                >Get Started!</button>
            </form>
        </div>
      );
}

export default Welcome;