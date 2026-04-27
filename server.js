const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const app = express();

// ============= CẤU HÌNH =============
const PORT = process.env.PORT || 10000;
const GOOGLE_SHEETS_ID = "1mvCb8wiSpdvJzpojNG21VH-ny9JLP5xCGBhIqzjFywM"; 
const SHEET_NAME = "Sheet1"; // Nhớ đổi tên tab ở dưới cùng file Sheet thành Sheet1 nhé

// ============= CẤU HÌNH EMAIL GMAIL =============
const EMAIL_CONFIG = {
    service: "gmail",
    auth: {
        user: "tranminhthien@gmail.com", // Đổi thành email của bạn (nếu có đuôi @gmail.com)
        pass: "xxxx xxxx xxxx xxxx" // ĐIỀN MẬT KHẨU ỨNG DỤNG (16 KÝ TỰ) VÀO ĐÂY
    }
};

// ============= MIDDLEWARE =============
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./")));

// ============= HÀM GỬI EMAIL =============
async function sendEmailNotification(fullName, phone, course) {
    try {
        const transporter = nodemailer.createTransport(EMAIL_CONFIG);

        const emailContent = `
<html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #d32f2f;">Thông báo đăng ký khóa học mới</h2>
        <p>Bạn có <strong>1 đơn đăng ký mới</strong> từ:</p>
        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Họ và tên:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${fullName}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Số điện thoại:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${phone}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Khóa học:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${course}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Thời gian đăng ký:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${new Date().toLocaleString('vi-VN')}</td>
            </tr>
        </table>
        <p style="color: #666;">Vui lòng kiểm tra thông tin và liên hệ học viên sớm nhất.</p>
        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">Email này được gửi tự động từ hệ thống.</p>
    </body>
</html>
        `;

        const mailOptions = {
            from: EMAIL_CONFIG.auth.user,
            to: "bfcenter2023@gmail.com", 
            subject: `Đơn đăng ký mới từ ${fullName}`,
            html: emailContent
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Email thông báo đã gửi thành công");
        return true;
    } catch (error) {
        console.error("❌ Lỗi gửi email:", error.message);
        return false;
    }
}

// ============= HÀM GHI DỮ LIỆU VÀO GOOGLE SHEETS =============
async function appendToGoogleSheets(fullName, phone, course) {
    try {
        const credentialsPath = path.join(__dirname, "credentials.json");
        if (!fs.existsSync(credentialsPath)) {
            console.error("❌ Thiếu file credentials.json trên server!");
            return false;
        }

        const auth = new google.auth.GoogleAuth({
            keyFile: credentialsPath,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"]
        });

        const sheets = google.sheets({ version: "v4", auth });

        const request = {
            spreadsheetId: GOOGLE_SHEETS_ID,
            range: `${SHEET_NAME}!A:D`, 
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[
                    new Date().toLocaleString('vi-VN', { timeZone: "Asia/Ho_Chi_Minh" }),
                    fullName,
                    phone,
                    course
                ]]
            }
        };

        await sheets.spreadsheets.values.append(request);
        console.log("✅ Dữ liệu đã ghi vào Google Sheets thành công!");
        return true;
    } catch (error) {
        console.error("❌ Lỗi ghi Google Sheets:", error.message);
        return false;
    }
}

// ============= API ĐĂNG KÝ =============
app.post("/api/register", async (req, res) => {
    try {
        const { fullName, phone, course } = req.body;

        if (!fullName || !phone || !course) {
            return res.status(400).json({
                success: false,
                message: "❌ Vui lòng nhập đầy đủ thông tin (Họ tên, Số điện thoại, Khóa học)."
            });
        }

        if (!/^\d{10,11}$/.test(phone.replace(/[^0-9]/g, ""))) {
            return res.status(400).json({
                success: false,
                message: "❌ Số điện thoại không hợp lệ."
            });
        }

        console.log("📋 Nhận yêu cầu đăng ký:", { fullName, phone, course });

        await sendEmailNotification(fullName, phone, course);
        await appendToGoogleSheets(fullName, phone, course);

        return res.status(200).json({
            success: true,
            message: "✅ Cảm ơn bạn! Thông tin đã được gửi thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất."
        });
    } catch (error) {
        console.error("❌ Lỗi API đăng ký:", error.message);
        return res.status(500).json({
            success: false,
            message: "❌ Có lỗi xảy ra. Vui lòng thử lại sau."
        });
    }
});

// ============= ROUTE MẶC ĐỊNH =============
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ============= KHỞI ĐỘNG SERVER =============
app.listen(PORT, "0.0.0.0", () => {
    console.log(`
╔════════════════════════════════════════════╗
║  🎓 NGOẠI NGỮ PHƯƠNG THẢO - Backend        ║
║  📍 Server đang chạy tại port: ${PORT}      ║
╚════════════════════════════════════════════╝
    `);
});