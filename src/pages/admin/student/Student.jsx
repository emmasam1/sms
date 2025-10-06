// Student.jsx
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Select,
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Modal,
  Form,
  Descriptions,
  Typography,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

import std_img from "../../../assets/student.jpg";

const { Title } = Typography;
const { Option } = Select;

const classes = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"];
const sessions = ["2023/2024", "2024/2025", "2025/2026"];

const teacherAssigned = {
  JSS1: "Mr. Adams",
  JSS2: "Mrs. Akande",
  JSS3: "Mr. Brown",
  SS1: "Mrs. Johnson",
  SS2: "Mr. Peters",
  SS3: "Mrs. Gomez",
};

const generatePin = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const generateRegNo = () => `STU${Date.now().toString().slice(-6)}`;

const Student = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  // modal states
  const [isModalOpen, setIsModalOpen] = useState(false); // add/edit modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false); // details modal
  const [editingStudent, setEditingStudent] = useState(null);
  const [detailsStudent, setDetailsStudent] = useState(null);

  const [form] = Form.useForm();
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [progressStudent, setProgressStudent] = useState(null);

  // students state (local demo data)
  const [students, setStudents] = useState([
    {
      key: "1",
      name: "John Doe",
      regNo: "STU000001",
      class: "JSS1",
      session: "2024/2025",
      parent: {
        name: "Mr. Doe",
        phone: "08012345678",
        occupation: "Teacher",
        address: "12 Maple St, Lagos",
      },
      pin: "123456",
      admissionDate: "2023-09-01",
    },
    {
      key: "2",
      name: "Jane Smith",
      regNo: "STU000002",
      class: "SS1",
      session: "2024/2025",
      parent: {
        name: "Mrs. Smith",
        phone: "08087654321",
        occupation: "Nurse",
        address: "45 Palm Ave, Lagos",
      },
      pin: "654321",
      admissionDate: "2022-08-15",
    },
  ]);

  const openProgressModal = (student) => {
    setProgressStudent({
      ...student,
      results: [
        {
          subject: "Mathematics",
          firstTest: 15,
          secondTest: 18,
          assignment: 10,
          practical: 12,
          exam: 40,
        },
        {
          subject: "English",
          firstTest: 12,
          secondTest: 15,
          assignment: 9,
          practical: 10,
          exam: 35,
        },
      ],
    });
    setIsProgressOpen(true);
  };

  // filter logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesClass = selectedClass ? s.class === selectedClass : true;
    const matchesSession = selectedSession
      ? s.session === selectedSession
      : true;
    return matchesSearch && matchesClass && matchesSession;
  });

  // open add modal
  const openAddModal = () => {
    setEditingStudent(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // open edit modal
  const openEditModal = (student) => {
    setEditingStudent(student);
    // set form values (nested parent object)
    form.setFieldsValue({
      name: student.name,
      class: student.class,
      session: student.session,
      admissionDate: student.admissionDate,
      parent: {
        name: student.parent?.name,
        phone: student.parent?.phone,
        occupation: student.parent?.occupation,
        address: student.parent?.address,
      },
    });
    setIsModalOpen(true);
  };

  // open details modal
  const openDetails = (student) => {
    setDetailsStudent(student);
    setIsDetailsOpen(true);
  };

  // save (add or update)
  const handleSave = (values) => {
    if (editingStudent) {
      // update
      setStudents((prev) =>
        prev.map((s) =>
          s.key === editingStudent.key
            ? {
                ...s,
                name: values.name,
                class: values.class,
                session: values.session,
                admissionDate: values.admissionDate,
                parent: {
                  name: values.parent?.name || "",
                  phone: values.parent?.phone || "",
                  occupation: values.parent?.occupation || "",
                  address: values.parent?.address || "",
                },
              }
            : s
        )
      );
      message.success("Student updated");
    } else {
      // add new
      const newStudent = {
        key: Date.now().toString(),
        regNo: generateRegNo(),
        pin: generatePin(),
        name: values.name,
        class: values.class,
        session: values.session,
        admissionDate: values.admissionDate || null,
        parent: {
          name: values.parent?.name || "",
          phone: values.parent?.phone || "",
          occupation: values.parent?.occupation || "",
          address: values.parent?.address || "",
        },
      };
      setStudents((prev) => [newStudent, ...prev]);
      message.success("Student added");
    }

    setIsModalOpen(false);
    form.resetFields();
    setEditingStudent(null);
  };

  // delete student
  const handleDelete = (key) => {
    setStudents((prev) => prev.filter((s) => s.key !== key));
    message.success("Student deleted");
  };

  // table columns
  const columns = [
    {
      title: "Reg No",
      dataIndex: "regNo",
      key: "regNo",
      width: 120,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
      width: 100,
    },
    {
      title: "Session",
      dataIndex: "session",
      key: "session",
      width: 120,
    },
    {
      title: "Parent",
      dataIndex: ["parent", "name"],
      key: "parentName",
      width: 180,
      render: (text, record) => record.parent?.name || "-",
    },
    {
      title: "Actions",
      key: "action",
      width: 260,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => openDetails(record)}
          >
            Details
          </Button>

          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete student?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>

          <Button
            type="default"
            icon={<BarChartOutlined />}
            size="small"
            onClick={() => openProgressModal(record)}
            style={{
              backgroundColor: "#52c41a",
              color: "#fff",
              borderColor: "#52c41a",
            }} // AntD green
          >
            Progress
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-1/3">
          <Input
            placeholder="Search student by name"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Select
            placeholder="Select Class"
            onChange={(value) => setSelectedClass(value)}
            allowClear
            className="w-40"
            value={selectedClass}
          >
            {classes.map((c) => (
              <Option key={c} value={c}>
                {c}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Select Session"
            onChange={(value) => setSelectedSession(value)}
            allowClear
            className="w-40"
            value={selectedSession}
          >
            {sessions.map((s) => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
          </Select>

          <div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddModal}
            >
              Add Student
            </Button>
          </div>
        </div>
      </div>

      {/* Teacher assigned */}
      {selectedClass && (
        <p className="mb-3 text-gray-600">
          <span className="font-semibold">Teacher Assigned:</span>{" "}
          {teacherAssigned[selectedClass] || "Not Assigned"}
        </p>
      )}

      <Table
        columns={columns}
        dataSource={filteredStudents}
        // pagination={{ pageSize: 8 }}
        rowKey="key"
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

      {/* Add / Edit Modal */}
      <Modal
        title={editingStudent ? "Edit Student" : "Add Student"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingStudent(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          {/* STUDENT INFO */}
          <Title level={5} className="mb-2 text-center">
            Student Information
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Student Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter student name" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Admission Date" name="admissionDate">
                <Input placeholder="YYYY-MM-DD (optional)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Class"
                name="class"
                rules={[{ required: true, message: "Please select class" }]}
              >
                <Select>
                  {classes.map((c) => (
                    <Option key={c} value={c}>
                      {c}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Session"
                name="session"
                rules={[{ required: true, message: "Please select session" }]}
              >
                <Select>
                  {sessions.map((s) => (
                    <Option key={s} value={s}>
                      {s}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* PARENT INFO */}
           <Title level={5} className="mb-2 text-center">
            Parent Information
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Parent Name"
                name={["parent", "name"]}
                rules={[
                  { required: true, message: "Please enter parent name" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Parent Phone"
                name={["parent", "phone"]}
                rules={[
                  { required: true, message: "Please enter parent phone" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Parent Occupation"
                name={["parent", "occupation"]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Parent Address" name={["parent", "address"]}>
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => {
                setIsModalOpen(false);
                form.resetFields();
                setEditingStudent(null);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingStudent ? "Update" : "Save"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Details Modal */}
      <Modal
        title="Student Details"
        open={isDetailsOpen}
        onCancel={() => setIsDetailsOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailsOpen(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        <div className="w-50 h-50 mb-3">
          <img src={std_img} alt="" className="object-contain w-full h-full" />
        </div>
        {detailsStudent ? (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Reg No">
              {detailsStudent.regNo}
            </Descriptions.Item>
            <Descriptions.Item label="Name">
              {detailsStudent.name}
            </Descriptions.Item>
            <Descriptions.Item label="Class">
              {detailsStudent.class}
            </Descriptions.Item>
            <Descriptions.Item label="Session">
              {detailsStudent.session}
            </Descriptions.Item>
            <Descriptions.Item label="Admission Date">
              {detailsStudent.admissionDate || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="PIN">
              {detailsStudent.pin}
            </Descriptions.Item>

            <Descriptions.Item label="Parent Name">
              {detailsStudent.parent?.name || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Parent Phone">
              {detailsStudent.parent?.phone || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Parent Occupation">
              {detailsStudent.parent?.occupation || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Parent Address">
              {detailsStudent.parent?.address || "—"}
            </Descriptions.Item>

            <Descriptions.Item label="Class Teacher">
              {teacherAssigned[detailsStudent.class] || "—"}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>

      {/* results */}
      <Modal
        title={`Progress Report - ${progressStudent?.name}`}
        open={isProgressOpen}
        onCancel={() => setIsProgressOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsProgressOpen(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {progressStudent && (
          <Table
            dataSource={progressStudent.results.map((r, idx) => {
              const total =
                r.firstTest +
                r.secondTest +
                r.assignment +
                r.practical +
                r.exam;
              const grade =
                total >= 70
                  ? "A"
                  : total >= 60
                  ? "B"
                  : total >= 50
                  ? "C"
                  : total >= 40
                  ? "D"
                  : "F";
              return { key: idx, ...r, total, grade };
            })}
            bordered
            pagination={false}
            size="small"
            columns={[
              { title: "Subject", dataIndex: "subject", key: "subject" },
              { title: "1st Test", dataIndex: "firstTest", key: "firstTest" },
              { title: "2nd Test", dataIndex: "secondTest", key: "secondTest" },
              {
                title: "Assignment",
                dataIndex: "assignment",
                key: "assignment",
              },
              { title: "Practical", dataIndex: "practical", key: "practical" },
              { title: "Exam", dataIndex: "exam", key: "exam" },
              { title: "Total", dataIndex: "total", key: "total" },
              { title: "Grade", dataIndex: "grade", key: "grade" },
            ]}
          />
        )}
      </Modal>
    </div>
  );
};

export default Student;
