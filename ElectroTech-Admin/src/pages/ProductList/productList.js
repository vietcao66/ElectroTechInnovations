import React, { useState, useEffect } from 'react';
import "./productList.css";
import {
    Col, Row, Typography, Spin, Button, Card, Drawer, Empty, Input, Space, message,
    Form, Pagination, Modal, Popconfirm, notification, BackTop, Tag, Breadcrumb, Select, Table, Upload
} from 'antd';
import {
    AppstoreAddOutlined, UploadOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, ExclamationCircleOutlined, SearchOutlined,
    CalendarOutlined, UserOutlined, TeamOutlined, HomeOutlined, HistoryOutlined, FormOutlined, TagOutlined, EditOutlined
} from '@ant-design/icons';
import QRCode from 'qrcode.react';
import eventApi from "../../apis/eventApi";
import productApi from "../../apis/productsApi";
import { useHistory } from 'react-router-dom';
import { DateTime } from "../../utils/dateTime";
import axiosClient from '../../apis/axiosClient';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditor from 'suneditor-react';
import { PageHeader } from '@ant-design/pro-layout';
import newsApi from "../../apis/newsApi";
import supplierApi from '../../apis/supplierApi';
const { confirm } = Modal;
const { Option } = Select;
const { Title } = Typography;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";

const ProductList = () => {
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
    const [supplier, setSupplier] = useState([]);

    const history = useHistory();


    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            var formData = new FormData();
            formData.append("image", image);

            await axiosClient.post("/uploadFile", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                const categoryList = {
                    "name": values.name,
                    "description": description,
                    "slug": values.slug,
                    "price": values.price,
                    "category": values.category,
                    "image": response.image_url,
                    "promotion": values.promotion,
                    "quantity": values.quantity,
                    "slide": images,
                    "supplier": values.supplier

                };

                return axiosClient.post("/product", categoryList).then(response => {
                    if (response === undefined) {
                        notification["error"]({
                            message: `Thông báo`,
                            description: 'Tạo sản phẩm thất bại',
                        });
                    } else {
                        notification["success"]({
                            message: `Thông báo`,
                            description: 'Tạo sản phẩm thành công',
                        });
                        setImages([]);
                        setOpenModalCreate(false);
                        handleProductList();
                    }
                });
            });

            setLoading(false);
        } catch (error) {
            throw error;
        }
    };


    const handleImageUpload = async (info) => {
        const image = info.file;
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axiosClient.post('/uploadFile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => {
                const imageUrl = response.image_url;
                console.log(imageUrl);
                // Lưu trữ URL hình ảnh trong trạng thái của thành phần
                setImages(prevImages => [...prevImages, imageUrl]);

                console.log(images);
                message.success(`${info.file.name} đã được tải lên thành công!`);
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdateProduct = async (values) => {
        setLoading(true);
        try {
            if (image) {
                var formData = new FormData();
                formData.append("image", image);

                await axiosClient.post("/uploadFile", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                    const categoryList = {
                        "name": values.name,
                        "description": description,
                        "price": values.price,
                        "category": values.category,
                        "image": response.image_url,
                        "promotion": values.promotion,
                        "quantity": values.quantity,
                        "supplier": values.supplier
                    };

                    return axiosClient.put("/product/" + id, categoryList).then(response => {
                        if (response === undefined) {
                            notification["error"]({
                                message: `Thông báo`,
                                description: 'Chỉnh sửa sản phẩm thất bại',
                            });
                            setLoading(false);
                        } else {
                            notification["success"]({
                                message: `Thông báo`,
                                description: 'Chỉnh sửa sản phẩm thành công',
                            });
                            setOpenModalUpdate(false);
                            handleProductList();
                            setLoading(false);
                        }
                    });
                });
            } else { // Nếu image không tồn tại, chỉ gọi API put
                const categoryList = {
                    "name": values.name,
                    "description": description,
                    "price": values.price,
                    "category": values.category,
                    "promotion": values.promotion,
                    "quantity": values.quantity,
                    "color": values.colors,
                    "supplier": values.supplier
                };

                return axiosClient.put("/product/" + id, categoryList).then(response => {
                    if (response === undefined) {
                        notification["error"]({
                            message: `Thông báo`,
                            description: 'Chỉnh sửa sản phẩm thất bại',
                        });
                        setLoading(false);
                    } else {
                        notification["success"]({
                            message: `Thông báo`,
                            description: 'Chỉnh sửa sản phẩm thành công',
                        });
                        setOpenModalUpdate(false);
                        handleProductList();
                        setLoading(false);
                    }
                });
            }
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

    const handleDetailView = (id) => {
        history.push("/product-detail/" + id)
    }

    const handleChangeImage = (event) => {
        setImage(event.target.files[0]);
    }

    const handleProductEdit = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await productApi.getDetailProduct(id);
                console.log(response);
                setId(id);
                form2.setFieldsValue({
                    name: response.product.name,
                    price: response.product.price,
                    category: response?.product.category?._id,
                    quantity: response.product.quantity,
                    promotion: response.product.promotion,
                    color: response.product.color,
                    supplier: response?.product.supplier,
                });
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

    function NoData() {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    function showConfirm(uid) {
        confirm({
            title: 'Do you want to generate meeting these event online?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    const handleChange = (content) => {
        console.log(content);
        setDescription(content);
    }

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
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
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
            title: 'Giá giảm',
            key: 'promotion',
            dataIndex: 'promotion',
            render: (promotion) => (
                <span>
                    <Tag color="geekblue" key={promotion}>
                        {promotion?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                    </Tag>
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
                            {/* <Button
                                size="small"
                                icon={<EyeOutlined />}
                                style={{ width: 150, borderRadius: 15, height: 30 }}
                            >{"Xem chi tiết"}
                            </Button> */}
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                style={{ width: 150, borderRadius: 15, height: 30, marginTop: 5 }}
                                onClick={() => handleProductEdit(record._id)}
                            >{"Chỉnh sửa"}
                            </Button>
                            <div
                                style={{ marginTop: 5 }}>
                                <Popconfirm
                                    title="Bạn có chắc chắn xóa sản phẩm này?"
                                    onConfirm={() => handleDeleteCategory(record._id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        style={{ width: 150, borderRadius: 15, height: 30 }}
                                    >{"Xóa"}
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                    </Row>
                </div >
            ),
        },
    ];

    const handleOpen = () => {
        setVisible(true);
    };

    const handleClose = () => {
        form.resetFields();
        setVisible(false);
    };

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            form.resetFields();
            handleOkUser(values);
            setVisible(false);
        });
    };


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

               
                await supplierApi.getAllSuppliers({ page: 1, limit: 10000 }).then((res) => {
                    setSupplier(res.data.docs);
                });

                
                ;
            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, [])
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
                                            <Space>
                                                <Button onClick={handleOpen} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo sản phẩm</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} dataSource={product} pagination={{ position: ['bottomCenter'] }} />
                    </div>
                </div>

                <Drawer
                    title="Tạo sản phẩm mới"
                    visible={visible}
                    onClose={() => setVisible(false)}
                    width={1000}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={() => setVisible(false)} style={{ marginRight: 8 }}>
                                Hủy
                            </Button>
                            <Button onClick={handleSubmit} type="primary">
                                Hoàn thành
                            </Button>
                        </div>
                    }
                >
                    <Form
                        form={form}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="name"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>

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
                            name="price"
                            label="Giá gốc"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá gốc!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Giá gốc" type="number" />
                        </Form.Item>

                        <Form.Item
                            name="promotion"
                            label="Giá giảm"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá giảm!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Giá giảm" type="number" />
                        </Form.Item>

                        <Form.Item
                            name="image"
                            label="Ảnh"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập chọn ảnh!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <input type="file" onChange={handleChangeImage}
                                id="avatar" name="file"
                                accept="image/png, image/jpeg" />
                        </Form.Item>


                        <Form.Item
                            name="images"
                            label="Hình ảnh slide"
                            style={{ marginBottom: 10 }}
                        >
                            <Upload
                                name="images"
                                listType="picture-card"
                                showUploadList={true}
                                beforeUpload={() => false}
                                onChange={handleImageUpload}
                                multiple
                            >
                                <Button icon={<UploadOutlined />}>Tải lên</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            name="category"
                            label="Danh mục"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn danh mục!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select style={{ width: '100%' }} tokenSeparators={[',']} placeholder="Danh mục" showSearch filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                                {category.map((item, index) => {
                                    return (
                                        <Option value={item._id} key={index} >
                                            {item.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="supplier"
                            label="Nhà cung cấp"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn nhà cung cấp!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select style={{ width: '100%' }} tokenSeparators={[',']} placeholder="Nhà cung cấp" showSearch filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                                {supplier.map((item, index) => {
                                    return (
                                        <Option value={item?._id} key={index} >
                                            {item?.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >

                            <SunEditor
                                lang="en"
                                placeholder="Content"
                                onChange={handleChange}
                                setOptions={{
                                    buttonList: [
                                        ["undo", "redo"],
                                        ["font", "fontSize"],
                                        // ['paragraphStyle', 'blockquote'],
                                        [
                                            "bold",
                                            "underline",
                                            "italic",
                                            "strike",
                                            "subscript",
                                            "superscript"
                                        ],
                                        ["fontColor", "hiliteColor"],
                                        ["align", "list", "lineHeight"],
                                        ["outdent", "indent"],

                                        ["table", "horizontalRule", "link", "image", "video"],
                                        // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                                        // ['imageGallery'], // You must add the "imageGalleryUrl".
                                        // ["fullScreen", "showBlocks", "codeView"],
                                        ["preview", "print"],
                                        ["removeFormat"]

                                        // ['save', 'template'],
                                        // '/', Line break
                                    ],
                                    fontSize: [
                                        8, 10, 14, 18, 24,
                                    ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                                    defaultTag: "div",
                                    minHeight: "500px",
                                    showPathLabel: false,
                                    attributesWhitelist: {
                                        all: "style",
                                        table: "cellpadding|width|cellspacing|height|style",
                                        tr: "valign|style",
                                        td: "styleinsert|height|style",
                                        img: "title|alt|src|style"
                                    }
                                }}
                            />
                        </Form.Item>

                    </Form>
                </Drawer>


                <Drawer
                    title="Chỉnh sửa sản phẩm"
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
                            name="name"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>

                        <Form.Item
                            name="price"
                            label="Giá gốc"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá gốc!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Giá gốc" />
                        </Form.Item>

                        <Form.Item
                            name="promotion"
                            label="Giá giảm"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá giảm!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Giá giảm" />
                        </Form.Item>

                        <Form.Item
                            name="image"
                            label="Ảnh sản phẩm"
                            style={{ marginBottom: 10 }}
                        >
                            <input type="file" onChange={handleChangeImage}
                                id="avatar" name="file"
                                accept="image/png, image/jpeg" />
                        </Form.Item>

                        <Form.Item
                            name="category"
                            label="Danh mục"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn danh mục!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select style={{ width: '100%' }} tokenSeparators={[',']} placeholder="Danh mục" showSearch filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                                {category.map((item, index) => {
                                    return (
                                        <Option value={item?._id} key={index} >
                                            {item?.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="supplier"
                            label="Nhà cung cấp"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn nhà cung cấp!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select style={{ width: '100%' }} tokenSeparators={[',']} placeholder="Nhà cung cấp" showSearch filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                                {supplier.map((item, index) => {
                                    return (
                                        <Option value={item?._id} key={index} >
                                            {item?.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >

                            <SunEditor
                                lang="en"
                                placeholder="Content"
                                onChange={handleChange}
                                setContents={description}
                                setOptions={{
                                    buttonList: [
                                        ["undo", "redo"],
                                        ["font", "fontSize"],
                                        // ['paragraphStyle', 'blockquote'],
                                        [
                                            "bold",
                                            "underline",
                                            "italic",
                                            "strike",
                                            "subscript",
                                            "superscript"
                                        ],
                                        ["fontColor", "hiliteColor"],
                                        ["align", "list", "lineHeight"],
                                        ["outdent", "indent"],

                                        ["table", "horizontalRule", "link", "image", "video"],
                                        // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                                        // ['imageGallery'], // You must add the "imageGalleryUrl".
                                        // ["fullScreen", "showBlocks", "codeView"],
                                        ["preview", "print"],
                                        ["removeFormat"]

                                        // ['save', 'template'],
                                        // '/', Line break
                                    ],
                                    fontSize: [
                                        8, 10, 14, 18, 24,
                                    ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                                    defaultTag: "div",
                                    minHeight: "500px",
                                    showPathLabel: false,
                                    attributesWhitelist: {
                                        all: "style",
                                        table: "cellpadding|width|cellspacing|height|style",
                                        tr: "valign|style",
                                        td: "styleinsert|height|style",
                                        img: "title|alt|src|style"
                                    }
                                }}
                            />
                        </Form.Item>

                    </Form>
                </Drawer>



                {/* <Pagination style={{ textAlign: "center", marginBottom: 20 }} current={currentPage} defaultCurrent={1} total={totalEvent} onChange={handlePage}></Pagination> */}
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default ProductList;