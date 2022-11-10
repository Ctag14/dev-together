import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sublime } from "@uiw/codemirror-theme-sublime";
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
const Editor = ({updateCode, code,language,}) => {
     
 
    return (
        <div className="editor" >
        
        <CodeMirror
          id = "editor"
          height="100%"
          width="50vw"
          value={code}
          theme={sublime}
          basicSetup={{
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: true,
            indentOnInput: false,
          }}
          extensions={[loadLanguage(language)]}
          onChange={(value) => {
            if(code!== value)
              updateCode(value);
        }}
        />
      </div>
      );
}
 
export default Editor;