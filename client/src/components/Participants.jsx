import React from "react";

const Participants = ({people,roomId, displayName,handleLangChange,language}) => {
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
                <div className="part__inviteCode">{`https://ctag14.github.io/dev-together/${roomId}`}</div>
            </div>
            <div className="part__members">
                Connected:
                {people.map(item=>{
                    return(
                        <div className="part__user"key={item}>
                            <p className="circle"></p>
                            <p>{item}</p>
                        </div>
                    )
                })
                }
            </div>
            <div className="part__language">
                <div className="part__selectedTitle"> Coding in:</div>
                <div className= "part__selectedLang">{language}</div>
                <img className="langIcon"src={icons[language]} height="40px" width="40px"/>
                
                {displayName ===people[0]&&
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