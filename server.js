const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Render cấp cổng tự động, nếu không có thì dùng 10000
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Cấu hình để hiển thị giao diện index.html
app.use(express.static(path.join(__dirname, "./")));

app.post("/api/register", (req, res) => {
    const { fullName, phone, course } = req.body;
    if (!fullName || !phone || !course) {
        return res.status(400).json({
            message: "Vui lòng nhập đầy đủ thông tin."
        });
    }
    console.log("Dữ liệu đăng ký mới:", { fullName, phone, course });
    return res.status(200).json({
        message: "Thông tin của bạn đã được gửi thành công!"
    });
}); // Đã thêm dấu đóng ngoặc } quan trọng ở đây

// Lắng nghe trên 0.0.0.0 để Render có thể quét thấy Port
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});