import React, { useState, useEffect } from "react";
import "./dashBoard.css";
import {
  Col,
  Row,
  Typography,
  Spin,
  Button,
  PageHeader,
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
  DashboardOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  HomeOutlined,
  ShopTwoTone,
  ContactsTwoTone,
  HddTwoTone,
  ShoppingTwoTone,
  DollarTwoTone,
  EditOutlined,
} from "@ant-design/icons";
import statisticApi from "../../apis/statistic";
import { useHistory } from "react-router-dom";
import { DateTime } from "../../utils/dateTime";
import axiosClient from "../../apis/axiosClient";
import orderApi from "../../apis/orderApi";

import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from "recharts";

const { confirm } = Modal;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";
const { Title } = Typography;

const DashBoard = () => {
  const [order, setOrder] = useState([]);
  const [statisticList, setStatisticList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotalList] = useState();
  const [data, setData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [dailyData, setDailyData] = useState(null); // Add new state for daily data
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4); // Default to 4 items per page

  const history = useHistory();

  function NoData() {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
      width: 60,
    },
    {
      title: "Tên",
      dataIndex: "user",
      key: "user",
      render: (text) => {
        // Add null check and provide default value
        return <a>{text?.username || "Name"}</a>;
      },
    },
    {
      title: "Email",
      dataIndex: "user",
      key: "user",
      render: (text) => {
        // Add null check and provide default value
        return <a>{text?.email || "email"}</a>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "orderTotal",
      key: "orderTotal",
      render: (text) => (
        <a>
          {Number(text).toLocaleString("vi", {
            style: "currency",
            currency: "VND",
          })}
        </a>
      ),
    },

    {
      title: "Thanh toán",
      dataIndex: "billing",
      key: "billing",
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (slugs) => (
        <span>
          <Tag color="geekblue" key={slugs}>
            {slugs?.toUpperCase()}
          </Tag>
        </span>
      ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const getWeeklyStats = (orders) => {
    const weeks = {};
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Get the first day of current month
    const firstDay = new Date(currentYear, currentMonth, 1);
    // Get the last day of current month
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Initialize 4 weeks of the current month
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(
        firstDay.getTime() + i * 7 * 24 * 60 * 60 * 1000
      );
      const weekKey = `Tuần ${i + 1}`;
      weeks[weekKey] = {
        name: weekKey,
        Total: 0,
        Revenue: 0,
        start: weekStart,
        end: new Date(
          Math.min(
            weekStart.getTime() + 6 * 24 * 60 * 60 * 1000,
            lastDay.getTime()
          )
        ),
      };
    }

    // Process orders
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);

      // Only process orders from current month
      if (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      ) {
        // Determine which week the order belongs to
        const dayOfMonth = orderDate.getDate();
        const weekNumber = Math.ceil(dayOfMonth / 7);
        const weekKey = `Tuần ${weekNumber}`;

        if (weeks[weekKey]) {
          weeks[weekKey].Total += 1;
          weeks[weekKey].Revenue += Number(order.orderTotal) || 0;
        }
      }
    });

    // Convert to array and sort by week number
    return Object.entries(weeks)
      .sort((a, b) => {
        const weekA = parseInt(a[0].replace("Tuần ", ""));
        const weekB = parseInt(b[0].replace("Tuần ", ""));
        return weekA - weekB;
      })
      .map(([_, value]) => ({
        name: value.name,
        Total: value.Total,
        Revenue: value.Revenue,
      }));
  };

  const getMonthlyStats = (orders) => {
    const months = {};
    const now = new Date();
    const currentYear = now.getFullYear();

    // Initialize all 12 months
    for (let i = 0; i < 12; i++) {
      const monthName = new Date(currentYear, i, 1).toLocaleString("vi-VN", {
        month: "long",
      });
      months[i] = {
        name: monthName,
        Total: 0,
        Revenue: 0,
      };
    }

    // Process orders
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      if (orderDate.getFullYear() === currentYear) {
        const month = orderDate.getMonth();
        months[month].Total += 1;
        months[month].Revenue += Number(order.orderTotal) || 0;
      }
    });

    return Object.values(months);
  };

  // Add this function to process daily data
  const getDailyStats = (orders) => {
    const days = {};
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    // Create array of weekday names in desired order
    const weekDays = [
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
      "Chủ Nhật",
    ];

    // Get current weekday (0 = Sunday, 1 = Monday, etc)
    const currentWeekDay = now.getDay();

    // Calculate days to Monday (if today is Sunday, we need to go back 6 days)
    const daysToMonday = currentWeekDay === 0 ? 6 : currentWeekDay - 1;

    // Get Monday's date
    const monday = new Date(now - daysToMonday * oneDay);

    // Initialize data for each day of the week
    weekDays.forEach((dayName, index) => {
      const date = new Date(monday.getTime() + index * oneDay);
      days[index] = {
        name: dayName,
        Total: 0,
        Revenue: 0,
        date: date,
      };
    });

    // Process orders
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      // Get day of week (0 = Sunday)
      let dayIndex = orderDate.getDay();
      // Convert to our index (0 = Monday, 6 = Sunday)
      dayIndex = dayIndex === 0 ? 6 : dayIndex - 1;

      // Only count orders from this week
      if (orderDate >= monday && orderDate <= now) {
        days[dayIndex].Total += 1;
        days[dayIndex].Revenue += Number(order.orderTotal) || 0;
      }
    });

    return Object.values(days);
  };

  useEffect(() => {
    (async () => {
      try {
        const orderResponse = await orderApi.getListOrder({
          page: 1,
          limit: 10000,
        });

        // Process weekly and monthly statistics
        const weeklyData = getWeeklyStats(orderResponse.data.docs);
        const monthlyData = getMonthlyStats(orderResponse.data.docs);
        const dailyData = getDailyStats(orderResponse.data.docs); // Add daily statistics processing
        setData(weeklyData);
        setMonthlyData(monthlyData);
        setDailyData(dailyData);

        // Sort orders by creation date (newest first)
        const sortedOrders = orderResponse.data.docs.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // Take only the 6 most recent orders
        const recentOrders = sortedOrders.slice(0, 8);

        // Update the table data with sorted orders
        setOrder(recentOrders);

        // Calculate total revenue from orders
        const totalRevenue = orderResponse.data.docs.reduce((sum, order) => {
          return sum + (Number(order.orderTotal) || 0);
        }, 0);
        console.log("Calculated Total Revenue:", totalRevenue);

        // Get statistics
        const statsResponse = await statisticApi.getTotal();
        console.log("Stats:", statsResponse);

        setStatisticList({
          ...statsResponse.data,
          totalRevenue: totalRevenue,
        });

        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch data:", error);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <Spin spinning={false}>
        <div className="container">
          <div style={{ marginTop: 20 }}>
            <Breadcrumb>
              <Breadcrumb.Item href="">
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item href="">
                <DashboardOutlined />
                <span>DashBoard</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <Row gutter={[12, 12]} style={{ marginTop: 20 }}>
            <Col span={6}>
              <Card className="card_total" bordered={false}>
                <div className="card_number">
                  <div>
                    <div className="number_total">
                      {statisticList?.userTotal}
                    </div>
                    <div className="title_total">Số thành viên</div>
                  </div>
                  <div>
                    <ContactsTwoTone style={{ fontSize: 48 }} />
                  </div>
                </div>
              </Card>
            </Col>

            <Col span={6}>
              <Card className="card_total" bordered={false}>
                <div className="card_number">
                  <div>
                    <div className="number_total">
                      {statisticList?.productTotal}
                    </div>
                    <div className="title_total">Số sản phẩm</div>
                  </div>
                  <div>
                    <ShopTwoTone style={{ fontSize: 48 }} />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="card_total" bordered={false}>
                <div className="card_number">
                  <div>
                    <div className="number_total">
                      {statisticList?.categoryTotal}
                    </div>
                    <div className="title_total">Số danh mục</div>
                  </div>
                  <div>
                    <HddTwoTone style={{ fontSize: 48 }} />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="card_total" bordered={false}>
                <div className="card_number">
                  <div>
                    <div className="number_total">
                      {statisticList?.orderTotal}
                    </div>
                    <div className="title_total">Số đặt hàng</div>
                  </div>
                  <div>
                    <ShoppingTwoTone style={{ fontSize: 48 }} />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card className="card_total" bordered={false}>
                <div className="card_number">
                  <div>
                    <div className="number_total">
                      {statisticList?.totalRevenue
                        ? statisticList.totalRevenue.toLocaleString("vi", {
                            style: "currency",
                            currency: "VND",
                          })
                        : "0 ₫"}
                    </div>
                    <div className="title_total">Tổng doanh thu</div>
                  </div>
                  <div>
                    <DollarTwoTone style={{ fontSize: 48 }} />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card className="card_total" bordered={false}>
                <div className="card_number">
                  <div>
                    <div className="number_total">
                      {statisticList?.totalRevenue
                        ? statisticList.totalRevenue.toLocaleString("vi", {
                            style: "currency",
                            currency: "VND",
                          })
                        : "0 ₫"}
                    </div>
                    <div className="title_total">Tổng doanh thu</div>
                  </div>
                  <div>
                    <DollarTwoTone style={{ fontSize: 48 }} />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card className="card_total" bordered={false}>
                <div className="card_number">
                  <div>
                    <div className="number_total">
                      {statisticList?.totalRevenue
                        ? statisticList.totalRevenue.toLocaleString("vi", {
                            style: "currency",
                            currency: "VND",
                          })
                        : "0 ₫"}
                    </div>
                    <div className="title_total">Tổng doanh thu</div>
                  </div>
                  <div>
                    <DollarTwoTone style={{ fontSize: 48 }} />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={24}>
              <div className="chart">
                <div className="title">Đơn hàng mới nhất</div>
                <div style={{ marginTop: 10 }}>
                  <Table
                    columns={columns}
                    dataSource={order}
                    pagination={{
                      position: ["bottomCenter"],
                      pageSize: pageSize,
                      current: currentPage,
                      total: order.length,
                      hideOnSinglePage: true,
                      onChange: (page) => setCurrentPage(page),
                    }}
                    onChange={handleTableChange}
                    rowKey="_id"
                  />
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={12} style={{ marginTop: 20 }}>
            <Col span={24}>
              <div className="chart">
                <div className="title">Thống kê đơn hàng theo ngày</div>
                <ResponsiveContainer width="100%" aspect={2.5 / 1}>
                  <AreaChart
                    width={730}
                    height={250}
                    data={dailyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="dailyTotal"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#797EF6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#797EF6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="dailyRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#82ca9d"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#82ca9d"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="gray" />
                    <YAxis yAxisId="left" stroke="#797EF6" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#82ca9d"
                    />
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="chartGrid"
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "Doanh thu") {
                          return value.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          });
                        }
                        return value;
                      }}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="Total"
                      stroke="#797EF6"
                      fillOpacity={1}
                      fill="url(#dailyTotal)"
                      name="Số đơn hàng"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="Revenue"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#dailyRevenue)"
                      name="Doanh thu"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Col>
          </Row>
          <Row gutter={12} style={{ marginTop: 99 }}>
            <Col span={24}>
              <div className="chart">
                <div className="title">Thống kê đơn hàng theo tuần</div>
                <ResponsiveContainer width="100%" aspect={2 / 1}>
                  <AreaChart
                    width={730}
                    height={250}
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#82ca9d"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#82ca9d"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="gray" />
                    <YAxis yAxisId="left" stroke="gray" />
                    <YAxis yAxisId="right" orientation="right" stroke="gray" />
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="chartGrid"
                    />
                    <Tooltip />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="Total"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#total)"
                      name="Số đơn hàng"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="Revenue"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#revenue)"
                      name="Doanh thu (VNĐ)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Col>
          </Row>
          <Row gutter={12} style={{ marginTop: 99 }}>
            <Col span={24}>
              <div className="chart">
                <div className="title">Thống kê đơn hàng theo tháng</div>
                <ResponsiveContainer width="100%" aspect={2.5 / 1}>
                  <AreaChart
                    width={730}
                    height={250}
                    data={monthlyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="monthlyTotal"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#797EF6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#797EF6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="monthlyRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#82ca9d"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#82ca9d"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="gray" />
                    <YAxis yAxisId="left" stroke="#797EF6" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#82ca9d"
                    />
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="chartGrid"
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "Doanh thu") {
                          return value.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          });
                        }
                        return value;
                      }}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="Total"
                      stroke="#797EF6"
                      fillOpacity={1}
                      fill="url(#monthlyTotal)"
                      name="Số đơn hàng"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="Revenue"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#monthlyRevenue)"
                      name="Doanh thu"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Col>
          </Row>

          <Row gutter={12} style={{ marginTop: 20 }}>
            <Col span={24}>
              <div className="chart">
                <div className="title"></div>
                <iframe
                  style={{
                    background: "#FFFFFF",
                    border: "none",
                    borderRadius: "2px",
                    boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
                    width: "100%",
                    height: "480px",
                  }}
                  src="https://charts.mongodb.com/charts-electrotechinnovations-owqrwkg/embed/charts?id=c81a6fcf-4f92-4ab6-ab2e-93bf6f54173e&maxDataAge=600&theme=light&autoRefresh=true"
                />
              </div>
            </Col>
          </Row>
        </div>
        <BackTop style={{ textAlign: "right" }} />
      </Spin>
    </div>
  );
};

export default DashBoard;
