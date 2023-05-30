import React, { useState, useEffect } from "react";

export default function Editable({
  text,
  placeholder,
  todoEditInputRef,
  children,
  ...props
}) {
  const [isEditing, setEditing] = useState(false);

  useEffect(() => {
    if (todoEditInputRef && todoEditInputRef.current && isEditing === true) {
      todoEditInputRef.current.focus();
    }
  }, [isEditing, todoEditInputRef]);

  const handleKeyDown = (event) => {
    if (13 === event.keyCode) {
      todoEditInputRef.current.blur();
    }
  };

  return (
    <section {...props}>
      {isEditing ? (
        <div
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => handleKeyDown(e)}
          className="editable-content-editing"
        >
          {children}
        </div>
      ) : (
        <div onClick={() => setEditing(true)} className="editable-content">
          <h3 title="Click to edit!">{text || placeholder || "..."}</h3>
        </div>
      )}
    </section>
  );
}
