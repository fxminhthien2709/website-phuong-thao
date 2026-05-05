const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
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

// ============= CẤU HÌNH MULTER UPLOAD PDF =============
// Tạo thư mục documents nếu chưa tồn tại
const documentsDir = path.join(__dirname, "documents");
if (!fs.existsSync(documentsDir)) {
    fs.mkdirSync(documentsDir, { recursive: true });
    console.log("✅ Thư mục documents đã được tạo");
}

// Cấu hình Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, documentsDir);
    },
    filename: (req, file, cb) => {
        // Tạo tên file an toàn: xóa ký tự đặc biệt, thêm timestamp
        const sanitizedName = file.originalname
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .replace(/_{2,}/g, '_');
        const timestamp = Date.now();
        cb(null, `${timestamp}_${sanitizedName}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Chỉ cho phép upload file PDF
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Chỉ cho phép upload file PDF'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // Giới hạn 50MB
});

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

// ============= ROUTES ĐĂNG NHẬP & DASHBOARD HỌC TẬP =============
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/learning', (req, res) => {
    res.sendFile(path.join(__dirname, 'learning.html'));
});

// ============= API UPLOAD PDF (ADMIN) =============
/**
 * POST /api/upload-document
 * Chỉ Admin có thể upload tài liệu PDF
 * Yêu cầu: Bearer token xác thực
 * Body: multipart/form-data với file PDF
 */
app.post('/api/upload-document', (req, res) => {
    // Middleware xác thực (tùy chọn - có thể thêm token check)
    const adminToken = req.headers.authorization?.split(' ')[1];
    
    // Ví dụ token đơn giản (trong thực tế nên dùng JWT)
    const ADMIN_TOKEN = "admin_secret_token_2024";
    
    if (!adminToken || adminToken !== ADMIN_TOKEN) {
        return res.status(401).json({
            success: false,
            message: "❌ Không có quyền truy cập. Vui lòng cung cấp token Admin."
        });
    }

    // Sử dụng multer middleware
    upload.single('file')(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'FILE_TOO_LARGE') {
                    return res.status(400).json({
                        success: false,
                        message: "❌ File quá lớn. Giới hạn tối đa 50MB."
                    });
                }
            }
            return res.status(400).json({
                success: false,
                message: `❌ Lỗi upload: ${err.message}`
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "❌ Vui lòng chọn file để upload."
            });
        }

        console.log(`✅ File PDF đã được upload: ${req.file.filename}`);
        res.status(200).json({
            success: true,
            message: "✅ Tài liệu đã được upload thành công.",
            file: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                uploadTime: new Date().toLocaleString('vi-VN'),
                downloadUrl: `/documents/${req.file.filename}`
            }
        });
    });
});

// ============= API LẤY DANH SÁCH DOCUMENTS =============
/**
 * GET /api/documents
 * Lấy danh sách tất cả file PDF đã upload
 */
app.get('/api/documents', (req, res) => {
    try {
        const files = fs.readdirSync(documentsDir);
        const documents = files
            .filter(file => file.endsWith('.pdf'))
            .map(file => ({
                filename: file,
                downloadUrl: `/documents/${file}`,
                uploadTime: fs.statSync(path.join(documentsDir, file)).mtime
            }))
            .sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));

        res.status(200).json({
            success: true,
            count: documents.length,
            documents: documents
        });
    } catch (error) {
        console.error("❌ Lỗi lấy danh sách documents:", error.message);
        res.status(500).json({
            success: false,
            message: "❌ Lỗi khi lấy danh sách tài liệu."
        });
    }
});

// ============= SERVE STATIC DOCUMENTS =============
// Cho phép download file từ thư mục documents
app.use('/documents', express.static(documentsDir));

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