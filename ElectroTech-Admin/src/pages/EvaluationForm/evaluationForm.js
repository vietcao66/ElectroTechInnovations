import React, { useEffect, useState } from "react";
import "./evaluationForm.css";
import {  Card,  Spin, List, Typography, Row, Col } from 'antd';
import { UnorderedListOutlined, SmallDashOutlined } from '@ant-design/icons';

const { Title } = Typography;

const data = [
    {
        title: 'Biểu mẫu số 1',
    },
    {
        title: 'Biểu mẫu số 2',
    },
    {
        title: 'Biểu mẫu số 3',
    },
    {
        title: 'Biểu mẫu số 4',
    },
    {
        title: 'Biểu mẫu số 5',
    },
    {
        title: 'Biểu mẫu số 6',
    },
];

const EvaluationForm = () => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(function () {  setLoading(false); }, 500);
    }, [])

    return (
        <Spin spinning={loading}>
            <div id="container__evaluation">
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 2,
                        lg: 3,
                        xl: 4,
                        xxl: 5,
                    }}
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <Card >
                                <img style={{ height: 170, marginBottom: 15 }} alt="" src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/169963/photo-1429043794791-eb8f26f44081.jpeg' ></img>
                                <Title level={5}>{item.title}</Title>
                                <Row>
                                    <Col span={2}>
                                        <p><UnorderedListOutlined /></p>
                                    </Col>
                                    <Col span={8}>
                                        <p style={{ marginLeft: 6 }}>Administrator</p>
                                    </Col>
                                    <Col className="column_three" span={14}>
                                        <p class="column_three__text"><SmallDashOutlined /></p>
                                    </Col>
                                </Row>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        </Spin>
    )
}

export default EvaluationForm;