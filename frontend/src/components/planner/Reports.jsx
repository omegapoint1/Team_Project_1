import React from 'react';
import ReportBuilder from './Reports/ReportBuilder';
//import QuickActions from './Reports/QuickActions';
import ReportTemplates from './Reports/ReportTemplates';
import SavedReports from './Reports/SavedReports';
//import styles from './Reports.css';

function Reports() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Report Generation</h2>
        <p className={styles.description}>
          Create professional reports for stakeholders, funding proposals, and public updates
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <ReportTemplates/>
          {/*<QuickActions />*/}
          <SavedReports/>
        </div>
        <div className={styles.main}>
          <ReportBuilder/>
        </div>
      </div>
    </div>
  );
}

export default Reports;