import React, { useMemo, useState } from "react";
import "./HelpPage.css";

//basic static FAQ page right now, not too sure what other kind of features could be added but right now, its two sections, a users sections first and then the planners
//

function FaqItem({ q, children, defaultOpen = false}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className = "helpFaqItem">
      <button 
        type="button" 
        className = "helpFaqItem" 
        onClick = {() => setOpen((v) => !v )}
        aria-expanded = {open}>

          <span>{q}</span>
          <span className = "helpFaqChevron">{open ? "▾" : "▸"}</span>

      </button>

      {open && <div className="helpFaqAnswer">{children}</div>}
    </div>
  );
}
