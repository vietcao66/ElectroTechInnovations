import React, { useState, useEffect } from "react";
import "./contact.css";
import { DatePicker, Input } from "antd";
import {
  Card,
  Table,
  Space,
  Tag,
  PageHeader,
  Divider,
  Form,
  Button,
  notification,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined,
  AimOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import axiosClient from "../../apis/axiosClient";

const { Search } = Input;

const Contact = () => {
  const [delivery, setDelivery] = useState([]);
  let history = useHistory();

  const onFinish = async (values) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    var date = yyyy + "-" + mm + "-" + dd;

    try {
      const formatData = {
        email: values.email,
        username: values.username,
        password: values.password,
        phone: values.phoneNo,
        role: "isClient",
        status: "actived",
      };
      await axiosClient
        .post("http://localhost:3100/api/auth/register", formatData)
        .then((response) => {
          console.log(response);
          if (response === "Email is exist") {
            return notification["error"]({
              message: "Thông báo",
              description: "Email đã tồn tại",
            });
          }
          if (response === undefined) {
            notification["error"]({
              message: "Thông báo",
              description: "Đăng ký thất bại",
            });
          } else {
            notification["success"]({
              message: "Thông báo",
              description: "Đăng kí thành công",
            });
            setTimeout(function () {
              history.push("/login");
            }, 1000);
          }
        });
    } catch (error) {
      throw error;
    }
  };
  return (
    <div id="container" class="pt-5">
      <div
        id="carouselMultiItemExample"
        class="carousel slide carousel-dark text-center"
        data-mdb-ride="carousel"
      >
        <div class="carousel-inner py-4">
          <div class="carousel-item active">
            <div class="container">
              <div class="row">
                <div class="col-lg-4">
                  <img
                    class="rounded-circle shadow-1-strong mb-4"
                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp"
                    alt="avatar"
                  />
                  <h5 class="mb-3">Đức Việt</h5>
                  <p>UX Designer</p>
                  <p class="text-muted">
                    <i class="fas fa-quote-left pe-2"></i>
                    Pain itself is pleasing to sit, elite consectetur. Because
                    those who officiate here desire what they seek to achieve
                    through it.
                  </p>
                  <ul class="list-unstyled d-flex justify-content-center text-warning mb-0">
                    <li>
                      <i class="fas fa-star fa-sm"></i>
                    </li>
                    <li>
                      <i class="fas fa-star fa-sm"></i>
                    </li>
                    <li>
                      <i class="fas fa-star fa-sm"></i>
                    </li>
                    <li>
                      <i class="fas fa-star fa-sm"></i>
                    </li>
                    <li>
                      <i class="fas fa-star fa-sm"></i>
                    </li>
                  </ul>
                </div>

                <div class="col-lg-4 d-none d-lg-block">
                  <img
                    class="rounded-circle shadow-1-strong mb-4"
                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp"
                    alt="avatar"
                  />
                  <h5 class="mb-3">Đức Việt</h5>
                  <p>Web Developer</p>
                  <p class="text-muted">
                    <i class="fas fa-quote-left pe-2"></i>
                    For indeed to the least I may come, who of us exercise of
                    the body undertakes laborious, unless that something
                    advantageous.
                  </p>
                  <ul class="list-unstyled d-flex justify-content-center text-warning mb-0">
                    <li>
                      <i class="fas fa-star fa-sm"></i>
                    </li>
                    <li>
                      <i class="fas fa-star fa-sm"></i>
                    </li>
                    <li>
                      <i class="fas fa-star fa-sm"></i>
                    </li>
                    <li>
                      <i class="fas fa-star fa-sm"></i>
                    </li>
                    <li>
                      <i class="fas fa-star-half-alt fa-sm"></i>
                    </li>
                  </ul>
                </div>

                <div class="col-lg-4 d-none d-lg-block">
                  <img
                    class="rounded-circle shadow-1-strong mb-4"
                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp"
                    alt="avatar"
                  />
                  <h5 class="mb-3">Đức Việt</h5>
                  <p>Photographer</p>
                  <p class="text-muted">
                    <i class="fas fa-quote-left pe-2"></i>
                    But truly them and we accuse and with just hatred the worthy
                    we lead who flatteries of the present pleasures share and
                    corrupt.
                  </p>
                  <ul class="list-unstyled d-flex justify-content-center text-warning mb-0">
                    <li>
                      <i class="fas fa-star fa-sm"></i>
                    </li>
                    <li>
                      <i class="fas fa-star fa-sm"></i>
                    </li>
                    <li>
                      <i class="fas fa-star fa-sm"></i>
                    </li>
                    <li>
                      <i class="fas fa-star fa-sm"></i>
                    </li>
                    <li>
                      <i class="far fa-star fa-sm"></i>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container pb-5">
        <section class="text-center">
          <h3 class="mb-5">Liên hệ</h3>
          <div class="row">
            <div class="col-lg-5">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.8139388581203!2d105.83992427370683!3d21.000094180642048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac71752d8f79%3A0xd2ec575c01017afa!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBLaW5oIFThur8gUXXhu5FjIETDom4gKE5FVSk!5e0!3m2!1svi!2s!4v1741109769050!5m2!1svi!2s"
                class="h-100 w-100"
                allowfullscreen=""
                loading="lazy"
              ></iframe>
            </div>

            <div class="col-lg-7">
              <form>
                <div class="row">
                  <div class="col-md-9">
                    <div class="row mb-4">
                      <div class="col-md-6 mb-4 mb-md-0">
                        <div class="form-outline">
                          <input
                            type="text"
                            id="form3Example1"
                            class="form-control"
                          />
                          <label class="form-label" for="form3Example1">
                            Họ tên
                          </label>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-outline">
                          <input
                            type="email"
                            id="form3Example2"
                            class="form-control"
                          />
                          <label class="form-label" for="form3Example2">
                            Địa chỉ email
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="form-outline mb-4">
                      <input
                        type="text"
                        id="form3Example3"
                        class="form-control"
                      />
                      <label class="form-label" for="form3Example3">
                        Chủ đề
                      </label>
                    </div>
                    <div class="form-outline mb-4">
                      <textarea
                        class="form-control"
                        id="form4Example3"
                        rows="4"
                      ></textarea>
                      <label class="form-label" for="form4Example3">
                        Nội dung
                      </label>
                    </div>
                    <div class="text-center text-md-start">
                      <button
                        type="submit"
                        class="btn btn-primary mb-5 mb-md-0"
                      >
                        Hoàn thành
                      </button>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <ul class="list-unstyled">
                      <li>
                        <i class="fas fa-map-marker-alt fa-2x text-primary"></i>
                        <p>
                          <small>Hai Bà Trưng - Hà Nội - Việt Nam</small>
                        </p>
                      </li>
                      <li>
                        <i class="fas fa-phone fa-2x text-primary"></i>
                        <p>
                          <small>+ 00 000 000 00</small>
                        </p>
                      </li>
                      <li>
                        <i class="fas fa-envelope fa-2x text-primary"></i>
                        <p>
                          <small>contact@gmail.com</small>
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
