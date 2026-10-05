<div align="center">
  <h1>🎓 Zulystudy</h1>
  <p><strong>Bật cam lên, giờ học tự chạy trên Discord</strong></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
  [![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?logo=discord&logoColor=white)](https://discord.js.org/)
</div>

<hr/>

## 🌟 Giới Thiệu
**Zulystudy** là một hệ sinh thái bao gồm Bot Discord và hệ thống Website thống kê tự động. Giải pháp hoàn hảo dành cho các nhóm học tập trên Discord, giúp tự động bấm giờ học cho thành viên khi họ **bật camera** trong kênh thoại.

## ✨ Tính Năng Nổi Bật
- 🎥 **Tự Động Bấm Giờ**: Bắt đầu tính giờ ngay khi bật camera, và tự động lưu lại khi tắt cam hoặc rời phòng.
- ⚡ **Siêu Tốc Độ**: Backend API xây dựng trên **Hono.js** và chạy trên **Cloudflare Workers** đem lại thời gian phản hồi cực nhanh.
- 📊 **Thống Kê Trực Quan**: Landing page đi kèm cung cấp bảng xếp hạng thi đua giờ học đẹp mắt.
- 🔒 **An Toàn Tuyệt Đối**: Bot chỉ lắng nghe sự kiện Bật/Tắt cam, **TUYỆT ĐỐI KHÔNG** xem hay lưu trữ hình ảnh của người dùng.

## 🏗️ Kiến Trúc Hệ Thống
Dự án được chia thành 3 phần chính để tối ưu hóa hoàn toàn (hoạt động 100% trên gói miễn phí):

1. `frontend/`: Giao diện Web HTML/CSS/JS thuần, có thể đẩy lên **Cloudflare Pages**.
2. `backend/`: RESTful API viết bằng **Hono**, thiết kế để chạy serverless trên **Cloudflare Workers**.
3. `bot/`: Source code Bot viết bằng **Discord.js**, chuyên dùng để duy trì kết nối WebSocket lắng nghe trạng thái Voice.

## 🚀 Hướng Dẫn Cài Đặt (Local)

### Yêu Cầu Tiên Quyết
- [Node.js](https://nodejs.org/en/) (v18 trở lên)
- Một [Discord Bot Token](https://discord.com/developers/applications)

### Các Bước Khởi Chạy
**1. Tải source code:**
```bash
git clone https://github.com/griin-03/zulystudy.git
cd zulystudy
```

**2. Cài đặt các gói phụ thuộc:**
```bash
npm install
```

**3. Cấu hình biến môi trường:**
- Vào thư mục `bot/` đổi tên `bot/.env.example` thành `bot/.env`
- Dán Discord Token của bạn vào file đó.

**4. Chạy toàn bộ hệ thống bằng 1 lệnh:**
Dự án được tích hợp sẵn công cụ chạy đồng thời cực kỳ tiện lợi.
```bash
npm run dev
```

Hệ thống sẽ tự động khởi chạy 3 tiến trình:
- 🔵 **Frontend**: `http://localhost:3000`
- 🟢 **Backend**: `http://localhost:8787`
- 🟡 **Bot**: Kích hoạt trạng thái trực tuyến trên Discord.

---
<div align="center">
  <i>Được phát triển với ❤️ dành riêng cho cộng đồng học tập trực tuyến.</i>
</div>
