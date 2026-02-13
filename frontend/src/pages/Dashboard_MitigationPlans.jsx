import "./Dashboard_MitigationPlans.css"

function MitigationPlansPage() {
  return (
    <div className="mitigationCreation">
      <section className="mitigationCreationCard">
        <h2 className="mitigationCreationTitle">Mitigation Creation</h2>

        <div className="mitigationField">
          <label className="mitigationLabel">Select Zone</label>
          <div className="mitigationSelectWrap">
            <select className="mitigationSelect">
              <option>Zone ▼</option>
            </select>
          </div>
        </div>

                <div className="mitigationField">
          <label className="mitigationLabel">Intervention 1</label>
          <div className="mitigationSelectWrap">
            <select className="mitigationSelect">
              <option>Intervention ▼</option>
            </select>
          </div>
        </div>

        <div className="mitigationField">
          <label className="mitigationLabel">Intervention 2</label>
          <div className="mitigationSelectWrap">
            <select className="mitigationSelect">
              <option>Intervention ▼</option>
            </select>
          </div>
        </div>

        <div className="addIntervensionRow">
          <button className="addInterventionButton" type="button">+</button>
          <span className="addInterventionText">Add Intervention</span>
        </div>

        <div className="mitigationTable">
          <div className="mitigationTableHeader">
            <span>Intervention</span>
            <span>Cost (£)</span>
            <span>Number</span>
            <span>Impact (dB)</span>
            <span>Estimate Total Cost (£)</span>
          </div>
        </div>

        <div className="mitigationTableEmpty">
          No Interventions added yet.
        </div>

        <div className="bottomSection">
          <div className="bottomLeft">
            <div className="belowTable">
              <div className="mitigationField">
                <label className="mitigationLabel">Target Timeframe</label>
                <div className="mitigationSelectWrap">
                  <select className="mitigationSelect">
                    <option>Timeframe ▼</option>
                    <option>Short-Term</option>
                    <option>Medium-Term</option>
                    <option>Long-Term</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mitigationField">
              <label className="mitigationLabel">Status</label>
              <div className="mitigationSelectWrap">
                <select className="mitigationSelect">
                  <option>Status ▼</option>
                  <option>Draft</option>
                  <option>Planned</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="notesCard">
            <label className="mitigationLabel">Notes</label>
            <textarea className="notesInput"/>
          </div>

        </div>

        <div className="mitigationActions">
          <div className="mitigationActionsLeft">
            <button type="button" className="actionBtn">Save</button>
            <button type="button" className="actionBtn">Clear</button>
        </div>

        <div className="mitigationActionsRight">
          <button type="button" className="actionBtn actionBtnPrimary">Export</button>
        </div>
      </div>


      </section>


      <section className="mitigationPlansCard">
        <h2 className="mitigationPlansTitle">Mitigation Plans</h2>

        <div className="plansList">
          <div className="planItem">
            <div className="planDetails">
              <div className="planName">Name</div>
              <div className="planData">Saved Date:</div>
              <div className="planData">Intervention 1:</div>
              <div className="planData">Intervention 2:</div>
              <div className="planData">Intervention 3:</div>
            </div>

            <div className="plansButton">
              <button type="button" className="actionBtn actionBtnPrimary">Open</button>
              <button type="button" className="actionBtn actionBtnPrimary">Export</button>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}

export default MitigationPlansPage;