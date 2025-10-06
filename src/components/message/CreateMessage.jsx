import { useState } from "react";
import { Form, Input, Select, Button, Modal, Space, message } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const CreateMessage = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const recipients = [
    { id: "all", name: "All Teachers" },
    { id: "teacher1", name: "Mr. John Doe" },
    { id: "teacher2", name: "Ms. Jane Smith" },
    { id: "teacher3", name: "Mr. Samuel Okon" },
  ];

  const handleSend = async (values) => {
    setLoading(true);
    try {
      // Example: send data to your API
      console.log("Message sent:", values);
      message.success("Message sent successfully!");

      // ✅ Clear form after successful send
      form.resetFields();

      // ✅ Close modal
      onClose();
    } catch (error) {
      message.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // ✅ Reset form when cancel is clicked
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Send Message"
      open={open}
      onCancel={handleCancel} // ✅ use custom handler
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
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Send Message
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateMessage;
