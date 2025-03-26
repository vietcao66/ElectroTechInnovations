import React, { useState, useEffect } from "react";
import styles from "./productDetail.css";
import axiosClient from "../../../apis/axiosClient";
import { useParams } from "react-router-dom";
import eventApi from "../../../apis/eventApi";
import productApi from "../../../apis/productApi";
import { useHistory } from "react-router-dom";
import { Col, Row, Tag, Spin, Card } from "antd";
import { DateTime } from "../../../utils/dateTime";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import {
  Typography,
  Button,
  Badge,
  Breadcrumb,
  Popconfirm,
  Carousel,
  notification,
  Form,
  Input,
  Select,
  Rate,
  Modal,
  message,
  List,
  Avatar,
  Descriptions,
} from "antd";
import {
  HistoryOutlined,
  AuditOutlined,
  AppstoreAddOutlined,
  CloseOutlined,
  UserOutlined,
  MehOutlined,
  TeamOutlined,
  HomeOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import Paragraph from "antd/lib/typography/Paragraph";
import { numberWithCommas } from "../../../utils/common";
import triangleTopRight from "../../../assets/icon/Triangle-Top-Right.svg";

import Slider from "react-slick";

const { Meta } = Card;
const { Option } = Select;

const { Title } = Typography;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";
const { TextArea } = Input;

const ProductDetail = () => {
  const [productDetail, setProductDetail] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLength, setCartLength] = useState();
  const [visible, setVisible] = useState(false);
  const [dataForm, setDataForm] = useState([]);
  const [lengthForm, setLengthForm] = useState();
  const [form] = Form.useForm();
  const [template_feedback, setTemplateFeedback] = useState();
  let { id } = useParams();
  const history = useHistory();
  const [visible2, setVisible2] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [colorProduct, setColorProduct] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);

  const hideModal = () => {
    setVisible(false);
  };

  const listEvent = () => {
    setLoading(true);
    (async () => {
      try {
        const response = await eventApi.getDetailEvent(id);
        console.log(response);
        setProductDetail(response);
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch event detail:" + error);
      }
    })();
    window.scrollTo(0, 0);
  };

  const handleDetailEvent = (id) => {
    history.replace("/event-detail/" + id);
    window.location.reload();
    window.scrollTo(0, 0);
  };

  const getDataForm = async (uid) => {
    try {
      await axiosClient
        .get("/event/" + id + "/template_feedback/" + uid + "/question")
        .then((response) => {
          console.log(response);
          setDataForm(response);
          let tabs = [];
          for (let i = 0; i < response.length; i++) {
            tabs.push({
              content: response[i]?.content,
              uid: response[i]?.uid,
              is_rating: response[i]?.is_rating,
            });
          }
          form.setFieldsValue({
            users: tabs,
          });
          setLengthForm(tabs.length);
        });
    } catch (error) {
      throw error;
    }
  };

  const handleDirector = () => {
    history.push("/evaluation/" + id);
  };

  const addCart = (product) => {
    console.log(product);
    const existingItems = JSON.parse(localStorage.getItem("cart")) || [];
    let updatedItems;
    const existingItemIndex = existingItems.findIndex(
      (item) => item._id === product._id
    );
    if (existingItemIndex !== -1) {
      // If product already exists in the cart, increase its quantity
      updatedItems = existingItems.map((item, index) => {
        if (index === existingItemIndex) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
    } else {
      // If product does not exist in the cart, add it to the cart
      updatedItems = [...existingItems, { ...product, quantity: 1 }];
    }
    console.log(updatedItems.length);
    setCartLength(updatedItems.length);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    localStorage.setItem("cartLength", updatedItems.length);
    window.location.reload(true);
  };

  const paymentCard = (product) => {
    console.log(product);
    const existingItems = JSON.parse(localStorage.getItem("cart")) || [];
    let updatedItems;
    const existingItemIndex = existingItems.findIndex(
      (item) => item._id === product._id
    );
    if (existingItemIndex !== -1) {
      // If product already exists in the cart, increase its quantity
      updatedItems = existingItems.map((item, index) => {
        if (index === existingItemIndex) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
    } else {
      // If product does not exist in the cart, add it to the cart
      updatedItems = [...existingItems, { ...product, quantity: 1 }];
    }
    console.log(updatedItems.length);
    setCartLength(updatedItems.length);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    localStorage.setItem("cartLength", updatedItems.length);
    history.push("/cart");
  };

  const onFinish = async (values) => {
    console.log(values.users);
    let tabs = [];
    for (let i = 0; i < values.users.length; i++) {
      tabs.push({
        scope:
          values.users[i]?.scope == undefined ? null : values.users[i]?.scope,
        comment:
          values.users[i]?.comment == undefined
            ? null
            : values.users[i]?.comment,
        question_uid: values.users[i]?.uid,
      });
    }
    console.log(tabs);
    setLoading(true);
    try {
      const dataForm = {
        answers: tabs,
      };
      await axiosClient
        .post("/event/" + id + "/answer", dataForm)
        .then((response) => {
          if (response === undefined) {
            notification["error"]({
              message: `Notification`,
              description: "Answer event question failed",
            });
            setLoading(false);
          } else {
            notification["success"]({
              message: `Notification`,
              description: "Successfully answer event question",
            });
            setLoading(false);
            form.resetFields();
          }
        });
    } catch (error) {
      throw error;
    }
  };

  const handleReadMore = (id) => {
    console.log(id);
    history.push("/product-detail/" + id);
    window.location.reload();
  };

  const handleOpenModal = () => {
    setVisible2(true);
  };

  const handleCloseModal = () => {
    setVisible2(false);
  };

  const handleRateChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  function handleClick(color) {
    // Xử lý logic khi click vào điểm màu
    console.log("Selected color:", color);
    setColorProduct(color);
    setSelectedColor(color);
  }

  const handleReviewSubmit = async () => {
    // Tạo payload để gửi đến API
    const payload = {
      comment,
      rating,
    };

    // Gọi API đánh giá và bình luận
    await axiosClient
      .post(`/product/${id}/reviews`, payload)
      .then((response) => {
        console.log(response);
        // Xử lý khi gọi API thành công
        console.log("Review created");
        // Đóng modal và thực hiện các hành động khác nếu cần
        message.success("Thông báo:" + response);

        handleCloseModal();
      })
      .catch((error) => {
        // Xử lý khi gọi API thất bại
        console.error("Error creating review:", error);
        // Hiển thị thông báo lỗi cho người dùng nếu cần
        message.error("Đánh giá thất bại: " + error);
      });
  };

  const [reviews, setProductReview] = useState([]);
  const [reviewsCount, setProductReviewCount] = useState([]);
  const [avgRating, setAvgRating] = useState(null);

  const data = [
    {
      key: "suonXe",
      dataIndex: "suonXe",
      title: "Suồn Xe",
    },
    {
      key: "loaiPhanhThang",
      dataIndex: "loaiPhanhThang",
      title: "Loại Phanh Thắng",
    },
    {
      key: "boLip",
      dataIndex: "boLip",
      title: "Bộ Líp",
    },
    {
      key: "boDia",
      dataIndex: "boDia",
      title: "Bộ Đĩa",
    },
    {
      key: "loaiTayDe",
      dataIndex: "loaiTayDe",
      title: "Loại Tay Đề",
    },
    {
      key: "phuoc",
      dataIndex: "phuoc",
      title: "Phuộc",
    },
    {
      key: "taiTrong",
      dataIndex: "taiTrong",
      title: "Tải Trọng",
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        await productApi.getDetailProduct(id).then((item) => {
          setProductDetail(item.product);
          setProductReview(item.reviews);
          setProductReviewCount(item.reviewStats);
          setAvgRating(item.avgRating);
          console.log(((reviewsCount[4] || 0) / reviews.length) * 100);
        });
        await productApi.getRecommendProduct(id).then((item) => {
          setRecommend(item?.recommendations);
        });
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch event detail:" + error);
      }
    })();
    window.scrollTo(0, 0);
  }, [cartLength]);

  return (
    <div>
      <Spin spinning={false}>
        <Card className="container_details">
          <div className="product_detail">
            <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
              <Breadcrumb>
                <Breadcrumb.Item href="">
                  <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <AuditOutlined />
                  <span>Sản phẩm</span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr></hr>
            <div className="price">
              <h1 className="product_name">{productDetail.name}</h1>
              <Rate disabled value={avgRating} className="rate" />
            </div>
            <Row gutter={12} style={{ marginTop: 20 }}>
              <Col span={8}>
                {productDetail?.slide?.length > 0 ? (
                  <Carousel autoplay className="carousel-image">
                    {productDetail.slide.map((item) => (
                      <div className="img" key={item}>
                        <img
                          style={{
                            width: "100%",
                            maxHeight: 320,
                            height: "100%",
                          }}
                          src={item}
                          alt=""
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <Card className="card_image" bordered={false}>
                    <img src={productDetail.image} />
                    <div className="promotion"></div>
                  </Card>
                )}
              </Col>
              <Col span={8}>
                <Card className="card_total" bordered={false}>
                  <div className="price_product">
                    {productDetail?.promotion?.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </div>
                  <div className="promotion_product">
                    {productDetail?.price?.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </div>
                  <div class="box-product-promotion">
                    <div class="box-product-promotion-header">
                      <p>Khuyến mãi</p>
                    </div>
                    <div class="box-content-promotion">
                      <p class="box-product-promotion-number"></p>
                      <a>
                        Thu cũ lên đời - Giá thu cao nhất - Tặng thêm 1 triệu
                        khi lên đời
                        <span>(Xem chi tiết)</span>
                      </a>
                    </div>
                  </div>

                  <div className="color-product">
                    {productDetail?.color?.map((color) => (
                      <span
                        key={color}
                        style={{ backgroundColor: color }} // Sửa đổi ở đây
                        className={`dot ${
                          selectedColor === color ? "active" : ""
                        }`}
                        onClick={() => handleClick(color)}
                      ></span>
                    ))}
                  </div>
                  <div className="box_cart_1">
                    <Button
                      type="primary"
                      className="by"
                      size={"large"}
                      onClick={() => paymentCard(productDetail)}
                    >
                      Mua ngay
                    </Button>
                    <Button
                      type="primary"
                      className="cart"
                      size={"large"}
                      onClick={() => addCart(productDetail)}
                    >
                      Thêm vào giỏ
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card className="card_total" bordered={false}>
                  <div className="card_number">
                    <div>
                      <div className="number_total">
                        {productDetail.categoryTotal}
                      </div>
                      <div className="title_total">Chính sách mua hàng</div>
                      <div class="policy_intuitive">
                        <div class="policy">
                          <ul class="policy__list">
                            <li>
                              <div class="iconl">
                                <i class="icondetail-doimoi"></i>
                              </div>
                              <p>
                                Hư gì đổi nấy <b>12 tháng</b> tại Buym. (miễn
                                phí tháng đầu) <a href="#"></a>
                              </p>
                            </li>
                            <li data-field="IsSameBHAndDT">
                              <div class="iconl">
                                <i class="icondetail-baohanh"></i>
                              </div>
                              <p>
                                Bảo hành <b>chính hãng 1 năm</b> tại các trung
                                tâm bảo hành hãng
                              </p>
                            </li>

                            <li>
                              <div class="iconl">
                                <i class="icondetail-sachhd"></i>
                              </div>
                              <p>
                                Bộ sản phẩm gồm: Dây sạc, Sách hướng dẫn, máy,
                                Sạc {productDetail.name}{" "}
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
            <div>
              <div
                className="box_detail_description"
                dangerouslySetInnerHTML={{ __html: productDetail.description }}
              ></div>
            </div>

            <Row gutter={12} style={{ marginTop: 20 }}>
              <Col span={16}>
                <Card className="card_total" bordered={false}>
                  <div className="card_number">
                    <div>
                      <div className="number_total">
                        {productDetail.categoryTotal}
                      </div>
                      <div className="title_total">
                        Đánh giá & nhận xét {productDetail.name}
                      </div>
                      <div class="review">
                        <div class="policy-review">
                          <div class="policy__list">
                            <Row gutter={12}>
                              <Col span={8}>
                                <div className="comment_total">
                                  <p class="title">{avgRating}/5</p>
                                  <Rate disabled value={avgRating} />
                                  <p>
                                    <strong>{reviews.length}</strong> đánh giá
                                    và nhận xét
                                  </p>
                                </div>
                              </Col>
                              <Col span={16}>
                                <div className="progress_comment">
                                  <div class="is-active">
                                    <div>5</div>
                                    <div>
                                      <svg
                                        height="15"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                      >
                                        <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                  Đánh giá 5 sao gồm có:
                                  <span className="review-count">
                                    {reviewsCount[4] || 0}
                                  </span>
                                  {/* <div class="total_comment">16 đánh giá</div> */}
                                </div>
                                <div className="progress_comment">
                                  <div class="is-active">
                                    <div>4</div>
                                    <div>
                                      <svg
                                        height="15"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                      >
                                        <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                  Đánh giá 4 sao gồm có:
                                  <span className="review-count">
                                    {reviewsCount[3] || 0}
                                  </span>
                                  {/* <div class="total_comment">16 đánh giá</div> */}
                                </div>
                                <div className="progress_comment">
                                  <div class="is-active">
                                    <div>3</div>
                                    <div>
                                      <svg
                                        height="15"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                      >
                                        <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                  Đánh giá 3 sao gồm có:
                                  <span className="review-count">
                                    {reviewsCount[2] || 0}
                                  </span>
                                  {/* <div class="total_comment">16 đánh giá</div> */}
                                </div>
                                <div className="progress_comment">
                                  <div class="is-active">
                                    <div>2</div>
                                    <div>
                                      <svg
                                        height="15"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                      >
                                        <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                  Đánh giá 2 sao gồm có:
                                  <span className="review-count">
                                    {reviewsCount[1] || 0}
                                  </span>
                                  {/* <div class="total_comment">16 đánh giá</div> */}
                                </div>
                                <div className="progress_comment">
                                  <div class="is-active">
                                    <div>1</div>
                                    <div>
                                      <svg
                                        height="15"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                      >
                                        <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                  Đánh giá 1 sao gồm có:
                                  <span className="review-count">
                                    {reviewsCount[0] || 0}
                                  </span>
                                  {/* <div class="total_comment">16 đánh giá</div> */}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                      <p class="subtitle">Bạn đánh giá sao sản phẩm này</p>
                      <div class="group_comment">
                        <Button
                          type="primary"
                          className="button_comment"
                          size={"large"}
                          onClick={handleOpenModal}
                        >
                          Đánh giá ngay
                        </Button>
                      </div>
                      <Modal
                        visible={visible2}
                        onCancel={handleCloseModal}
                        onOk={handleReviewSubmit}
                        okText="Gửi đánh giá"
                        cancelText="Hủy"
                      >
                        <h2>Đánh giá và bình luận</h2>
                        <Rate
                          value={rating}
                          onChange={handleRateChange}
                          style={{ marginBottom: 10 }}
                        />
                        <TextArea
                          placeholder="Nhập bình luận của bạn"
                          value={comment}
                          onChange={handleCommentChange}
                        ></TextArea>
                      </Modal>
                    </div>
                    <div style={{ marginTop: 40 }}>
                      <Card>
                        <div style={{ padding: 20 }}>
                          <List
                            itemLayout="horizontal"
                            dataSource={reviews}
                            renderItem={(item, index) => (
                              <List.Item>
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=1`}
                                    />
                                  }
                                  title={
                                    <a href="https://ant.design">
                                      {item?.user?.username}
                                    </a>
                                  }
                                  description={item?.comment}
                                />
                              </List.Item>
                            )}
                          />
                        </div>
                      </Card>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
            <div></div>

            <div className="price" style={{ marginTop: 40 }}>
              <h1 className="product_name">Sản phẩm bạn có thể quan tâm</h1>
            </div>
            <Row
              style={{ marginTop: 40 }}
              gutter={{ xs: 8, sm: 16, md: 24, lg: 48 }}
              className="row-product"
            >
              {recommend?.map((item) => (
                <Col
                  xl={{ span: 6 }}
                  lg={{ span: 6 }}
                  md={{ span: 12 }}
                  sm={{ span: 12 }}
                  xs={{ span: 24 }}
                  className="col-product"
                  onClick={() => handleReadMore(item._id)}
                  key={item._id}
                >
                  <div className="show-product">
                    {item.image ? (
                      <img className="image-product" src={item.image} />
                    ) : (
                      <img
                        className="image-product"
                        src={require("../../../assets/image/NoImageAvailable.jpg")}
                      />
                    )}
                    <div className="wrapper-products">
                      <Paragraph
                        className="title-product"
                        ellipsis={{ rows: 2 }}
                      >
                        {item.name}
                      </Paragraph>
                      <div className="price-amount">
                        <Paragraph className="price-product">
                          {numberWithCommas(item.price - item.promotion)} đ
                        </Paragraph>
                        {item.promotion !== 0 && (
                          <Paragraph className="price-cross">
                            {numberWithCommas(item.price)} đ
                          </Paragraph>
                        )}
                      </div>
                    </div>
                  </div>
                  <Paragraph
                    className="badge"
                    style={{ position: "absolute", top: 10, left: 9 }}
                  >
                    <span>Giảm giá</span>
                    <img src={triangleTopRight} />
                  </Paragraph>
                </Col>
              ))}
            </Row>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default ProductDetail;
