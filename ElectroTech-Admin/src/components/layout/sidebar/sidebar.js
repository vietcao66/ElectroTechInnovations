import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { Layout, Menu } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import {
  UserOutlined,
  ContainerOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  BgColorsOutlined,
  ShoppingOutlined,
  AuditOutlined,
  ShoppingCartOutlined,
  FormOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;
const { Sider } = Layout;

function Sidebar() {
  const history = useHistory();
  const location = useLocation();

  const menuSidebarAdmin = [
    {
      key: "dash-board",
      title: "Dashboards",
      link: "/dash-board",
      icon: <DashboardOutlined />,
    },
    {
      key: "account-management",
      title: "Quản Lý Tài Khoản",
      link: "/account-management",
      icon: <UserOutlined />,
    },
    {
      key: "product-list",
      title: "Danh sách sản phẩm",
      link: "/product-list",
      icon: <FormOutlined />,
    },
    {
      key: "category-list",
      title: "Danh mục sản phẩm",
      link: "/category-list",
      icon: <ShoppingOutlined />,
    },
    {
      key: "order-list",
      title: "Quản lý đơn hàng",
      link: "/order-list",
      icon: <ShoppingCartOutlined />,
    },
    {
      key: "inventory",
      title: "Quản lý kho hàng",
      link: "/inventory",
      icon: <DatabaseOutlined />,
    },
    {
      key: "supplier",
      title: "Nhà cung cấp",
      link: "/supplier",
      icon: <ContainerOutlined />,
    },
  ];

  const navigate = (link, key) => {
    history.push(link);
  };

  useEffect(() => {});

  return (
    <Sider
      className={"ant-layout-sider-trigger"}
      width={215}
      style={{
        position: "fixed",
        top: 55,
        height: "100%",
        left: 0,
        padding: 0,
        zIndex: 1,
        marginTop: 0,
        boxShadow: " 0 1px 4px -1px rgb(0 0 0 / 15%)",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={location.pathname.split("/")}
        defaultOpenKeys={["account"]}
        style={{ height: "100%", borderRight: 0, backgroundColor: "#FFFFFF" }}
        theme="light"
      >
        {menuSidebarAdmin.map((map) => (
          <Menu.Item
            onClick={() => navigate(map.link, map.key)}
            key={map.key}
            icon={map.icon}
            className="customeClass"
          >
            {map.title}
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
}

export default Sidebar;
