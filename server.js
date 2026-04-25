const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.post("/api/register", (req, res) => {
    const { fullName, phone, course } = req.body;
    if (!fullName || !phone || !course) {
        return res.status(400).json({
            message: "Vui lòng nhập đầy đủ thông tin."
        });
    }
    console.log("Dữ liệu đăng ký mới:");
    console.log({
        fullName,
        phone,
        course,
        createdAt: new Date().toISOString()
    });
    return res.status(200).json({
        message: "Thông tin của bạn đã được gửi thành công! CTI HSK sẽ liên hệ sớm."
    });
});
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});