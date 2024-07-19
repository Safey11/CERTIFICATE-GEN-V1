import React, { useState, useContext } from 'react';
import { Table, Button, Modal, Form, Input, Space, Typography, Row, Col, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { StudentContext } from './StudentContext';

const { Title } = Typography;
const { Search } = Input;

const Students = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useContext(StudentContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleDelete = async (student_id) => {
    try {
      setLoading(true);
      await deleteStudent(student_id);
      message.success('Student deleted successfully');
    } catch (error) {
      message.error('Failed to delete student');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value.toLowerCase().trim());
  };
  
  const filteredData = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery) ||
    student.student_id.toLowerCase().includes(searchQuery) ||
    student.batch.toLowerCase().includes(searchQuery) ||
    student.course.toLowerCase().includes(searchQuery)
  );
  
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
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.student_id)} loading={loading}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2} style={{ color: ' rgb(17 115 183)' }}>Students</Title>
        </Col>
        <Col>
          <Space>
            <Button type="primary" className="custom-button" icon={<PlusOutlined />} onClick={() => showModal()}>
              Add Student
            </Button>
            <Search
              placeholder="Search students"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
          </Space>
        </Col>
      </Row>
      <Table dataSource={filteredData} rowKey="student_id" columns={columns} />
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
    </div>
  );
};

export default Students;
