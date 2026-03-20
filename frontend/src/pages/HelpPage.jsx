import React from "react";
import "./HelpPage.css";

export default function HelpPage() {
  return (
    <div className="helpPage">
      <h1 className="helpTitle">Help &amp; FAQ</h1>
      <p className="helpSubtitle">
        Quick guidance for users and planners. Pick a section below.
      </p>

      <section className="helpSectionCard">
        <h2 className="helpSectionTitle">For Users</h2>
        <p className="helpSectionDesc">
          Submitting reports, understanding hotspots, and navigating your dashboard.
        </p>

        <div className="helpFaqList">
          <details className="helpFaqItem">
            <summary className="helpFaqSummary">
              How do I submit a noise report?
              <span className="helpFaqChevron">▼</span>
            </summary>
            <div className="helpFaqAnswer">
              Use <b>Report incident</b> in the navigation bar. Fill in noise type, date/time, severity,
              add a short description, then choose the location and submit.
            </div>
          </details>

          <details className="helpFaqItem">
            <summary className="helpFaqSummary">
              What should I put in “Severity”?
              <span className="helpFaqChevron">▼</span>
            </summary>
            <div className="helpFaqAnswer">
              Use a simple 1–10 scale: <b>1</b> = barely noticeable, <b>10</b> = extremely disruptive.
              Try to be consistent with similar situations.
            </div>
          </details>

          <details className="helpFaqItem">
            <summary className="helpFaqSummary">
              Do I need to add tags?
              <span className="helpFaqChevron">▼</span>
            </summary>
            <div className="helpFaqAnswer">
              Tags are optional, but helpful. Add a couple like <b>Traffic</b>, <b>Music</b>, <b>Crowd</b>,
              or anything that makes searching and grouping easier.
            </div>
          </details>

          <details className="helpFaqItem">
            <summary className="helpFaqSummary">
              Where can I see my reports and quick stats?
              <span className="helpFaqChevron">▼</span>
            </summary>
            <div className="helpFaqAnswer">
              Go to <b>My Dashboard</b>. You’ll see recent/filtered reports on the right and quick
              stats (24h/7d, common tags, busiest areas) in the bottom cards.
            </div>
          </details>

          <details className="helpFaqItem">
            <summary className="helpFaqSummary">
              What is a hotspot?
              <span className="helpFaqChevron">▼</span>
            </summary>
            <div className="helpFaqAnswer">
              A hotspot is an area with a higher concentration of noise reports or high noise levels.
              Hotspots help highlight where mitigation may be needed most.
            </div>
          </details>
        </div>
      </section>

      <section className="helpSectionCard">
        <h2 className="helpSectionTitle">For Planners</h2>
        <p className="helpSectionDesc">
          Reviewing reports, building mitigation plans, comparing scenarios, and exporting.
        </p>

        <div className="helpFaqList">
          <details className="helpFaqItem">
            <summary className="helpFaqSummary">
              What extra features do planners get?
              <span className="helpFaqChevron">▼</span>
            </summary>
            <div className="helpFaqAnswer">
              Planners can access the full <b>Dashboard</b> tabs for reviewing reports, creating
              mitigation plans, comparing scenarios, tracking implementations, and exports.
            </div>
          </details>

          <details className="helpFaqItem">
            <summary className="helpFaqSummary">
              How do I review and process reports?
              <span className="helpFaqChevron">▼</span>
            </summary>
            <div className="helpFaqAnswer">
              Open <b>Dashboard</b> and use the reports/processing area to accept or reject incoming
              reports. This keeps the dataset clean and improves hotspot accuracy.
            </div>
          </details>

          <details className="helpFaqItem">
            <summary className="helpFaqSummary">
              How do mitigation plans work?
              <span className="helpFaqChevron">▼</span>
            </summary>
            <div className="helpFaqAnswer">
              A mitigation plan is a set of actions for a zone (e.g. signage, barriers, routing changes).
              Plans should target the biggest sources shown by reports/tags and hotspots.
            </div>
          </details>

          <details className="helpFaqItem">
            <summary className="helpFaqSummary">
              How do I compare scenarios?
              <span className="helpFaqChevron">▼</span>
            </summary>
            <div className="helpFaqAnswer">
              Use the <b>Scenario Comparison</b> tab to compare different plan options and see which
              is likely to reduce noise the most for the affected areas.
            </div>
          </details>

          <details className="helpFaqItem">
            <summary className="helpFaqSummary">
              How do I export a report / summary?
              <span className="helpFaqChevron">▼</span>
            </summary>
            <div className="helpFaqAnswer">
              Use the export controls in the dashboard (where available). If export is not wired yet,
              note the page + what you clicked and tell the team.
            </div>
          </details>
        </div>
      </section>

      <div className="helpStillStuck">
        <h3 className="helpStillStuckTitle">Still stuck?</h3>
        <p className="helpStillStuckText">
          If something looks wrong (missing data, buttons not working, etc.), it may be because the backend
          endpoints aren’t wired for that feature yet. Drop a message in your team chat with the page name
          and what you clicked.
        </p>
      </div>
    

      <div className="helpStillStuck">
        <h3 className="helpStillStuckTitle">Contact Us</h3>
        <p className="helpStillStuckText">
            If you still require help, contact us at <strong>garbagecollectorsexeter@gmail.com</strong>  
        </p>
      </div>


      </div>
  );
}
