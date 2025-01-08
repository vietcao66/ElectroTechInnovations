import React, { useState, useEffect } from "react";
import "./news.css";
import { DatePicker, Input } from 'antd';
import { Card, Table, Space, Tag, PageHeader, Divider, Form, List, notification } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, AimOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import axiosClient from "../../apis/axiosClient";
import productApi from "../../apis/productApi";
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

const { Search } = Input;

const News = () => {

    const [news, setNews] = useState([]);
    let history = useHistory();


    useEffect(() => {
        (async () => {
            try {
                await productApi.getNews().then((item) => {
                    setNews(item.data.docs);
                });

            } catch (error) {
                console.log('Failed to fetch event detail:' + error);
            }
        })();
        window.scrollTo(0, 0);
    }, [])
    return (
        <div>
            <div class="pt-5 pb-5 container">
                <h2>
                    Tin tức mới nhất
                </h2>
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 4,
                        lg: 4,
                        xl: 6,
                        xxl: 4,
                    }}
                    dataSource={news}
                    renderItem={(item) => (
                        <Link to={`/news/${item._id}`}>
                            <Card>
                                <div style={{ padding: 20 }}>{item.name}</div>
                                <img src={item.image} alt="News Image" style={{ width: '100%', height: 'auto' }} />
                            </Card>
                        </Link>
                    )}
                />

            </div>
        </div>
    )
}

export default News;
