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

export default function HelpPage() {
  const userFaqs = useMemo(
    () => [
      {
        q: "How do I submit a noise report?",
        a: (
          <ol className="helpList">
            <li>Go to <b>Report incident</b> in the navbar.</li>
            <li>Pick a <b>Noise Type</b> and set a <b>Date & Time</b>.</li>
            <li>Choose a <b>Severity</b> (1–10) and add a short <b>Description</b>.</li>
            <li>Add <b>Tags</b> (optional) and confirm the <b>Location</b>.</li>
            <li>Press <b>Send Report</b>.</li>
          </ol>
        ),
      },
      {
        q: "What should I put in ‘Severity’?",
        a: (
          <div className="helpText">
            Use <b>1–3</b> for mild annoyance, <b>4–6</b> for disruptive, and <b>7–10</b> for
            very loud / sustained / sleep-disrupting noise.
          </div>
        ),
      },
      {
        q: "Do I need to add tags?",
        a: (
          <div className="helpText">
            Tags are optional, but they help the system group similar reports (e.g. <i>Traffic</i>,
            <i>Music</i>, <i>Crowd</i>, <i>Construction</i>).
          </div>
        ),
      },
      {
        q: "Where can I see my reports and quick stats?",
        a: (
          <div className="helpText">
            Use <b>My Dashboard</b>. It shows recent reports (and quick stats) for users.
          </div>
        ),
      },
      {
        q: "What is a hotspot?",
        a: (
          <div className="helpText">
            A hotspot is an area where multiple noise reports cluster. It helps identify “busy”
            zones/areas that may need mitigation.
          </div>
        ),
      },
    ],
    []
  );


  //just kind of placeholder stuff for right now in this section, at the time of writing this i am unable to compile the docker image
  //so can't go through the steps for each FAQ, so for now, just general stuff. 
  //
  //Did the best i could with the deadline and whatnot, 
  const plannerFaqs = useMemo(
    () => [
      {
        q: "What extra features do planners get?",
        a: (
          <div className="helpText">
            Planners have access to the <b>Dashboard+</b> area (overview + moderation/workflow) and
            can create mitigation plans and compare scenarios.
          </div>
        ),
      },
      {
        q: "How do I review and process reports?",
        a: (
          <ol className="helpList">
            <li>Open <b>Dashboard+</b> → <b>Overview</b> / <b>Report Processing</b> (depending on your tabs).</li>
            <li>Use filters (time range / status) to narrow down reports.</li>
            <li>Open a report to view details, then <b>accept</b> or <b>reject</b> if required.</li>
          </ol>
        ),
      },
      {
        q: "How do mitigation plans work?",
        a: (
          <div className="helpText">
            Mitigation plans are proposed interventions for a zone/hotspot (e.g. barriers,
            traffic calming, enforcement, time restrictions). Plans can be compared in scenarios.
          </div>
        ),
      },
      {
        q: "How do I compare scenarios?",
        a: (
          <div className="helpText">
            Use <b>Scenario Comparison</b> to compare multiple plans/scenarios side-by-side and pick
            the best option for impact vs cost/feasibility.
          </div>
        ),
      },
      {
        q: "How do I export a report / summary?",
        a: (
          <div className="helpText">
            Use <b>Generate Report</b> (or your exporting tab) to export the current view or a
            selected hotspot summary. If export isn’t wired yet, it will show a placeholder action.
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="helpPage">
      <div className="helpHeaderCard">
        <h1 className="helpTitle">Help & FAQ</h1>
        <p className="helpSubtitle">
          Quick guidance for users and planners. Pick a section below.
        </p>
      </div>

      <div className="helpTwoCol">
        <div className="helpSection">
          <div className="helpSectionTitle">For Users</div>
          <p className="helpSectionIntro">
            Submitting reports, understanding hotspots, and navigating your dashboard.
          </p>

          <div className="helpFaqList">
            {userFaqs.map((f, idx) => (
              <FaqItem key={idx} q={f.q} defaultOpen={idx === 0}>
                {f.a}
              </FaqItem>
            ))}
          </div>
        </div>

        <div className="helpSection">
          <div className="helpSectionTitle">For Planners</div>
          <p className="helpSectionIntro">
            Reviewing reports, building mitigation plans, comparing scenarios, and exporting.
          </p>

          <div className="helpFaqList">
            {plannerFaqs.map((f, idx) => (
              <FaqItem key={idx} q={f.q}>
                {f.a}
              </FaqItem>
            ))}
          </div>
        </div>
      </div>

      <div className="helpFooterCard">
        <div className="helpFooterTitle">Still stuck?</div>
        <p className="helpText">
          If something looks wrong (missing data, buttons not working, etc.), it may be because the
          backend endpoints aren’t wired for that feature yet. Drop a message in your team chat with
          the page name + what you clicked.
        </p>
      </div>
    </div>
  );
}
