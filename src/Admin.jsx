  import React, { useContext, useState, useRef } from 'react';
  import { Table, Button, Modal, Form, Input, Space, Typography, Row, Col, message } from 'antd';
  import { PlusOutlined, FileDoneOutlined, DownloadOutlined } from '@ant-design/icons';
  import { StudentContext } from './StudentContext';
  import * as XLSX from 'xlsx';
  import jsPDF from 'jspdf';
  import html2canvas from 'html2canvas';
  import CertificateTemplate from './CertificateTemplate'; // Import the certificate template component
  import './Admin.css'; // Import the CSS file

  const { Title } = Typography;

  const Admin = () => {
    const { students, addStudent, updateStudent } = useContext(StudentContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const certificateRef = useRef();

    const showModal = (student = null) => {
      setEditingStudent(student);
      setIsModalVisible(true);
    };

    const handleAddEdit = async (values) => {
      try {
        setLoading(true);
        if (editingStudent) {
          await updateStudent({ ...editingStudent, ...values });
          message.success('Student updated successfully');
        } else {
          await addStudent({ ...values, student_id: Date.now().toString() });
          message.success('Student added successfully');
        }
        setIsModalVisible(false);
        setEditingStudent(null);
      } catch (error) {
        message.error('Failed to perform action');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleGenerateCertificate = async (student_id) => {
      const student = students.find((s) => s.student_id === student_id);
      setSelectedStudent(student);
      setTimeout(() => generatePDF(student), 100);
    };

    const generatePDF = async (student) => {
      try {
        const input = certificateRef.current;
        console.log('Certificate Ref:', input);
    
        if (!input) {
          throw new Error('Certificate template not found');
        }
    
        const canvas = await html2canvas(input);
        console.log('Canvas:', canvas);
    
        if (!canvas) {
          throw new Error('Failed to create canvas');
        }
    
        const imgData = canvas.toDataURL('image/png');
    
        // Adjust PDF dimensions to fit content
        const pdfWidth = canvas.width * 0.75; // Adjust multiplier as needed
        const pdfHeight = canvas.height * 0.75; // Adjust multiplier as needed
    
        const pdf = new jsPDF('landscape', 'px', [pdfWidth, pdfHeight]);
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${student.name}_certificate.pdf`);
        message.success('Certificate generated successfully');
      } catch (error) {
        message.error('Failed to generate certificate');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    

    const exportToExcel = () => {
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const formattedData = students.map(({ student_id, name, course, batch, status }) => ({
        'Student ID': student_id,
        'Name': name,
        'Course': course,
        'Batch': batch,
        'Status': status,
      }));
      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      const fileName = 'student_list' + fileExtension;
      const href = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = href;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(href);
      }, 100);
    };

    const columns = [
      { title: 'Student ID', dataIndex: 'student_id', key: 'student_id' },
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Course', dataIndex: 'course', key: 'course' },
      { title: 'Batch', dataIndex: 'batch', key: 'batch' },
      { title: 'Status', dataIndex: 'status', key: 'status' },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space size="middle">
            <Button icon={<FileDoneOutlined />} onClick={() => handleGenerateCertificate(record.student_id)}>
              Certificate
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <div style={{ padding: '24px' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
          <Col>
            <Title level={2} style={{ color: ' rgb(17 115 183)' }}>Admin Panel</Title>
          </Col>
          <Col>
            <Space>
              <Button type="primary" className="custom-button" icon={<PlusOutlined />} onClick={() => showModal()}>
                Add Student
              </Button>
              <Button className="custom-button" icon={<DownloadOutlined />} onClick={exportToExcel}>
                Export to Excel
              </Button>
            </Space>
          </Col>
        </Row>
        <Table dataSource={students} rowKey="student_id" columns={columns} />
        <Modal
          title={editingStudent ? 'Edit Student' : 'Add Student'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form initialValues={editingStudent} onFinish={handleAddEdit} layout="vertical">
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
              <Input placeholder="Enter student name" />
            </Form.Item>
            <Form.Item name="course" label="Course" rules={[{ required: true, message: 'Please input the course!' }]}>
              <Input placeholder="Enter course name" />
            </Form.Item>
            <Form.Item name="batch" label="Batch" rules={[{ required: true, message: 'Please input the batch!' }]}>
              <Input placeholder="Enter batch number" />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please input the status!' }]}>
              <Input placeholder="Enter status" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingStudent ? 'Save' : 'Add'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <div style={{ display: selectedStudent ? 'block' : 'none' }}>
          {selectedStudent && (
            <CertificateTemplate ref={certificateRef} student={selectedStudent}>
              <img src="https://student.saylaniwelfare.com/assets/logo-OpazD70S.png" alt="Logo" />
            </CertificateTemplate>
          )}
        </div>
      </div>
    );
  };

  export default Admin;