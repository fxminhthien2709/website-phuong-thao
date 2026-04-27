const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 10000;

// ============= CẤU HÌNH (THAY THÔNG TIN CỦA BẠN TẠI ĐÂY) =============
const GOOGLE_SHEETS_ID = "1mvCb8wiSpdvJzpojNG21VH-ny9JLP5xCGBhIqzjFywM";
const SHEET_NAME = "Sheet1"; // Đảm bảo tab dưới cùng tên là Sheet1

const EMAIL_USER = "tranminhthien@gmail.com"; 
const EMAIL_PASS = "xxxx xxxx xxxx xxxx"; // DÁN MẬT KHẨU ỨNG DỤNG 16 KÝ TỰ VÀO ĐÂY
const RECEIVER_EMAIL = "bfcenter2023@gmail.com";
// ====================================================================

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./")));

// Hàm ghi Sheet
async function appendToSheet(data) {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });
    
    await sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SHEETS_ID,
        range: `${SHEET_NAME}!A:D`,
        valueInputOption: "USER_ENTERED",
        resource: { values: [data] },
    });
}

// API nhận đăng ký
app.post("/api/register", async (req, res) => {
    const { fullName, phone, course } = req.body;
    console.log("📩 Nhận dữ liệu từ web:", { fullName, phone, course });

    try {
        const timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

        // 1. Ghi vào Google Sheets
        await appendToSheet([timestamp, fullName, phone, course]);
        console.log("✅ Đã ghi vào Sheet");

        // 2. Gửi Email thông báo
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: EMAIL_USER, pass: EMAIL_PASS }
        });

        await transporter.sendMail({
            from: EMAIL_USER,
            to: RECEIVER_EMAIL,
            subject: `HỌC VIÊN MỚI: ${fullName.toUpperCase()}`,
            html: `<h3>Thông tin đăng ký:</h3><p>Họ tên: ${fullName}</p><p>SĐT: ${phone}</p><p>Khóa học: ${course}</p>`
        });
        console.log("✅ Đã gửi email");

        res.status(200).json({ success: true, message: "Đăng ký thành công!" });
    } catch (error) {
        console.error("❌ Lỗi xử lý:", error.message);
        res.status(500).json({ success: false, message: "Lỗi hệ thống: " + error.message });
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server đang chạy tại cổng ${PORT}`);
});