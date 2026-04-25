const express = require("express");
const cors = require("cors");
const path = require("path"); // Thêm thư viện này để đọc file giao diện
const app = express();

// Render sẽ cấp cổng tự động qua process.env.PORT, nếu không có thì dùng 10000
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Cấu hình để Render có thể hiển thị các file HTML, CSS, JS của em
app.use(express.static(path.join(__dirname, "./"))); 

app.post("/api/register", (req, res) => {
    const { fullName, phone, course } = req.body;
    if (!fullName || !phone || !course) {
        return res.status(400).json({
            message: "Vui lòng nhập đầy đủ thông tin."
        });
    }
    console.log("Dữ liệu đăng ký mới:", {
        fullName,
        phone,
        course,
        createdAt: new Date().toISOString()
    });
    return res.status(200).json({
        message: "Thông tin của bạn đã được gửi thành công! CTI HSK sẽ liên hệ sớm."
    });
});

// Quan trọng: Phải lắng nghe trên 0.0.0.0 để Render kết nối được
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});