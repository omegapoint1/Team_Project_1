import ReportBuilder from './Reports/ReportBuilder';
import ReportTemplates from './Reports/ReportTemplates';
import SavedReports from './Reports/SavedReports';
import './Reports.css';

function Reports() {
  return (
    <div className='container'>
      <div className='header'>
        <h2 className='title'>Report Generation</h2>
        <p className='description'>
          Create professional reports for stakeholders, funding proposals, and public updates
        </p>
      </div>

      <div className='grid'>
        <div className='sideba'>
          {/*<ReportTemplates/>*/}
          <SavedReports/>
        </div>
        <div className='main'>
          <ReportBuilder/>
        </div>
      </div>
    </div>
  );
}

export default Reports;