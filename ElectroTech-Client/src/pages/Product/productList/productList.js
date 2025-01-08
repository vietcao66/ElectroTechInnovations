import React, { useState, useEffect } from "react";
import styles from "./productList.css";
import axiosClient from "../../../apis/axiosClient";
import { useParams, useRouteMatch } from "react-router-dom";
import eventApi from "../../../apis/eventApi";
import productApi from "../../../apis/productApi";
import { useHistory } from 'react-router-dom';
import { Col, Row, Tag, Spin, Card } from "antd";
import { DateTime } from "../../../utils/dateTime";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Typography, Button, Badge, Breadcrumb, Popconfirm, Progress, notification, Form, Input, Select, Rate, Slider, List } from 'antd';
import { HistoryOutlined, AuditOutlined, AppstoreAddOutlined, CloseOutlined, UserOutlined, MehOutlined, TeamOutlined, HomeOutlined, SearchOutlined } from '@ant-design/icons';
import Paragraph from "antd/lib/typography/Paragraph";
import { numberWithCommas } from "../../../utils/common";
import triangleTopRight from "../../../assets/icon/Triangle-Top-Right.svg"

const { Meta } = Card;
const { Option } = Select;

const { Title } = Typography;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";
const { TextArea } = Input;

const ProductList = () => {

    const [productDetail, setProductDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartLength, setCartLength] = useState();
    const [visible, setVisible] = useState(false);
    const [dataForm, setDataForm] = useState([]);
    const [lengthForm, setLengthForm] = useState();
    const [form] = Form.useForm();
    const [template_feedback, setTemplateFeedback] = useState();
    const [categories, setCategories] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100000000);

    let { id } = useParams();
    const history = useHistory();
    const match = useRouteMatch();

    const handleReadMore = (id) => {
        console.log(id);
        history.push("/product-detail/" + id);
        window.location.reload();
    }

    const handleCategoryDetails = (id) => {
        const newPath = match.url.replace(/\/[^/]+$/, `/${id}`);
        history.push(newPath);
        window.location.reload();
    }

    const handleSearchPrice = async (minPrice, maxPrice) => {
        try {
            const dataForm = {
                "page": 1,
                "limit": 50,
                "minPrice": minPrice,
                "maxPrice": maxPrice
            }
            await axiosClient.post("/product/searchByPrice", dataForm)
                .then(response => {
                    if (response === undefined) {
                        setLoading(false);
                    }
                    else {
                        setProductDetail(response.data.docs);
                        setLoading(false);
                    }
                }
                );

        } catch (error) {
            throw error;
        }
    }

    const handleSliderChange = (values) => {
        setMinPrice(values[0]);
        setMaxPrice(values[1]);
    };

    const handleSearchClick = () => {
        // Gọi hàm tìm kiếm theo giá
        handleSearchPrice(minPrice, maxPrice);
    };

    useEffect(() => {
        (async () => {
            try {
                await productApi.getProductCategory(id).then((item) => {
                    setProductDetail(item.data.docs);
                });
                const response = await productApi.getCategory({ limit: 50, page: 1 });
                setCategories(response.data.docs);

                setLoading(false);

            } catch (error) {
                console.log('Failed to fetch event detail:' + error);
            }
        })();
        window.scrollTo(0, 0);
    }, [cartLength])

    return (
        <div>
            <Spin spinning={false}>
                <div className="container box">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => handleCategoryDetails(category._id)}
                            className="menu-item-1"
                        >
                            <div className="menu-category-1">
                                {category.name}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="container">
                    <Slider
                        range
                        min={0}
                        max={100000000}
                        value={[minPrice, maxPrice]}
                        onChange={handleSliderChange}
                    />
                    <Button type="primary" icon={<SearchOutlined />} onClick={() => handleSearchClick()}>
                        Search
                    </Button>
                </div>
                <div className="list-products container" key="1" style={{ marginTop: 50, marginBottom: 50 }}>
                    <Row>
                        <Col>
                            <div className="title-category">
                                <a href="" class="title">
                                    <h3>DANH SÁCH SẢN PHẨM</h3>
                                </a>
                            </div>
                        </Col>
                    </Row>
                    <Row
                        gutter={{ xs: 8, sm: 16, md: 24, lg: 48 }}
                        className="row-product-details"
                    >
                        <List
                            grid={{
                                gutter: 16,
                                column: productDetail.length >= 4 ? 4 : productDetail.length,
                            }} size="large"
                            className="product-list"
                            pagination={{
                                onChange: page => {
                                    window.scrollTo(0, 0);
                                },
                                pageSize: 12,
                            }}
                            dataSource={productDetail}
                            renderItem={item => (

                                <List.Item>

                                    <div className="show-product" onClick={() => handleReadMore(item._id)}>
                                        {item.image ? (
                                            <img
                                                className='image-product'
                                                src={item.image}
                                            />
                                        ) : (
                                            <img
                                                className='image-product'
                                                src={require('../../../assets/image/NoImageAvailable.jpg')}
                                            />
                                        )}
                                        <div className='wrapper-products'>
                                            <Paragraph
                                                className='title-product'
                                                ellipsis={{ rows: 2 }}
                                            >
                                                {item.name}
                                            </Paragraph>
                                            <div className="price-amount">
                                                <Paragraph className='price-product'>
                                                    {numberWithCommas(item.promotion)} đ
                                                </Paragraph>
                                                {item.promotion !== 0 &&
                                                    <Paragraph className='price-cross'>
                                                        {numberWithCommas(item.price)} đ
                                                    </Paragraph>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <Paragraph className='badge' style={{ position: 'absolute', top: 10, left: 9 }}>
                                        <span>Giảm giá</span>
                                        <img src={triangleTopRight} />
                                    </Paragraph>
                                </List.Item>
                            )}>

                        </List>
                    </Row>
                </div>
            </Spin>
        </div >
    );
};

export default ProductList;
