import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Table,
  message,
  Modal,
  Space,
  Popconfirm,
} from "antd";
import {
  SendOutlined,
  MessageOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const AdminMessage = () => {
  const [form] = Form.useForm();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);

  // Dummy recipients (replace with API later)
  const recipients = [
    { id: "all", name: "All Teachers" },
    { id: "teacher1", name: "Mr. John Doe" },
    { id: "teacher2", name: "Ms. Jane Smith" },
    { id: "teacher3", name: "Mr. Samuel Okon" },
  ];

  // Handle send / edit
  const handleSend = (values) => {
    setLoading(true);
    setTimeout(() => {
      if (editingMessage) {
        // Update existing
        setMessages((prev) =>
          prev.map((msg) =>
            msg.key === editingMessage.key
              ? {
                  ...msg,
                  title: values.title,
                  content: values.content,
                  recipient:
                    values.recipient === "all"
                      ? "All Users"
                      : recipients.find((r) => r.id === values.recipient)?.name,
                  date: new Date().toLocaleString(),
                }
              : msg
          )
        );
        message.success("Message updated successfully!");
      } else {
        // Add new
        setMessages((prev) => [
          {
            key: Date.now(),
            title: values.title,
            content: values.content,
            recipient:
              values.recipient === "all"
                ? "All Users"
                : recipients.find((r) => r.id === values.recipient)?.name,
            date: new Date().toLocaleString(),
          },
          ...prev,
        ]);
        message.success("Message sent successfully!");
      }

      setLoading(false);
      form.resetFields();
      setModalVisible(false);
      setEditingMessage(null);
    }, 800);
  };

  const handleEdit = (record) => {
    setEditingMessage(record);
    form.setFieldsValue({
      title: record.title,
      content: record.content,
      recipient:
        recipients.find((r) => r.name === record.recipient)?.id || "all",
    });
    setModalVisible(true);
  };

  const handleDelete = (key) => {
    setMessages((prev) => prev.filter((msg) => msg.key !== key));
    message.success("Message deleted successfully!");
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Recipient", dataIndex: "recipient", key: "recipient" },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render: (text) => (text.length > 50 ? text.slice(0, 50) + "..." : text),
    },
    { title: "Date Sent", dataIndex: "date", key: "date" },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete this message?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title={
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <MessageOutlined className="text-purple-500" /> Sent Messages
            </span>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                setEditingMessage(null);
                form.resetFields();
                setModalVisible(true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              New Message
            </Button>
          </div>
        }
        className="shadow-md rounded-2xl"
      >
        <Table
          columns={columns}
          dataSource={messages}
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

      {/* Modal for Send/Edit */}
      <Modal
        title={
          <span className="flex items-center gap-2">
            <SendOutlined className="text-blue-500" />
            {editingMessage ? "Edit Message" : "Send Message"}
          </span>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        centered
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleSend}>
          <Form.Item
            name="recipient"
            label="Recipient"
            rules={[{ required: true, message: "Please select recipient" }]}
          >
            <Select placeholder="Select recipient">
              {recipients.map((r) => (
                <Option key={r.id} value={r.id}>
                  {r.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="Message Title"
            rules={[{ required: true, message: "Please enter message title" }]}
          >
            <Input placeholder="Enter message title" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Message Content"
            rules={[{ required: true, message: "Please enter message content" }]}
          >
            <TextArea rows={5} placeholder="Write your message here..." />
          </Form.Item>

          <Form.Item className="text-right">
            <Space>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editingMessage ? "Update Message" : "Send Message"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminMessage;
