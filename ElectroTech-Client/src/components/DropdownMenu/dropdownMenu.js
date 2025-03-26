import React, { useEffect, useState } from "react";
import { Avatar, Dropdown, Row } from "antd";
import { Menu } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import styles from "../layout/Header/header.module.css";
import userApi from "../../apis/userApi";

function DropdownAvatar() {
  const [userData, setUserData] = useState([]);
  const [isLogin, setIsLogin] = useState(false);

  let history = useHistory();

  const Logout = async () => {
    localStorage.clear();
    history.push("/");
    await userApi.logout();
    window.location.reload(false);
  };

  const Login = () => {
    history.push("/login");
  };

  const handleRouter = (link) => {
    history.push(link);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await userApi.getProfile();
        console.log(response);
        setUserData(response.user);
        const checkLogin = localStorage.getItem("client");
        if (checkLogin) {
          setIsLogin(checkLogin);
        }
      } catch (error) {
        console.log("Failed to fetch profile user:" + error);
      }
    })();
  }, []);

  const avatarPrivate = (
    <Menu>
      <Menu.Item icon={<UserOutlined />}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleRouter("/profile")}
        >
          Trang cá nhân
        </a>
      </Menu.Item>
      <Menu.Item icon={<ShoppingCartOutlined />}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleRouter("/cart-history")}
        >
          Quản lý đơn hàng
        </a>
      </Menu.Item>
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={Logout}>
        <a target="_blank" rel="noopener noreferrer">
          Thoát
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      {isLogin ? (
        <Dropdown
          key="avatar"
          placement="bottomCenter"
          overlay={avatarPrivate}
          arrow
        >
          <Row
            style={{
              paddingLeft: 5,
              paddingRight: 8,
              cursor: "pointer",
            }}
            className={styles.container}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ paddingRight: 10 }}>
                <Avatar
                  style={{
                    outline: "none",
                    marginLeft: -20,
                  }}
                  src={
                    userData
                      ? userData.image
                      : "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                  }
                />
              </div>
              <p
                style={{
                  padding: 0,
                  marginBottom: -10,
                  marginLeft: -5,
                  textTransform: "capitalize",
                  color: "#000000",
                }}
              >
                {userData?.username}
              </p>
            </div>
            {/* <p>Score: {userData.score}</p> */}
          </Row>
        </Dropdown>
      ) : (
        <span className={styles.loginSpan} onClick={Login}>
          Đăng nhập
        </span>
      )}
    </div>
  );
}

export default DropdownAvatar;
