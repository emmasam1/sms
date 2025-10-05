import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Table,
  Tag,
  Modal,
  Form,
  Select,
  Radio,
  Upload,
  InputNumber,
  message,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  SolutionOutlined,
  FileTextOutlined,
  UploadOutlined,
  KeyOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const Dashboard = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [mode, setMode] = useState("class"); // class | individual
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form] = Form.useForm();

  const totalPins = 1240;
  const revenue = 356000;

  // Dummy subjects
  const subjects = ["Mathematics", "English", "Biology", "Chemistry"];

  // Scores state
  const [studentScores, setStudentScores] = useState(
    subjects.map((subj) => ({
      key: subj,
      subject: subj,
      firstTest: 0,
      secondTest: 0,
      assignment: 0,
      practical: 0,
      exam: 0,
      total: 0,
      average: 0,
    }))
  );

  // Dummy class/student data
  const classes = ["JSS1", "JSS2", "JSS3"];
  const students = {
    JSS1: ["John Doe", "Mary Jane", "Paul Obi"],
    JSS2: ["Tola Ahmed", "Chioma Eze"],
    JSS3: ["Kingsley Okoro", "Grace Ade"],
  };

  // Example data for the table
  const recentActivities = [
    {
      key: "1",
      action: "New Student Registered",
      actor: "Admin",
      time: "2 mins ago",
      status: "success",
    },
    {
      key: "2",
      action: "Class JSS1 Created",
      actor: "Admin",
      time: "10 mins ago",
      status: "processing",
    },
    {
      key: "3",
      action: "Result Uploaded for SS3",
      actor: "Teacher",
      time: "1 hour ago",
      status: "success",
    },
    {
      key: "4",
      action: "PIN Generated",
      actor: "Admin",
      time: "Yesterday",
      status: "warning",
    },
  ];

  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "By",
      dataIndex: "actor",
      key: "actor",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => {
        const colors = {
          success: "green",
          processing: "blue",
          warning: "orange",
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  // Utility function to calculate grade
  const getGrade = (total, maxScore = 100) => {
    const percent = (total / maxScore) * 100;

    if (percent >= 70) return "A";
    if (percent >= 60) return "B";
    if (percent >= 50) return "C";
    if (percent >= 45) return "D";
    if (percent >= 40) return "E";
    return "F";
  };

  // Handle score change
  const handleScoreChange = (key, field, value) => {
    const updatedScores = studentScores.map((row) => {
      if (row.key === key) {
        const newRow = { ...row, [field]: value || 0 };

        // Calculate total from all components
        const total =
          (newRow.firstTest || 0) +
          (newRow.secondTest || 0) +
          (newRow.assignment || 0) +
          (newRow.practical || 0) +
          (newRow.exam || 0);

        newRow.total = total;
        newRow.average = parseFloat((total / 5).toFixed(2));

        // ✅ Grade must be based on TOTAL out of 100
        newRow.grade = getGrade(total, 100);

        return newRow;
      }
      return row;
    });
    setStudentScores(updatedScores);
  };

  // Score entry table columns
  const scoreColumns = [
    { title: "Subject", dataIndex: "subject", key: "subject" },
    {
      title: "First Test",
      dataIndex: "firstTest",
      render: (_, record) => (
        <InputNumber
          min={0}
          max={20}
          value={record.firstTest}
          onChange={(val) => handleScoreChange(record.key, "firstTest", val)}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Second Test",
      dataIndex: "secondTest",
      render: (_, record) => (
        <InputNumber
          min={0}
          max={20}
          value={record.secondTest}
          onChange={(val) => handleScoreChange(record.key, "secondTest", val)}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Assignment",
      dataIndex: "assignment",
      render: (_, record) => (
        <InputNumber
          min={0}
          max={10}
          value={record.assignment}
          onChange={(val) => handleScoreChange(record.key, "assignment", val)}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Practical",
      dataIndex: "practical",
      render: (_, record) => (
        <InputNumber
          min={0}
          max={10}
          value={record.practical}
          onChange={(val) => handleScoreChange(record.key, "practical", val)}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Exam",
      dataIndex: "exam",
      render: (_, record) => (
        <InputNumber
          min={0}
          max={40}
          value={record.exam}
          onChange={(val) => handleScoreChange(record.key, "exam", val)}
          style={{ width: "100%" }}
        />
      ),
    },
    { title: "Total", dataIndex: "total", key: "total" },
    { title: "Average", dataIndex: "average", key: "average" },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      render: (grade) => {
        const colors = {
          A: "green",
          B: "blue",
          C: "orange",
          D: "volcano",
          F: "red",
        };
        return <Tag color={colors[grade]}>{grade}</Tag>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        {" "}
        {/* gutter={[horizontal, vertical]} */}
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md rounded-xl">
            <div className="flex items-center space-x-4">
              <UserOutlined className="text-3xl !text-blue-500" />
              <div>
                <p className="text-gray-500">Students</p>
                <p className="text-xl font-bold">1,245</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md rounded-xl">
            <div className="flex items-center space-x-4">
              <TeamOutlined className="text-3xl !text-green-500" />
              <div>
                <p className="text-gray-500">Teachers</p>
                <p className="text-xl font-bold">58</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md rounded-xl">
            <div className="flex items-center space-x-4">
              <BookOutlined className="text-3xl !text-purple-500" />
              <div>
                <p className="text-gray-500">Classes</p>
                <p className="text-xl font-bold">36</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md rounded-xl">
            <div className="flex items-center space-x-4">
              <KeyOutlined className="text-3xl !text-blue-500" />
              <div>
                <p className="text-gray-500">Total PINs Generated</p>
                <p className="text-xl font-bold">{totalPins}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md rounded-xl">
            <div className="flex items-center space-x-4">
              <DollarOutlined className="text-3xl !text-green-500" />
              <div>
                <p className="text-gray-500">Revenue</p>
                <p className="text-xl font-bold">₦{revenue.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="shadow-sm rounded-xl !mb-3">
        <Title level={4}>Quick Actions</Title>
        <div className="flex flex-wrap gap-3 mt-3">
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => setIsUploadOpen(true)}
          >
            Upload Result
          </Button>
          <Button type="default" icon={<KeyOutlined />}>
            Generate PIN
          </Button>
          <Button type="dashed" icon={<BookOutlined />}>
            Create Class
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-md rounded-xl">
        <Title level={4}>Recent Activity</Title>
        <Table
          columns={columns}
          dataSource={recentActivities}
          //   pagination={false}
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
      </Card>

      {/* Upload Result Modal */}
      <Modal
        title="Upload Result"
        open={isUploadOpen}
        onCancel={() => setIsUploadOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          onFinish={(values) => {
            if (mode === "class") {
              message.success(`CSV uploaded for ${values.class}`);
              setIsUploadOpen(false);
            } else {
              setSelectedStudent(values.student);
              setIsUploadOpen(false);
              setIsScoreModalOpen(true);
            }
          }}
        >
          <Form.Item label="">
            <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
              <Radio value="class">Whole Class</Radio>
              <Radio value="individual">Individual Student</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Session"
            name="session"
            rules={[{ required: true, message: "Please select session" }]}
          >
            <Select placeholder="Select Session">
              <Option value="2023/2024">2023/2024</Option>
              <Option value="2024/2025">2024/2025</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Class"
            name="class"
            rules={[{ required: true, message: "Please select class" }]}
          >
            <Select placeholder="Select Class">
              {classes.map((cls) => (
                <Option key={cls} value={cls}>
                  {cls}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {mode === "individual" && (
            <Form.Item
              label="Student"
              name="student"
              rules={[{ required: true, message: "Please select student" }]}
            >
              <Select placeholder="Select Student">
                {Object.values(students)
                  .flat()
                  .map((std) => (
                    <Option key={std} value={std}>
                      {std}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          )}

          {mode === "class" && (
            <Form.Item
              label="CSV File"
              name="file"
              rules={[{ required: true, message: "Please upload result file" }]}
            >
              <Upload beforeUpload={() => false} accept=".csv" maxCount={1}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>
          )}

          <div className="flex justify-end gap-3">
            <Button onClick={() => setIsUploadOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {mode === "class" ? "Upload" : "Next"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Individual Score Entry Modal */}
      <Modal
        title={`Enter Scores for ${selectedStudent}`}
        open={isScoreModalOpen}
        closable={false}
        onCancel={() => setIsScoreModalOpen(false)}
        onOk={() => {
          console.log("Submitted Scores:", studentScores);
          message.success(`Scores saved for ${selectedStudent}`);
          setIsScoreModalOpen(false);
        }}
        width={900}
      >
        <Table
          columns={scoreColumns}
          dataSource={studentScores}
          pagination={false}
          rowKey="key"
          size="small"
          bordered
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
