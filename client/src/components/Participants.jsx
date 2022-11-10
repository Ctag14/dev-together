import React,{useState} from "react";
import {MdContentPaste} from "react-icons/md/"
const Participants = ({people,roomId, displayName,handleLangChange,language}) => {
    const [copied, setCopied] = useState(false);
    function handleCopy(){
        navigator.clipboard.writeText(roomId);
        setCopied(true);
    }
    const icons ={
        javascript:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        python:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
        jsx:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        typescript:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
    }
    return ( 
        <div className="part">
            <div className='part__invite'>
                <div className="part__inviteHeader">Invite Code:</div>
                <div className="part__inviteCode">{roomId}</div>
                <button 
                    className="part__copyInvite" 
                    style= {{color: copied ? 'white':'#0078d7'}} 
                    onClick={()=>{handleCopy()}}
                >   
                    <MdContentPaste/>
                </button>
                <div className="part__notice">{copied?"Copied!":''}</div>
            </div>
            <div className="part__members">
                Connected:
                {people.map((item,index)=>{
                    return(
                        <div className="part__user"key={index}>
                            <p className="circle"></p>
                            <p>{item.displayName}</p>
                        </div>
                    )
                })
                }
            </div>
            <div className="part__language">
                <div className="part__selectedTitle"> Coding in:</div>
                <div className= "part__selectedLang">{language}</div>
                <img className="langIcon"src={icons[language]} height="40px" width="40px"/>
                
                {people.length>0 && displayName === people[0].displayName &&
                    <div className="part__languagePicker">
                        <div className="part__languagePickerHeader">Select Another Language</div>
                        <select className ="langauge__selector" value ={language} name="language" id="language" onChange={e=>handleLangChange(e.target.value)}>
                            <option value="javascript">Javascript</option>
                            <option value="python">Python</option>
                            <option value="jsx">Jsx</option>
                            <option value="typescript">Typescript</option>
                        </select>
                    </div>
                }
            </div>
        </div>
     );
}
 
export default Participants;