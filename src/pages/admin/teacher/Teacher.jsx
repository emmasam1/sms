import React, { useState } from "react";
import {
  Input,
  Select,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  message,
  Row,
  Col,
  Descriptions,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import teacher_img from "../../../assets/teacher.jpg";

const { Option } = Select;

const Teacher = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [form] = Form.useForm();

  const [teachers, setTeachers] = useState([
    {
      key: "1",
      name: "Mr. Adams",
      subject: "Mathematics",
      phone: "08012345678",
      email: "adams@example.com",
      username: "adams",
      address: "12 Broad Street, Lagos",
      assignedClass: "JSS1",
      status: "active",
      profileImg: "/images/teachers/adams.png", // optional profile image
      dateJoined: "2023-09-01",
    },
    {
      key: "2",
      name: "Mrs. Johnson",
      subject: "English Language",
      phone: "08087654321",
      email: "johnson@example.com",
      username: "johnson",
      address: "5 Unity Close, Abuja",
      assignedClass: "SS1",
      status: "blocked",
      profileImg: "/images/teachers/johnson.png",
      dateJoined: "2022-01-15",
    },
    {
      key: "3",
      name: "Mr. Bello",
      subject: "Biology",
      phone: "08033445566",
      email: "bello@example.com",
      username: "bello",
      address: "24 Crescent Road, Kano",
      assignedClass: "SS2",
      status: "active",
      profileImg: "/images/teachers/bello.png",
      dateJoined: "2024-05-10",
    },
  ]);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSave = (values) => {
    if (editingTeacher) {
      setTeachers((prev) =>
        prev.map((t) =>
          t.key === editingTeacher.key ? { ...editingTeacher, ...values } : t
        )
      );
      message.success("Teacher updated");
    } else {
      setTeachers((prev) => [
        ...prev,
        { key: Date.now().toString(), ...values, status: "active" },
      ]);
      message.success("Teacher registered");
    }
    setIsModalOpen(false);
    form.resetFields();
    setEditingTeacher(null);
  };

  const toggleBlock = (record) => {
    setTeachers((prev) =>
      prev.map((t) =>
        t.key === record.key
          ? { ...t, status: t.status === "active" ? "blocked" : "active" }
          : t
      )
    );
    message.info(
      `${record.name} ${
        record.status === "active" ? "blocked" : "unblocked"
      } successfully`
    );
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Subject", dataIndex: "subject", key: "subject" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Username", dataIndex: "username", key: "username" },
    {
      title: "Assigned Class",
      dataIndex: "assignedClass",
      key: "assignedClass",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "active" ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Blocked</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            // type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedTeacher(record);
              setIsDetailsOpen(true);
            }}
          >
            View
          </Button>

          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingTeacher(record);
              setIsModalOpen(true);
              form.setFieldsValue(record);
            }}
          >
            Edit
          </Button>

          <Button
            type={record.status === "active" ? "default" : "dashed"}
            size="small"
            danger={record.status === "active"}
            icon={
              record.status === "active" ? (
                <StopOutlined />
              ) : (
                <CheckCircleOutlined />
              )
            }
            onClick={() => toggleBlock(record)}
          >
            {record.status === "active" ? "Block" : "Unblock"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search by teacher name"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-sm"
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Register Teacher
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredTeachers}
        // pagination={{ pageSize: 5 }}
        bordered
        size="small"
        pagination={{
          pageSize: 7,
          position: ["bottomCenter"],
          className: "custom-pagination",
        }}
        className="custom-table"
        scroll={{ x: "max-content" }}
      />

      {/* Register/Edit Teacher Modal */}
      <Modal
        title={editingTeacher ? "Edit Teacher" : "Register Teacher"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingTeacher(null);
        }}
        footer={null}
        // width={800}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter teacher name" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Subject"
                name="subject"
                rules={[{ required: true, message: "Please select subject" }]}
              >
                <Select placeholder="Select Subject">
                  <Select.Option value="Mathematics">Mathematics</Select.Option>
                  <Select.Option value="English Language">
                    English Language
                  </Select.Option>
                  <Select.Option value="Biology">Biology</Select.Option>
                  <Select.Option value="Physics">Physics</Select.Option>
                  <Select.Option value="Chemistry">Chemistry</Select.Option>
                  <Select.Option value="Economics">Economics</Select.Option>
                  <Select.Option value="Government">Government</Select.Option>
                  <Select.Option value="Computer Science">
                    Computer Science
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: "Please enter phone" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ type: "email", message: "Enter a valid email" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please enter username" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Address" name="address">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Assign to Class" name="assignedClass">
                <Select allowClear>
                  <Option value="JSS1">JSS1</Option>
                  <Option value="JSS2">JSS2</Option>
                  <Option value="SS1">SS1</Option>
                  <Option value="SS2">SS2</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-3">
            <Button
              onClick={() => {
                setIsModalOpen(false);
                form.resetFields();
                setEditingTeacher(null);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingTeacher ? "Update" : "Register"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Teacher Details Modal */}
      <Modal
        title="Teacher Details"
        open={isDetailsOpen}
        onCancel={() => setIsDetailsOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailsOpen(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        <div className="w-40 h-40 mb-3">
          <img
            src={teacher_img}
            alt="Teacher"
            className="object-contain w-full h-full rounded-md"
          />
        </div>

        {selectedTeacher ? (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Name">
              {selectedTeacher.name}
            </Descriptions.Item>
            <Descriptions.Item label="Subject">
              {selectedTeacher.subject}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selectedTeacher.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedTeacher.email || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              {selectedTeacher.username}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {selectedTeacher.address || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Assigned Class">
              {selectedTeacher.assignedClass || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {selectedTeacher.status === "active" ? "Active" : "Blocked"}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>
    </div>
  );
};

export default Teacher;
