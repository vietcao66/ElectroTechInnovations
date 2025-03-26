import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Button, Divider, Alert, notification } from "antd";
import "./login.css"; // Use a proper naming convention for CSS files
import userApi from "../../apis/userApi";

import backgroundLogin from "../../assets/image/background-login.png";

const Login = () => {
  const [isLogin, setLogin] = useState(true);
  const history = useHistory();

  const onFinish = async (values) => {
    try {
      const response = await userApi.login(values.email, values.password);

      if (!response.status) {
        setLogin(false);
      } else if (
        response.user.role === "isAdmin" &&
        response.user.status !== "noactive"
      ) {
        history.push("/dash-board");
      } else {
        notification.error({
          message: "Thông báo",
          description: "Bạn không có quyền truy cập vào hệ thống",
        });
      }
    } catch (error) {
      console.log("Failed to fetch ping role: " + error);
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        {/* <div className="form-content-left">
          <img className="form-img" src={backgroundLogin} alt="spaceship" />
        </div> */}
        <Form
          className="login-form"
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <div className="form-header">
            <Divider orientation="center">CHÀO MỪNG BẠN ĐẾN VỚI Buym.!</Divider>
            <p className="form-subtitle">Đăng nhập để vào hệ thống quản lý</p>
          </div>
          {!isLogin && (
            <Alert
              message="Tài khoản hoặc mật khẩu sai"
              type="error"
              showIcon
            />
          )}
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button className="login-button" type="primary" htmlType="submit">
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
