import React, { useState, useEffect } from "react";
import "./news.css";
import { DatePicker, Input } from "antd";
import {
  Card,
  Table,
  Space,
  Tag,
  PageHeader,
  Divider,
  Form,
  List,
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
import productApi from "../../apis/productApi";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

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
        console.log("Failed to fetch event detail:" + error);
      }
    })();
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <div class="pt-5 pb-5 container">
        <h1 class="text-center">Tin tức</h1>
        <Divider />

        <section class="container py-5">
          <h1 class="text-center mb-4">
            Công nghệ giúp hàng triệu người xem video cùng lúc thế nào
          </h1>
          <p class="lead text-center text-muted">
            Sự bùng nổ của video phát trực tiếp đòi hỏi sự nâng cấp về công nghệ
            để phục vụ hàng chục triệu người xem trên toàn thế giới.
          </p>

          <div class="row mt-5">
            <div class="col-md-8 mx-auto">
              <p>
                Video trực tiếp và theo yêu cầu chiếm khoảng 66% lưu lượng
                Internet toàn cầu vào năm 2022. 10 ngày có lưu lượng Internet
                cao nhất năm 2024 trùng với các sự kiện livestream, ví dụ Giải
                bóng bầu dục nhà nghề Mỹ (NFL) hay trận boxing của Mike Tyson -
                Jake Paul. Netflix cho biết, trận đấu diễn ra tháng 11 năm ngoái
                này thu hút 108 triệu người xem, với 65 triệu lượt phát trực
                tiếp cùng lúc.
              </p>

              <figure class="text-center my-4">
                <img
                  src="https://res.cloudinary.com/dz9zsaofp/image/upload/nckje0yoehlcfu1qkxqn"
                  alt="Người dùng xem video trên điện thoại"
                  class="img-fluid rounded shadow-sm"
                />
                <figcaption class="text-muted mt-2">
                  Người dùng xem video trên điện thoại. Ảnh: Canva
                </figcaption>
              </figure>

              <h2>Phân mảnh video</h2>
              <p>
                Theo Chetan Jaiswal, phó giáo sư khoa học máy tính tại Đại học
                Quinnipiac, có hai thách thức lớn cần giải quyết liên quan đến
                nội dung video, kể cả phát trực tiếp hay ghi hình trước. Thứ
                nhất, video có dung lượng lớn, khiến việc truyền từ nguồn đến
                thiết bị như TV, máy tính, máy tính bảng và điện thoại tốn thời
                gian. Thứ hai, phát trực tiếp phải thích ứng với sự khác biệt về
                thiết bị và Internet của người xem, như màn hình độ phân giải
                thấp hay cao, tốc độ Internet chậm hay nhanh.
              </p>

              <p>
                Để giải quyết, nhà cung cấp thực hiện hàng loạt thao tác. Bước
                đầu tiên là phân mảnh video thành nhiều phần nhỏ hơn, gọi là
                đoạn (chunk). Các đoạn này sau đó trải qua quá trình "mã hóa và
                nén", giúp tối ưu hóa video cho các độ phân giải và tốc độ bit
                khác nhau để phù hợp với nhiều loại thiết bị và điều kiện mạng.
              </p>

              <p>
                Khi người xem bấm vào video, hệ thống tự động chọn chuỗi đoạn
                phù hợp với khả năng của thiết bị về độ phân giải màn hình và
                tốc độ Internet. Trình phát video trên máy sẽ lắp ráp và phát
                các đoạn theo trình tự để tạo ra trải nghiệm liền mạch.
              </p>

              <p>
                Khi Internet chậm, hệ thống cung cấp các đoạn chất lượng thấp để
                đảm bảo phát mượt. Đây là lý do người xem thấy chất lượng video
                giảm khi tốc độ kết nối giảm. Nếu video dừng trong khi phát,
                nguyên nhân thường là trình phát đang chờ đệm thêm các đoạn từ
                nhà cung cấp.
              </p>

              <h2>Khoảng cách địa lý và sự tắc nghẽn</h2>
              <p>
                Việc cung cấp nội dung video trên quy mô lớn đặt ra thách thức
                khổng lồ. Các nền tảng như YouTube và Netflix có thư viện video
                đồ sộ, cũng như quản lý hàng loạt luồng phát trực tiếp khắp thế
                giới.
              </p>

              <p>
                Phương pháp đơn giản là xây một trung tâm dữ liệu lớn và lưu mọi
                video, sau đó phát cho người xem qua Internet. Tuy nhiên, cách
                này không được ưa chuộng vì đi kèm với nhiều vấn đề. Đầu tiên là
                độ trễ địa lý - khoảng cách giữa người xem với trung tâm dữ liệu
                ảnh hưởng đến trải nghiệm. Ví dụ, nếu trung tâm dữ liệu đặt tại
                Arizona, người xem ở một bang khác của Mỹ sẽ gặp độ trễ tối
                thiểu, nhưng người ở Australia sẽ thấy độ trễ lớn hơn đáng kể do
                khoảng cách tăng và dữ liệu phải đi qua nhiều mạng liên kết.
              </p>

              <p>
                Vấn đề khác là nghẽn mạng. Càng nhiều người kết nối với trung
                tâm dữ liệu, các mạng càng trở nên "đông đúc", gây nghẽn khiến
                video bị tạm dừng. Ngoài ra, khi một video được gửi đồng thời
                cho nhiều người, dữ liệu trùng lặp di chuyển qua cùng đường liên
                kết Internet sẽ gây lãng phí băng thông.
              </p>

              <p>
                Việc dồn vào một trung tâm dữ liệu cũng tạo rủi ro lớn. Nếu
                trung tâm gặp sự cố, không ai có thể truy cập nội dung, dẫn đến
                gián đoạn dịch vụ hoàn toàn.
              </p>

              <h2>Mạng phân phối nội dung</h2>
              <p>
                Để vượt qua những thách thức này, đa số dựa vào mạng phân phối
                nội dung. Các mạng này cung cấp nội dung thông qua nhiều điểm
                hiện diện - cụm máy chủ lưu trữ bản sao nội dung nằm rải rác
                trên thế giới.
              </p>

              <p>
                Các nhà cung cấp mạng phân phối nội dung, như Akamai, Amazon
                CloudFront và Fastly, thực hiện hai chiến lược chính để triển
                khai điểm hiện diện. Đầu tiên là "đi sâu" với hàng nghìn "nút"
                điểm hiện diện nhỏ đặt gần người dùng hơn, thường tại các mạng
                của nhà cung cấp dịch vụ Internet. Điều này đảm bảo độ trễ tối
                thiểu vì đưa nội dung đến gần người dùng cuối nhất có thể.
              </p>

              <p>
                Chiến lược thứ hai là "đưa về nhà", tức hàng trăm cụm điểm hiện
                diện lớn hơn tại những vị trí chiến lược. Dù cách xa người dùng
                hơn so với chiến lược "đi sâu", các cụm như vậy lại có dung
                lượng lớn hơn, cho phép xử lý hiệu quả lưu lượng cao hơn. Cả hai
                chiến lược đều nhằm tối ưu hóa phát trực tiếp video thông qua
                giảm độ trễ, giảm lãng phí băng thông và đảm bảo trải nghiệm xem
                liền mạch cho người dùng.
              </p>

              <blockquote class="blockquote text-end mt-5">
                <p>
                  Sự phát triển thần tốc của Internet và sự bùng nổ video phát
                  trực tiếp đã làm thay đổi cách cung cấp video cho người dùng
                  trên toàn thế giới. Thách thức trong việc xử lý lượng dữ liệu
                  video khổng lồ, giảm độ trễ địa lý, đáp ứng nhiều thiết bị và
                  tốc độ Internet khác nhau đòi hỏi những giải pháp tinh vi.
                </p>
                <footer class="blockquote-footer">
                  Mạng phân phối nội dung xuất hiện như một giải pháp then chốt
                  để cung cấp video hiệu quả.
                </footer>
              </blockquote>
            </div>
          </div>
        </section>
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
                <img
                  src={item.image}
                  alt="News Image"
                  style={{ width: "100%", height: "auto" }}
                />
              </Card>
            </Link>
          )}
        />
      </div>
    </div>
  );
};

export default News;
