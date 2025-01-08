import React, { useState, useEffect } from 'react';
import "./myEvent.css";
import {
    Col, Row, Typography, Spin, Button, PageHeader, Card, Badge, Empty, Input, Space,
    Form, Pagination, Modal, Popconfirm, notification, BackTop, Tag, Breadcrumb, Select
} from 'antd';
import {
    AppstoreAddOutlined, QrcodeOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, ExclamationCircleOutlined, SearchOutlined,
    CalendarOutlined, UserOutlined, TeamOutlined, HomeOutlined, HistoryOutlined, FormOutlined, TagOutlined, EditOutlined
} from '@ant-design/icons';
import QRCode from 'qrcode.react';
import eventApi from "../../apis/eventApi";
import { useHistory } from 'react-router-dom';
import { DateTime } from "../../utils/dateTime";

const { confirm } = Modal;
const { Option } = Select;
const { Title } = Typography;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";

const MyEvent = () => {

    const [event, setEvent] = useState([]);
    const [eventTemp, setEventTemp] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const [totalEvent, setTotalEvent] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [qrCode, setQrCode] = useState();
    const [note, setNote] = useState();
    const [statusEvent, setStatusEvent] = useState();
    const [eventName, setEventName] = useState();
    const [visibleReject, setVisibleReject] = useState(false);

    const history = useHistory();

    const handleModal = () => {
        history.push("/event-create")
        form.resetFields();
    }

    const hideModal = () => {
        setVisible(false);
    };

    const hideDownload = () => {
        downloadQR();
        setVisible(false);
    }

    const handleListEvent = async () => {
        (async () => {
            try {
                await eventApi.getListMyEvents("all").then((event) => {
                    let temp = event.data;
                    setEvent(temp.filter(function (res) {
                        return res.creator_event.is_creator === true;
                    }));
                    setEventTemp(temp.filter(function (res) {
                        return res.creator_event.is_creator === true;
                    }));
                    setLoading(false);
                    setTotalEvent(event.total_count);
                });
                ;


            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }

    const handleVisibleReject = (note) => {
        setNote(note)
        setVisibleReject(true);
    }

    const hideRejectReason = () => {
        setVisibleReject(false);
    }

    const handleDeleteEvent = async (id) => {
        setLoading(true);
        try {
            await eventApi.deleteEvent(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Notification`,
                        description:
                            'Delete event failed',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Successfully delete event',

                    });
                    setCurrentPage(1);
                    handleListEvent();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handlePage = async (page, size) => {
        window.scroll(0, 0);
        setLoading(true);
        if (localStorage.getItem('role') == "admin") {
            (async () => {
                try {
                    await eventApi.getListMyEventsAdmin(page, 10).then((event) => {
                        let temp = event.data;
                        setEvent(temp);
                        setTotalEvent(event.total_count);
                        setCurrentPage(page);
                        setLoading(false);
                    });
                    ;
                } catch (error) {
                    console.log('Failed to fetch event list:' + error);
                }
            })();
        } else {
            (async () => {
                try {
                    await eventApi.getListMyEvents(page, 10).then((event) => {
                        let temp = event.data;
                        setEvent(temp);
                        setTotalEvent(event.total_count);
                        setCurrentPage(page);
                        setLoading(false);
                    });
                    ;
                } catch (error) {
                    console.log('Failed to fetch event list:' + error);
                }
            })();
        }
        setLoading(false);
    }

    const handleDetailView = (id) => {
        history.push("/event-detail/" + id)
    }

    const downloadQR = () => {
        const canvas = document.getElementById('qrcode');
        const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        console.log('pngUrl', pngUrl);
        let downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = '3A2S.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const handleShowQRCode = async (id) => {
        setLoading(true);
        try {
            const response = await eventApi.showDetailQrCode(id);
            setQrCode(response.qr_code);
            setVisible(true);
            setLoading(false);

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleEventEdit = (id) => {
        history.push("event-edit/" + id);
    }

    const handleCreateQRCode = async (id) => {
        setLoading(true);
        try {
            await eventApi.createQRCode(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Notification`,
                        description:
                            'QR Code create failed',
                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Successfully QR Code',

                    });
                    setCurrentPage(1);
                    handleListEvent();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleFilter = (name) => {
        setEventName(name.target.data);
    }

    const handleStatusEvent = (data) => {
        setStatusEvent(data);
        handelSearchEvent(data);
    }

    const handelSearchEvent = (data) => {
        if (localStorage.getItem('role') == "admin" || localStorage.getItem('role') == "approval") {
            (async () => {
                try {
                    await eventApi.getListMyEventsAdmin(data).then((event) => {
                        let temp = event.data;
                        setEvent(temp);
                        setTotalEvent(temp.total_count)
                        setLoading(false);
                    });
                    ;
                } catch (error) {
                    console.log('Failed to fetch event list:' + error);
                }
            })();
        }
        window.scrollTo(0, 0);
    }

    const handleGeneralMeeting = (uid) => {
        setLoading(true);
        (async () => {
            try {
                await eventApi.generateEvent(uid).then((event) => {
                    if (event === undefined) {
                        notification["error"]({
                            message: `Notification`,
                            description:
                                'Generate link meeting to the event failed',

                        });
                    }
                    else {
                        notification["success"]({
                            message: `Notification`,
                            description:
                                'Successfully generate link meeting to the event',

                        });
                        handleListEvent();
                    }
                });
                setLoading(false);
                ;


            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }

    function NoData() {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }


    function showConfirm(uid) {
        confirm({
            title: 'Do you want to generate meeting these event online?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                handleGeneralMeeting(uid);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    useEffect(() => {
        if (localStorage.getItem('role') == "admin") {
            (async () => {
                try {
                    await eventApi.getListMyEventsAdmin(1, 10).then((event) => {
                        let temp = event.data;
                        setEvent(temp);
                        setTotalEvent(event.total_count)
                        setLoading(false);
                    });
                    ;
                } catch (error) {
                    console.log('Failed to fetch event list:' + error);
                }
            })();
        } else {
            (async () => {
                try {
                    await eventApi.getListMyEvents(1, 20000).then((event) => {
                        let temp = event.data;
                        setEvent(temp);
                        setTotalEvent(event.total_count);
                        setLoading(false);
                    });
                    ;
                } catch (error) {
                    console.log('Failed to fetch event list:' + error);
                }
            })();
        }
    }, [])
    return (
        // <div>
        //     <Spin spinning={loading}>
        //         <div style={{ marginTop: 20, marginLeft: 24 }}>
        //             <Breadcrumb>
        //                 <Breadcrumb.Item href="">
        //                     <HomeOutlined />
        //                 </Breadcrumb.Item>
        //                 <Breadcrumb.Item href="">
        //                     <FormOutlined />
        //                     <span>My Event</span>
        //                 </Breadcrumb.Item>
        //             </Breadcrumb>
        //         </div>

        //         <div id="my__event">
        //             <div id="my__event_container__list">
        //                 <PageHeader
        //                     subTitle=""
        //                     style={{ fontSize: 14 }}
        //                 >
        //                     <Row>
        //                         <Col span="18">
        //                         </Col>
        //                         <Col span="6">
        //                             <Row justify="end">
        //                                 <Space>
        //                                     <Button onClick={handleModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Create Event</Button>
        //                                 </Space>
        //                             </Row>
        //                         </Col>
        //                     </Row>

        //                 </PageHeader>
        //             </div>
        //         </div>

        //         {event.length == 0 ?
        //             <div id="event" style={{ background: "#FFFFFF", padding: 80 }} >
        //                 <NoData />
        //             </div>
        //             :
        //             ""}

        //         {event.map((eventDetail, id) => {
        //             return (
        //                 <div key={id}>
        //                     {eventDetail.is_online == true ?
        //                         <div id="my__event">
        //                             <Badge.Ribbon text="ONLINE" style={{ paddingRight: 20 }}>
        //                                 <div id="my__event_container__list" style={{ padding: 12 }}>
        //                                     <Card bordered={false} style={{ borderRadius: 6 }}>
        //                                         <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        //                                             <Col style={{ paddingRight: 0 }} span={6}>
        //                                                 {eventDetail?.avatar?.length > 0 ? <img src={eventDetail.avatar} alt="" className="image" style={{ height: 165, width: '97%' }}></img> : <img className="image" style={{ height: 160, width: '97%' }} alt="" src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/169963/photo-1429043794791-eb8f26f44081.jpeg' ></img>}
        //                                             </Col>
        //                                             <Col style={{ paddingRight: 0 }} span={7}>
        //                                                 <Title style={{ marginBottom: 1, color: '#d4380d', fontSize: 15.5, fontFamily: 'Inter, sans-serif' }} level={5}>{eventDetail.event_name}</Title>
        //                                                 <p style={{ margin: 0, fontSize: 14, marginBottom: 1 }}>{eventDetail.createdBy?.firstName ? <UserOutlined /> : <HomeOutlined />}
        //                                                     <u style={{ paddingLeft: 5 }}>
        //                                                         {eventDetail.organization}
        //                                                     </u>
        //                                                 </p>
        //                                                 <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
        //                                                     <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
        //                                                     <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        //                                                 </svg>{eventDetail.location}</p>
        //                                                 <p style={{ marginTop: 5, fontSize: 14, marginBottom: 1 }}><CalendarOutlined />  {DateTime(eventDetail.start_at, DATE_TIME_FORMAT)} - {DateTime(eventDetail.end_at, DATE_TIME_FORMAT)}</p>
        //                                                 <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><TeamOutlined /> Number Of Participants: <Tag color="blue">{eventDetail.count_join_event}/{eventDetail.size}</Tag></p>
        //                                                 {
        //                                                     eventDetail.status == "pending" ?
        //                                                         <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="red">{eventDetail.status.toUpperCase()}</Tag></p> :
        //                                                         eventDetail.status == "accept" ?
        //                                                             <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="green">{eventDetail.status.toUpperCase()}</Tag></p> :
        //                                                             <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="default">{eventDetail.status.toUpperCase()}</Tag></p>
        //                                                 }
        //                                                 <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-lock" viewBox="0 0 16 16">
        //                                                     <path d="M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0zM7 7v1h2V7a1 1 0 0 0-2 0zM6 9.3v2.4c0 .042.02.107.105.175A.637.637 0 0 0 6.5 12h3a.64.64 0 0 0 .395-.125c.085-.068.105-.133.105-.175V9.3c0-.042-.02-.107-.105-.175A.637.637 0 0 0 9.5 9h-3a.637.637 0 0 0-.395.125C6.02 9.193 6 9.258 6 9.3z" />
        //                                                     <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
        //                                                 </svg>Score: <Tag color="geekblue">{eventDetail?.scope}</Tag></p>
        //                                                 {eventDetail.type_event.map((item, index) => {
        //                                                     return (
        //                                                         <Tag key={index} style={{ marginRight: 5, marginTop: 5, fontSize: 13 }}>{item.toUpperCase()}</Tag>
        //                                                     )
        //                                                 })}
        //                                             </Col>
        //                                             <Col style={{ paddingLeft: 0, paddingRight: 0 }} span={6}>
        //                                                 <p style={{ margin: 0, fontSize: 14 }} className="event_container__fixLine" dangerouslySetInnerHTML={{ __html: eventDetail.description }}></p>
        //                                             </Col>
        //                                             <Col style={{ paddingLeft: 0, paddingRight: 0, width: 10 }} span={0}>
        //                                             </Col>
        //                                             <Col style={{ textAlign: "center", float: "left" }} span={5}>
        //                                                 <div style={{ borderLeft: '1px solid #D3D3D3', height: '100%', float: "left", paddingRight: 2 }}></div>
        //                                                 <div className="event__button-wrap">
        //                                                     <Row
        //                                                         justify="center"
        //                                                     >
        //                                                         <Row>
        //                                                             <Button
        //                                                                 className="event__btn"
        //                                                                 icon={<EyeOutlined />}
        //                                                                 onClick={() => handleDetailView(eventDetail.uid)}
        //                                                             >{"View"}
        //                                                             </Button>
        //                                                         </Row>
        //                                                         {
        //                                                             eventDetail.creator_event.qr_code_string && eventDetail.status !== "pending" ?
        //                                                                 <Button
        //                                                                     shape="round"
        //                                                                     className="event__btn"
        //                                                                     icon={<QrcodeOutlined />}
        //                                                                     onClick={() => handleShowQRCode(eventDetail.uid)}
        //                                                                 >{"View QR"}
        //                                                                 </Button>
        //                                                                 : !eventDetail.creator_event.qr_code_string && eventDetail.status == "accept" ?
        //                                                                     <Popconfirm
        //                                                                         title="Are you sure create this QR code?"
        //                                                                         onConfirm={() => handleCreateQRCode(eventDetail.uid)}
        //                                                                         okText="Yes"
        //                                                                         cancelText="No"
        //                                                                     >
        //                                                                         <Button
        //                                                                             className="event__btn"
        //                                                                             icon={<AppstoreAddOutlined />} >{"Create QR"}
        //                                                                         </Button>
        //                                                                     </Popconfirm> : ""
        //                                                         }
        //                                                         {
        //                                                             eventDetail.calendar?.meeting_url == false && eventDetail.status == "accept" ?
        //                                                                 <Button
        //                                                                     className="event__btn"
        //                                                                     icon={<AppstoreAddOutlined />}
        //                                                                     onClick={() => showConfirm(eventDetail.uid)}>{"General Link"}
        //                                                                 </Button> : eventDetail.is_online == true && eventDetail.status == "accept" ?
        //                                                                     <a href={eventDetail.calendar?.meeting_url}>
        //                                                                         <Button
        //                                                                             className="event__btn"
        //                                                                             icon={<AppstoreAddOutlined />}>{"Join Event"}
        //                                                                         </Button>
        //                                                                     </a> : ""
        //                                                         }
        //                                                         {
        //                                                             eventDetail.status == "pending" ?
        //                                                                 <Button
        //                                                                     className="event__btn"
        //                                                                     icon={<EditOutlined />}
        //                                                                     onClick={() => handleEventEdit(eventDetail.uid)}>{"Edit"}
        //                                                                 </Button> : eventDetail.status == "accept" && localStorage.getItem('role') == "admin" || localStorage.getItem('role') == "admin" ?
        //                                                                     <Button
        //                                                                         className="event__btn"
        //                                                                         icon={<EditOutlined />}
        //                                                                         onClick={() => handleEventEdit(eventDetail.uid)}>{"Edit"}
        //                                                                     </Button> : null
        //                                                         }
        //                                                         {eventDetail.creator_event.is_creator == true && eventDetail.status != "cancel" && localStorage.getItem("role") == "creator" ?
        //                                                             <Popconfirm
        //                                                                 title="Are you sure delete this event?"
        //                                                                 onConfirm={() => handleDeleteEvent(eventDetail.uid)}
        //                                                                 okText="Yes"
        //                                                                 cancelText="No"
        //                                                             >
        //                                                                 <Button
        //                                                                     className="event__btn"
        //                                                                     icon={<DeleteOutlined />} >{"Delete"}
        //                                                                 </Button>
        //                                                             </Popconfirm>
        //                                                             : localStorage.getItem("role") == "admin" ?
        //                                                                 <Popconfirm
        //                                                                     title="Are you sure delete this event?"
        //                                                                     onConfirm={() => handleDeleteEvent(eventDetail.uid)}
        //                                                                     okText="Yes"
        //                                                                     cancelText="No"
        //                                                                 >
        //                                                                     <Button
        //                                                                         className="event__btn"
        //                                                                         icon={<DeleteOutlined />} >{"Delete"}
        //                                                                     </Button>
        //                                                                 </Popconfirm>
        //                                                                 :
        //                                                                 ""}
        //                                                         {localStorage.getItem("role") == "creator" && eventDetail.status == "cancel" ?
        //                                                             <Button
        //                                                                 className="event__btn"
        //                                                                 icon={<TagOutlined />} 
        //                                                                 onClick={() => handleVisibleReject(eventDetail.note)}
        //                                                                 >{"Reasons"}
        //                                                             </Button>
        //                                                             :
        //                                                             ""}
        //                                                         <Modal
        //                                                             title="QR code"
        //                                                             visible={visible}
        //                                                             onOk={hideDownload}
        //                                                             onCancel={hideModal}
        //                                                             okText="DOWNLOAD"
        //                                                             cancelText="CANCEL"
        //                                                             style={{ textAlign: 'center' }}
        //                                                         >
        //                                                             <QRCode
        //                                                                 id='qrcode'
        //                                                                 value={qrCode}
        //                                                                 fgColor="#000000"
        //                                                                 size={300}
        //                                                                 level={'H'}
        //                                                                 includeMargin={false}
        //                                                             />
        //                                                         </Modal>
        //                                                     </Row>
        //                                                 </div>
        //                                             </Col>
        //                                         </Row>
        //                                     </Card>
        //                                 </div>
        //                             </Badge.Ribbon>
        //                         </div>
        //                         :
        //                         <div id="my__event">
        //                             <Badge.Ribbon text="OFFLINE" color="#F7941D" style={{ paddingRight: 20 }}>
        //                                 <div id="my__event_container__list" style={{ padding: 12 }}>
        //                                     <Card bordered={false} style={{ borderRadius: 6 }}>
        //                                         <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        //                                             <Col style={{ paddingRight: 0 }} span={6}>
        //                                                 {eventDetail?.avatar?.length > 0 ? <img src={eventDetail.avatar} alt="" className="image" style={{ height: 165, width: '97%' }}></img> : <img className="image" style={{ height: 160, width: '97%' }} alt="" src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/169963/photo-1429043794791-eb8f26f44081.jpeg' ></img>}
        //                                             </Col>
        //                                             <Col style={{ paddingRight: 0 }} span={7}>
        //                                                 <Title style={{ marginBottom: 1, color: '#d4380d', fontSize: 15.5, fontFamily: 'Inter, sans-serif' }} level={5}>{eventDetail.event_name}</Title>
        //                                                 <p style={{ margin: 0, fontSize: 14, marginBottom: 1 }}>{eventDetail.createdBy?.firstName ? <UserOutlined /> : <HomeOutlined />}
        //                                                     <u style={{ paddingLeft: 5 }}>
        //                                                         {eventDetail.organization}
        //                                                     </u>
        //                                                 </p>
        //                                                 <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
        //                                                     <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
        //                                                     <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        //                                                 </svg>{eventDetail.location}</p>
        //                                                 <p style={{ marginTop: 5, fontSize: 14, marginBottom: 1 }}><CalendarOutlined />  {DateTime(eventDetail.start_at, DATE_TIME_FORMAT)} - {DateTime(eventDetail.end_at, DATE_TIME_FORMAT)}</p>
        //                                                 <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><TeamOutlined /> Number Of Participants: <Tag color="blue">{eventDetail.count_join_event}/{eventDetail.size}</Tag></p>
        //                                                 {
        //                                                     eventDetail.status == "pending" ?
        //                                                         <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="red">{eventDetail.status.toUpperCase()}</Tag></p> :
        //                                                         eventDetail.status == "accept" ?
        //                                                             <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="green">{eventDetail.status.toUpperCase()}</Tag></p> :
        //                                                             <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="default">{eventDetail.status.toUpperCase()}</Tag></p>
        //                                                 }
        //                                                 <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-lock" viewBox="0 0 16 16">
        //                                                     <path d="M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0zM7 7v1h2V7a1 1 0 0 0-2 0zM6 9.3v2.4c0 .042.02.107.105.175A.637.637 0 0 0 6.5 12h3a.64.64 0 0 0 .395-.125c.085-.068.105-.133.105-.175V9.3c0-.042-.02-.107-.105-.175A.637.637 0 0 0 9.5 9h-3a.637.637 0 0 0-.395.125C6.02 9.193 6 9.258 6 9.3z" />
        //                                                     <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
        //                                                 </svg>Score: <Tag color="geekblue">{eventDetail?.scope}</Tag></p>
        //                                                 {eventDetail.type_event.map((item, index) => {
        //                                                     return (
        //                                                         <Tag key={index} style={{ marginRight: 5, marginTop: 5, fontSize: 13 }}>{item.toUpperCase()}</Tag>
        //                                                     )
        //                                                 })}
        //                                             </Col>
        //                                             <Col style={{ paddingLeft: 0, paddingRight: 0 }} span={6}>
        //                                                 <p style={{ margin: 0, fontSize: 14 }} className="event_container__fixLine" dangerouslySetInnerHTML={{ __html: eventDetail.description }}></p>
        //                                             </Col>
        //                                             <Col style={{ paddingLeft: 0, paddingRight: 0, width: 10 }} span={0}>
        //                                             </Col>
        //                                             <Col style={{ textAlign: "center", float: "left" }} span={5}>
        //                                                 <div style={{ borderLeft: '1px solid #D3D3D3', height: '100%', float: "left", paddingRight: 2 }}></div>
        //                                                 <div className="event__button-wrap">
        //                                                     <Row
        //                                                         justify="center"
        //                                                     >
        //                                                         <Button
        //                                                             className="event__btn"
        //                                                             icon={<EyeOutlined />}
        //                                                             onClick={() => handleDetailView(eventDetail.uid)}
        //                                                         >{"View"}
        //                                                         </Button>
        //                                                         {
        //                                                             eventDetail.creator_event.qr_code_string && eventDetail.status !== "pending" ?
        //                                                                 <Button
        //                                                                     shape="round"
        //                                                                     className="event__btn"
        //                                                                     icon={<QrcodeOutlined />}
        //                                                                     onClick={() => handleShowQRCode(eventDetail.uid)}
        //                                                                 >{"View QR"}
        //                                                                 </Button>
        //                                                                 : !eventDetail.creator_event.qr_code_string && eventDetail.status == "accept" ?
        //                                                                     <Popconfirm
        //                                                                         title="Are you sure create this QR code?"
        //                                                                         onConfirm={() => handleCreateQRCode(eventDetail.uid)}
        //                                                                         okText="Yes"
        //                                                                         cancelText="No"
        //                                                                     >
        //                                                                         <Button
        //                                                                             className="event__btn"
        //                                                                             icon={<AppstoreAddOutlined />} >{"Create QR"}
        //                                                                         </Button>
        //                                                                     </Popconfirm> : ""
        //                                                         }
        //                                                         {
        //                                                             eventDetail.status == "pending" ?
        //                                                                 <Button
        //                                                                     className="event__btn"
        //                                                                     icon={<EditOutlined />}
        //                                                                     onClick={() => handleEventEdit(eventDetail.uid)}>{"Edit"}
        //                                                                 </Button> : eventDetail.status == "accept" && localStorage.getItem('role') == "admin" || localStorage.getItem('role') == "admin" ?
        //                                                                     <Button
        //                                                                         className="event__btn"
        //                                                                         icon={<EditOutlined />}
        //                                                                         onClick={() => handleEventEdit(eventDetail.uid)}>{"Edit"}
        //                                                                     </Button> : null
        //                                                         }
        //                                                         {eventDetail.creator_event.is_creator == true && eventDetail.status != "cancel" && eventDetail.status != "accept" && localStorage.getItem("role") == "creator" ?
        //                                                             <Popconfirm
        //                                                                 title="Are you sure delete this event?"
        //                                                                 onConfirm={() => handleDeleteEvent(eventDetail.uid)}
        //                                                                 okText="Yes"
        //                                                                 cancelText="No"
        //                                                             >
        //                                                                 <Button
        //                                                                     className="event__btn"
        //                                                                     icon={<DeleteOutlined />} >{"Delete"}
        //                                                                 </Button>
        //                                                             </Popconfirm>
        //                                                             :
        //                                                             ""}
        //                                                         {localStorage.getItem("role") == "admin" ?
        //                                                             <Popconfirm
        //                                                                 title="Are you sure delete this event?"
        //                                                                 onConfirm={() => handleDeleteEvent(eventDetail.uid)}
        //                                                                 okText="Yes"
        //                                                                 cancelText="No"
        //                                                             >
        //                                                                 <Button
        //                                                                     className="event__btn"
        //                                                                     icon={<DeleteOutlined />} >{"Delete"}
        //                                                                 </Button>
        //                                                             </Popconfirm>
        //                                                             :
        //                                                             ""}
        //                                                         {localStorage.getItem("role") == "creator" && eventDetail.status == "cancel" ?
        //                                                             <Button
        //                                                                 className="event__btn"
        //                                                                 icon={<TagOutlined />}
        //                                                                 onClick={() => handleVisibleReject(eventDetail.note)}

        //                                                             >{"Reasons"}
        //                                                             </Button>
        //                                                             :
        //                                                             ""}

        //                                                         <Modal
        //                                                             title="QR code"
        //                                                             visible={visible}
        //                                                             onOk={hideDownload}
        //                                                             onCancel={hideModal}
        //                                                             okText="DOWNLOAD"
        //                                                             cancelText="CANCEL"
        //                                                             style={{ textAlign: 'center' }}
        //                                                         >
        //                                                             <QRCode
        //                                                                 id='qrcode'
        //                                                                 value={qrCode}
        //                                                                 fgColor="#000000"
        //                                                                 size={300}
        //                                                                 level={'H'}
        //                                                                 includeMargin={false}
        //                                                             />
        //                                                         </Modal>
        //                                                         <Modal
        //                                                             title="Reject Reason"
        //                                                             visible={visibleReject}
        //                                                             onOk={hideRejectReason}
        //                                                             onCancel={hideRejectReason}
        //                                                             okText="OK"
        //                                                             cancelText="CANCEL"
        //                                                             style={{ textAlign: 'center' }}
        //                                                         >
        //                                                             <Row>
        //                                                                 <p dangerouslySetInnerHTML={{ __html: note }} style={{ padding: 0, margin: 0, marginTop: 20 }}></p>
        //                                                             </Row>
        //                                                         </Modal>
        //                                                     </Row>
        //                                                 </div>
        //                                             </Col>
        //                                         </Row>
        //                                     </Card>
        //                                 </div>
        //                             </Badge.Ribbon>
        //                         </div>
        //                     }
        //                 </div>
        //             )
        //         })
        //         }
        //         <Pagination style={{ textAlign: "center", marginBottom: 20 }} current={currentPage} defaultCurrent={1} total={totalEvent} onChange={handlePage}></Pagination>
        //         <BackTop style={{ textAlign: 'right' }} />
        //     </Spin>
        // </div >
        <div>hello</div>
    )
}

export default MyEvent;