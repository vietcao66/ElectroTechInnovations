import React, { useState, useEffect } from "react";
import "./orderList.css";
import {
  Col,
  Row,
  Typography,
  Spin,
  Button,
  Card,
  Badge,
  Empty,
  Input,
  Space,
  Form,
  Pagination,
  Modal,
  Popconfirm,
  notification,
  BackTop,
  Tag,
  Breadcrumb,
  Select,
  Table,
} from "antd";
import {
  AppstoreAddOutlined,
  QrcodeOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  HomeOutlined,
  HistoryOutlined,
  ShoppingCartOutlined,
  FormOutlined,
  TagOutlined,
  EditOutlined,
} from "@ant-design/icons";
import eventApi from "../../apis/eventApi";
import orderApi from "../../apis/orderApi";
import { useHistory } from "react-router-dom";
import { DateTime } from "../../utils/dateTime";
import ProductList from "../ProductList/productList";
import axiosClient from "../../apis/axiosClient";
import { PageHeader } from "@ant-design/pro-layout";
const { Option } = Select;
const { confirm } = Modal;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";
const { Title } = Typography;

const OrderList = () => {
  const [order, setOrder] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [total, setTotalList] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [id, setId] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const [pageSize, setPageSize] = useState(10); // Default page size is 10

  const history = useHistory();

  const showModal = () => {
    setOpenModalCreate(true);
  };

  const handleOkUser = async (values) => {
    setLoading(true);
    try {
      const categoryList = {
        name: values.name,
        description: values.description,
        slug: values.slug,
      };
      await axiosClient.post("/category", categoryList).then((response) => {
        if (response === undefined) {
          notification["error"]({
            message: `Thông báo`,
            description: "Tạo danh mục thất bại",
          });
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Tạo danh mục thành công",
          });
          setOpenModalCreate(false);
          handleCategoryList();
        }
      });
      setLoading(false);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateOrder = async (values) => {
    console.log(values);
    setLoading(true);
    try {
      const categoryList = {
        description: values.description,
        status: values.status,
      };
      await axiosClient.put("/order/" + id, categoryList).then((response) => {
        if (response === undefined) {
          notification["error"]({
            message: `Thông báo`,
            description: "Cập nhật thất bại",
          });
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Cập nhật thành công",
          });
          setOpenModalUpdate(false);
          handleCategoryList();
        }
      });
      setLoading(false);
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = (type) => {
    if (type === "create") {
      setOpenModalCreate(false);
    } else {
      setOpenModalUpdate(false);
    }
    console.log("Clicked cancel button");
  };
  // them ham nay 4/4/2025
  const calculateTotalAmount = (orders) => {
    console.log("Orders received:", orders); // Debug log
    const total = orders.reduce((sum, order) => {
      console.log("Current order:", {
        orderTotal: order.orderTotal,
        currentSum: sum,
        newSum: sum + (order.orderTotal || 0),
      });
      return sum + (order.orderTotal || 0);
    }, 0);
    console.log("Final total:", total); // Debug log
    setTotalAmount(total);
  };

  const handleCategoryList = async () => {
    try {
      await orderApi.getListOrder({ page: 1, limit: 10000 }).then((res) => {
        setTotalList(res.totalDocs);
        // Sắp xếp đơn hàng trước khi set state
        const sortedOrders = res.data.docs.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setOrder(sortedOrders);
        calculateTotalAmount(sortedOrders);
        setLoading(false);
      });
    } catch (error) {
      console.log("Failed to fetch event list:" + error);
    }
  };

  const handleDeleteCategory = async (id) => {
    setLoading(true);
    try {
      await orderApi.deleteOrder(id).then((response) => {
        if (response === undefined) {
          notification["error"]({
            message: `Thông báo`,
            description: "Xóa danh mục thất bại",
          });
          setLoading(false);
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Xóa danh mục thành công",
          });
          setCurrentPage(1);
          handleCategoryList();
          setLoading(false);
        }
      });
    } catch (error) {
      console.log("Failed to fetch event list:" + error);
    }
  };

  const handleDetailView = (id) => {
    history.push("/category-detail/" + id);
  };

  const handleEditOrder = (id) => {
    setOpenModalUpdate(true);
    (async () => {
      try {
        const response = await orderApi.getDetailOrder(id);
        console.log(response);
        setId(id);
        form2.setFieldsValue({
          status: response.status,
          address: response.address,
          description: response.description,
          orderTotal: response.orderTotal,
          products: response.products,
          user: response.user,
          billing: response.billing,
        });
        console.log(form2);
        setLoading(false);
      } catch (error) {
        throw error;
      }
    })();
  };

  // Combine search functionality into one function
  const handleCombinedSearch = (e) => {
    const searchText = e.target.value.toLowerCase().trim();

    if (searchText === "") {
      handleCategoryList(); // Reset to show all orders
      return;
    }

    try {
      const filteredOrders = order.filter((item) => {
        // Search by order ID
        const orderId = item._id.toLowerCase();
        // Search by username
        const username = item.user?.username?.toLowerCase() || "";

        // Return true if either matches
        return orderId.includes(searchText) || username.includes(searchText);
      });

      // Sắp xếp kết quả tìm kiếm
      const sortedFilteredOrders = filteredOrders.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setOrder(sortedFilteredOrders);

      // Show notification if no results found
      // if (sortedFilteredOrders.length === 0) {
      //   notification.info({
      //     message: "Thông báo",
      //     description: "Không tìm thấy kết quả phù hợp",
      //     duration: 1,
      //   });
      // }
    } catch (error) {
      console.log("Error searching:", error);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi tìm kiếm",
        duration: 3,
      });
    }
  };

  function NoData() {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },

    {
      title: "Tên",
      dataIndex: "user",
      key: "user",
      //   render: (text, record) => <a>{text.username}</a>,
      render: (text) => {
        // Add null check and provide default value
        return <a>{text?.username || "Không có tên"}</a>;
      },
    },
    {
      title: "Email",
      dataIndex: "user",
      key: "user",
      //   render: (text, record) => <a>{text.email}</a>,
      render: (text) => {
        // Add null check and provide default value
        return <a>{text?.email || "Không có tên"}</a>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "orderTotal",
      key: "orderTotal",
      render: (text) => (
        <a>
          {text?.toLocaleString("vi", { style: "currency", currency: "VND" })}
        </a>
      ),
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
      render: (text) => <span>{text || "N/A"}</span>,
      width: 200,
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "billing",
      key: "billing",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (slugs) => (
        <span>
          {slugs === "rejected" ? (
            <Tag style={{ width: 95, textAlign: "center" }} color="red">
              Đã hủy
            </Tag>
          ) : slugs === "approved" ? (
            <Tag
              style={{ width: 95, textAlign: "center" }}
              color="geekblue"
              key={slugs}
            >
              Vận chuyển
            </Tag>
          ) : slugs === "final" ? (
            <Tag color="green" style={{ width: 95, textAlign: "center" }}>
              Đã giao
            </Tag>
          ) : (
            <Tag color="blue" style={{ width: 95, textAlign: "center" }}>
              Đợi xác nhận
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Row>
            <div
              style={{ display: "flex", gap: "10px", flexDirection: "column" }}
            >
              <Button
                size="small"
                icon={<EyeOutlined />}
                style={{ width: 150, borderRadius: 15, height: 30 }}
                onClick={() => handleViewOrder(record._id)}
              >
                Xem
              </Button>
              <Button
                size="small"
                icon={<EditOutlined />}
                style={{ width: 150, borderRadius: 15, height: 30 }}
                onClick={() => handleEditOrder(record._id)}
              >
                Chỉnh sửa
              </Button>
              <Popconfirm
                title="Bạn có chắc chắn xóa đơn hàng này?"
                onConfirm={() => handleDeleteCategory(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  style={{ width: 150, borderRadius: 15, height: 30 }}
                >
                  Xóa
                </Button>
              </Popconfirm>
            </div>
          </Row>
        </div>
      ),
    },
  ];

  const handleViewOrder = (orderId) => {
    history.push(`/order-details/${orderId}`);
  };

  useEffect(() => {
    (async () => {
      try {
        await orderApi.getListOrder({ page: 1, limit: 10000 }).then((res) => {
          console.log("Initial load response:", res);
          setTotalList(res.totalDocs);
          // Sắp xếp đơn hàng trước khi set state
          const sortedOrders = res.data.docs.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setOrder(sortedOrders);
          calculateTotalAmount(sortedOrders);
          setLoading(false);
        });
      } catch (error) {
        console.log("Failed to fetch event list:" + error);
      }
    })();
  }, []);
  return (
    <div>
      <Spin spinning={loading}>
        <div className="container">
          <div style={{ marginTop: 20 }}>
            <Breadcrumb>
              <Breadcrumb.Item href="">
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item href="">
                <ShoppingCartOutlined />
                <span>Quản lý đơn hàng </span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div style={{ marginTop: 20 }}>
            <div id="my__event_container__list">
              <PageHeader subTitle="" style={{ fontSize: 14 }}>
                <Row>
                  <Col span="18">
                    <Input
                      placeholder="Tìm kiếm...."
                      allowClear
                      onChange={handleCombinedSearch}
                      style={{ width: 300 }}
                      prefix={<SearchOutlined />}
                    />
                  </Col>
                  <Col span="6">
                    <Row justify="end">
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#1890ff",
                        }}
                      >
                        Tổng doanh thu:{" "}
                        {totalAmount?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </div>
                    </Row>
                  </Col>
                </Row>
              </PageHeader>
            </div>
          </div>

          <div style={{ marginTop: 30 }}>
            <Table
              columns={columns}
              dataSource={order}
              pagination={{
                position: ["bottomCenter"],
                current: currentPage,
                pageSize: pageSize,
                total: order.length,
                onChange: (page, pageSize) => {
                  setCurrentPage(page);
                  setPageSize(pageSize);
                },
              }}
              scroll={{ x: 1500 }}
            />
          </div>
        </div>

        <Modal
          title="Tạo danh mục mới"
          visible={openModalCreate}
          style={{ top: 100 }}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                handleOkUser(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          onCancel={() => handleCancel("create")}
          okText="Hoàn thành"
          cancelText="Hủy"
          width={600}
        >
          <Form
            form={form}
            name="eventCreate"
            layout="vertical"
            initialValues={{
              residence: ["zhejiang", "hangzhou", "xihu"],
              prefix: "86",
            }}
            scrollToFirstError
          >
            <Form.Item
              name="name"
              label="Tên"
              rules={[
                {
                  required: true,
                  message: "Please input your sender name!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Tên" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[
                {
                  required: true,
                  message: "Please input your subject!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Mô tả" />
            </Form.Item>

            <Form.Item
              name="slug"
              label="Slug"
              rules={[
                {
                  required: true,
                  message: "Please input your content!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Slug" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Cập nhật đơn hàng"
          visible={openModalUpdate}
          style={{ top: 100 }}
          onOk={() => {
            form2
              .validateFields()
              .then((values) => {
                form2.resetFields();
                handleUpdateOrder(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          onCancel={handleCancel}
          okText="Hoàn thành"
          cancelText="Hủy"
          width={600}
        >
          <Form
            form={form2}
            name="eventCreate"
            layout="vertical"
            initialValues={{
              residence: ["zhejiang", "hangzhou", "xihu"],
              prefix: "86",
            }}
            scrollToFirstError
          >
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[
                {
                  required: true,
                  message: "Please input your sender name!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Select>
                <Option value="final">Đã giao</Option>
                <Option value="approved">Đang vận chuyển</Option>
                <Option value="pending">Đợi xác nhận</Option>
                <Option value="rejected">Đã hủy</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
              style={{ marginBottom: 10 }}
            >
              <Input.TextArea rows={4} placeholder="Lưu ý" />
            </Form.Item>
          </Form>
        </Modal>

        {/* <Pagination style={{ textAlign: "center", marginBottom: 20 }} current={currentPage} defaultCurrent={1} total={total} onChange={handlePage}></Pagination> */}
        <BackTop style={{ textAlign: "right" }} />
      </Spin>
    </div>
  );
};

export default OrderList;
