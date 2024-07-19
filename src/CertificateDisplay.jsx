import React from 'react';
import { Typography } from 'antd';
import CertificateTemplate from './CertificateTemplate';

const { Title } = Typography;

const CertificateDisplay = ({ student }) => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ color: ' rgb(17 115 183)' }}>Generated Certificate</Title>
      <CertificateTemplate student={student}>
        <img src="https://student.saylaniwelfare.com/assets/logo-OpazD70S.png" alt="Logo" />
      </CertificateTemplate>
    </div>
  );
};

export default CertificateDisplay;
