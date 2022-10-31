import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sublime } from "@uiw/codemirror-theme-sublime";
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { cursorTooltip } from "../helpers/cursor.ts";
const Editor = ({updateCode, code, displayName,language,setCode}) => {
     
 
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
          onChange={(value,viewUpdate,displayName) => {
            console.log(code);
            // console.log(displayName);
            // console.log(viewUpdate.view.dispatch({selection: {anchor: 0}}))
            // console.log(viewUpdate.state.selection);
            let pos = viewUpdate.state.selection.ranges[0].from;
            // viewUpdate.view.dispatch({selection: {anchor: }})
            if(code!== value)
              updateCode(value);
        }}
        />
      </div>
      );
}
 
export default Editor;