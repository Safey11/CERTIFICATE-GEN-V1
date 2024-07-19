import React from 'react';

const CertificateTemplate = React.forwardRef(({ student }, ref) => (
  <div
    ref={ref}
    className="certificate-container"
  >
    <div className="certificate-content">
      <h1 className="certificate-title">Certificate of Completion</h1>
      <p className="certificate-text">This is to certify that</p>
      <h2 className="student-name">{student.name}</h2>
      <p className="certificate-text">has successfully completed the course</p>
      <h3 className="student-course">{student.course}</h3>
      <p className="certificate-text">Batch: {student.batch}</p>
      <p className="certificate-text">Status: {student.status}</p>
      <div className="certificate-footer">
        <div className="left-footer">
          <p className="certificate-date">Date: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="right-footer">
          <p className="certificate-text">Signature</p>
          <div className="signature-line"></div>
        </div>
      </div>
    </div>
  </div>
));

export default CertificateTemplate;
