/* eslint-disable default-case */
import React, { useMemo, useState } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";

export default function TextEditor() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]);

  function keyDown(e, change) {
    
  }

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable onKeyDown={keyDown} />
    </Slate>
  );
}
