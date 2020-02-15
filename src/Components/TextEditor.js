/* eslint-disable no-undef */
/* eslint-disable default-case */
import React, { useMemo, useState, useCallback } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Editor, Transforms, Text } from "slate";
import Icon from 'react-icons-kit';
import { bold, code, italic, list, underline } from 'react-icons-kit/feather';
import { FormatToolbar } from "./index";

const CustomEditor = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.bold === true,
      universal: true
    });

    return !!match;
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === "code"
    });

    return !!match;
  },

  isListActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === "list"
    });

    return !!match;
  },

  isUnderlineActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === "underline"
    });

    return !!match;
  },

  isItalicActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.italic === true,
      universal: true
    });

    return !!match;
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    );
  },

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : "code" },
      { match: n => Editor.isBlock(editor, n) }
    );
  },

  toggleList(editor) {
    const isActive = CustomEditor.isListActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : "list" },
      { match: n => Editor.isBlock(editor, n) }
    );
  },

  toggleUnderline(editor) {
    const isActive = CustomEditor.isUnderlineActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : "underline" },
      { match: n => Editor.isBlock(editor, n) }
    );
  },

  toggleItalic(editor) {
    const isActive = CustomEditor.isItalicActive(editor);
    Transforms.setNodes(
      editor,
      { italic: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    );
  }
};

const CodeElement = props => {
  return (
    <pre style={{background: '#eee', width:'100%', padding: 7, borderLeft: 'solid red 2px'}} {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const ListElement = props => {
  return (
    <ul {...props.attributes}>
      <li>{props.children}</li>
    </ul>
  );
};

const UnderlineElement = props => {
  return (
    <u {...props.attributes}>
      {props.children}
    </u>
  );
};

const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>;
};

const Leaf = props => {
  if (props.leaf.bold) {
    if (props.leaf.italic) {
      return (
        <span
          {...props.attributes}
          style={{ fontWeight: "bold", fontStyle: "italic"}}
        >
          {props.children}
        </span>
      );
    } else {
      return (
        <span
          {...props.attributes}
          style={{ fontWeight: "bold"}}
        >
          {props.children}
        </span>
      );
    }
  } else if (props.leaf.italic) {
    if (props.leaf.bold) {
      return (
        <span
          {...props.attributes}
          style={{ fontStyle: "italic", fontWeight: "bold"}}
        >
          {props.children}
        </span>
      );
    } else {
      return (
        <span
          {...props.attributes}
          style={{ fontStyle: "italic"}}
        >
          {props.children}
        </span>
      );
    }
  } else {
    return (
      <span
        {...props.attributes}
        style={{ fontWeight: "normal"}}
      >
        {props.children}
      </span>
    );
  }
  
};

export default function TextEditor() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "Hellow World." }]
    }
  ]);

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      case "list":
        return <ListElement {... props} />;
      case "underline":
        return <UnderlineElement {... props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <div className="editor">
        <div>
          <FormatToolbar>
            <button
              className="tooltip-icon-button"
              onMouseDown={event => {
                event.preventDefault();
                CustomEditor.toggleBoldMark(editor);
              }}
            >
              <Icon icon={bold} />
            </button>
            <button
              className="tooltip-icon-button"
              onMouseDown={event => {
                event.preventDefault();
                CustomEditor.toggleItalic(editor);
              }}
            >
              <Icon icon={italic} />
            </button>
            <button
              className="tooltip-icon-button"
              onMouseDown={event => {
                event.preventDefault();
                CustomEditor.toggleCodeBlock(editor);
              }}
            >
              <Icon icon={code} />
            </button>
            <button
              className="tooltip-icon-button"
              onMouseDown={event => {
                event.preventDefault();
                CustomEditor.toggleList(editor);
              }}
            >
              <Icon icon={list} />
            </button>
            <button
              className="tooltip-icon-button"
              onMouseDown={event => {
                event.preventDefault();
                CustomEditor.toggleUnderline(editor);
              }}
            >
              <Icon icon={underline} />
            </button>
            
          </FormatToolbar>
        </div>
        <Editable
          className="text-editor"
          editor={editor}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={event => {
            if (!event.ctrlKey) {
              return;
            }

            switch (event.key) {
              case "`": {
                event.preventDefault();
                CustomEditor.toggleCodeBlock(editor);
                break;
              }

              case "b": {
                event.preventDefault();
                CustomEditor.toggleBoldMark(editor);
                break;
              }

              case "i": {
                event.preventDefault();
                CustomEditor.toggleItalic(editor);
                break;
              }
              case "l": {
                event.preventDefault();
                CustomEditor.toggleList(editor);
                break;
              }
            }
          }}
        />
      </div>
    </Slate>
  );
}
