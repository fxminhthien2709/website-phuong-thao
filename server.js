const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Sử dụng cổng của Render hoặc 10000
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// DÒNG QUAN TRỌNG NHẤT: Để hiện giao diện web
// Nó sẽ tìm các file index.html, style.css, script.js trong cùng thư mục
app.use(express.static(path.join(__dirname, "./")));

// API xử lý đăng ký
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
});

// Trả về file index.html khi vào trang chủ
// Trả về file index.html khi vào trang chủ
app.get("/(.*)", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});