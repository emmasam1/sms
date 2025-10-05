import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Form, Input, Button, Tabs, message } from "antd";
import { useNavigate } from "react-router";

const Login = () => {
  const [activeTab, setActiveTab] = useState("adminTeacher");
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Form values:", values);

    // Dummy role check (replace with API response later)
    if (activeTab === "adminTeacher") {
      if (values.username === "admin" && values.password === "1234") {
        message.success("Admin login successful!");
        navigate("/admin/dashboard");
      } else if (values.username === "teacher" && values.password === "1234") {
        message.success("Teacher login successful!");
        navigate("/teacher/dashboard");
      } else {
        message.error("Invalid credentials");
      }
    }

    if (activeTab === "parent") {
      if (values.pin === "123456") {
        message.success("Parent login successful!");
        navigate("/home");
      } else {
        message.error("Invalid parent PIN");
      }
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-light px-4">
      <motion.div
        className="bg-white shadow-lg rounded-xl w-full max-w-sm p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-neutral-dark">
          School Management System
        </h1>

        <Tabs
          defaultActiveKey="adminTeacher"
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          centered
          items={[
            { key: "adminTeacher", label: "Staff Login" },
            { key: "parent", label: "Parent Login" },
          ]}
        />

        <div className="mt-4">
          <AnimatePresence mode="wait">
            {activeTab === "adminTeacher" && (
              <motion.div
                key="adminTeacher"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Form layout="vertical" onFinish={onFinish}>
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: "Please enter username" }]}
                  >
                    <Input placeholder="Enter your username" />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please enter password" }]}
                  >
                    <Input.Password placeholder="Enter your password" />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    className="!bg-secondary !hover:!bg-secondary-dark !border-none !rounded-md"
                  >
                    Login
                  </Button>
                </Form>
              </motion.div>
            )}

            {activeTab === "parent" && (
              <motion.div
                key="parent"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Form layout="vertical" onFinish={onFinish}>
                  <Form.Item
                    label="Card PIN"
                    name="pin"
                    rules={[{ required: true, message: "Please enter your Card PIN" }]}
                  >
                    <Input.Password placeholder="Enter your PIN" maxLength={6} />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    className="!bg-primary !hover:!bg-primary-dark !border-none !rounded-md"
                  >
                    Parent Login
                  </Button>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
