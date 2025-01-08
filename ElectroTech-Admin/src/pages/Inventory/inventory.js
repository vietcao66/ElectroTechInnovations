import {
    EditOutlined,
    FormOutlined,
    HomeOutlined,
    EyeOutlined
} from '@ant-design/icons';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    DatePicker,
    Drawer,
    Form,
    Input,
    Modal,
    Row,
    Spin,
    Table,
    notification
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import "./inventory.css";

import { PageHeader } from '@ant-design/pro-layout';
import { useHistory } from 'react-router-dom';
import 'suneditor/dist/css/suneditor.min.css';
import axiosClient from '../../apis/axiosClient';
import newsApi from "../../apis/newsApi";
import productApi from "../../apis/productsApi";
const { confirm } = Modal;

const Inventory = () => {
    const [product, setProduct] = useState([]);
    const [category, setCategoryList] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [image, setImage] = useState();
    const [newsList, setNewsList] = useState([]);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [totalEvent, setTotalEvent] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [description, setDescription] = useState();
    const [total, setTotalList] = useState(false);
    const [id, setId] = useState();
    const [visible, setVisible] = useState(false);
    const [images, setImages] = useState([]);

    const history = useHistory();
  

    const handleUpdateProduct = async (values) => {
        setLoading(true);
        try {
            
                const inventory = {
                    "inventory": {
                        "quantityOnHand": values.quantity,
                        "expirationDate": values.expirationDate
                    },
                };

                return axiosClient.put("/product/" + id, inventory).then(response => {
                    if (response === undefined) {
                        notification["error"]({
                            message: `Thông báo`,
                            description: 'Nhập hàng thất bại',
                        });
                        setLoading(false);
                    } else {
                        notification["success"]({
                            message: `Thông báo`,
                            description: 'Nhập hàng thành công',
                        });
                        setOpenModalUpdate(false);
                        handleProductList();
                        setLoading(false);
                    }
                });
        } catch (error) {
            throw error;
        }
    };


    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleProductList = async () => {
        try {
            await productApi.getListProducts({ page: 1, limit: 10000 }).then((res) => {
                console.log(res);
                setProduct(res.data.docs);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch product list:' + error);
        };
    };

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await productApi.deleteProduct(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa sản phẩm thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa sản phẩm thành công',

                    });
                    setCurrentPage(1);
                    handleProductList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleProductEdit = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await productApi.getDetailProduct(id);
                console.log(response);
                setId(id);
                console.log(form2);
                setDescription(response.product.description);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleFilter = async (name) => {
        try {
            const res = await productApi.searchProduct(name);
            setTotalList(res.totalDocs)
            setProduct(res.data.docs);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const handleViewDetails = (productId) => {
        history.push(`/inventory-history/${productId}`);
      };

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => <img src={image} style={{ height: 80 }} />,
            width: '10%'
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Tồn kho',
            dataIndex: 'inventory',
            key: 'inventory',
            render: (res) => (
                <span>
                    {res?.quantityOnHand}
                </span>
            ),
        },
        {
            title: 'Giá gốc',
            key: 'price',
            dataIndex: 'price',
            render: (slugs) => (
                <span>
                    <div>{slugs?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</div>
                </span>
            ),
        },
        {
            title: 'Tổng giá trị',
            key: 'totalValue',
            render: (text, record) => (
                <span>
                    {(record.inventory?.quantityOnHand * record.price)?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                </span>
            ),
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (res) => (
                <span>
                    {res?.name}
                </span>
            ),
        },
        {
            title: 'Nhà cung cấp',
            dataIndex: 'supplier',
            key: 'supplier',
            render: (res) => (
                <span>
                    {res?.name}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <div>
                <Row>
                  <div className='groupButton'>
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      style={{ width: 150, borderRadius: 15, height: 30 }}
                      onClick={() => handleViewDetails(record._id)}
                    >
                      {"Xem chi tiết"}
                    </Button>
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      style={{ width: 150, borderRadius: 15, height: 30, marginTop: 5 }}
                      onClick={() => handleProductEdit(record._id)}
                    >
                      {"Nhập hàng"}
                    </Button>
                  </div>
                </Row>
              </div>
            ),
          },
    ];


    useEffect(() => {
        (async () => {
            try {
                await productApi.getListProducts({ page: 1, limit: 10000 }).then((res) => {
                    console.log(res);
                    setTotalList(res.totalDocs)
                    setProduct(res.data.docs);
                    setLoading(false);
                });

                await productApi.getListCategory({ page: 1, limit: 10000 }).then((res) => {
                    console.log(res);
                    setCategoryList(res.data.docs);
                    setLoading(false);
                });

                await newsApi.getListColor({ page: 1, limit: 10 }).then((res) => {
                    console.log(res);
                    setTotalList(res.totalDocs)
                    setNewsList(res.data.docs);
                    setLoading(false);
                });

                ;
            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, [])

    const tableRef = useRef();

    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <FormOutlined />
                                <span>Danh sách sản phẩm</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table ref={tableRef} columns={columns} dataSource={product} pagination={{ position: ['bottomCenter'] }} />
                    </div>
                </div>

                <Drawer
                    title="Nhập hàng"
                    visible={openModalUpdate}
                    onClose={() => handleCancel("update")}
                    width={1000}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={() => {
                                form2
                                    .validateFields()
                                    .then((values) => {
                                        form2.resetFields();
                                        handleUpdateProduct(values);
                                    })
                                    .catch((info) => {
                                        console.log('Validate Failed:', info);
                                    });
                            }} type="primary" style={{ marginRight: 8 }}>
                                Hoàn thành
                            </Button>
                            <Button onClick={() => handleCancel("update")}>
                                Hủy
                            </Button>
                        </div>
                    }
                >
                    <Form
                        form={form2}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="quantity"
                            label="Số lượng"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số lượng!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số lượng" type="number" />
                        </Form.Item>
                        <Form.Item
                            name="expirationDate"
                            label="Ngày hết hạn"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày hết hạn!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker placeholder="Chọn ngày hết hạn" />
                        </Form.Item>
                    </Form>
                </Drawer>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default Inventory;