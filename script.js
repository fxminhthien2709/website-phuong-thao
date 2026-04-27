// Hamburger menu toggle
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav = document.getElementById('mobileNav');

if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });
    
    // Close menu when a link is clicked
    const navLinks = mobileNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });
    
    // Handle dropdown menus on mobile
    const mobileDropdowns = mobileNav.querySelectorAll('.dropdown');
    mobileNav.querySelectorAll('li').forEach(li => {
        if (li.querySelector('.dropdown')) {
            li.querySelector('a').addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    li.classList.toggle('active');
                }
            });
        }
    });
}

function animateNumber(element, endValue, duration) {
    let startValue = 0;
    let step = Math.ceil(endValue / (duration / 10));
    let timer = setInterval(() => {
        startValue += step;
        if (startValue >= endValue) {
            startValue = endValue;
            clearInterval(timer);
        }
        element.innerHTML = startValue + (endValue === 98 ? '%' : '+');
    }, 10);
}
const revealElements = document.querySelectorAll("[data-reveal]");
const revealOnScroll = () => {
    for (let i = 0; i < revealElements.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = revealElements[i].getBoundingClientRect().top;
        let elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            revealElements[i].classList.add("revealed");
        }
    }
    const statsSection = document.querySelector(".stats");
    if (statsSection) {
        const statsTop = statsSection.getBoundingClientRect().top;
        if (statsTop < window.innerHeight - 100) {
            startCounters();
        }
    }
};
window.addEventListener("scroll", revealOnScroll);
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-panel");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('active');
    });
});
let countersStarted = false;
function startCounters() {
    if (countersStarted) return;
    const nums = document.querySelectorAll(".stat-number");
    nums.forEach(num => {
        animateNumber(num, parseInt(num.dataset.count), 2000);
    });
    countersStarted = true;
}
revealOnScroll();

// ============= XỬ LÝ FORM ĐĂNG KÝ =============
const mainForm = document.getElementById("mainForm");
if (mainForm) {
    mainForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Lấy dữ liệu từ form
        const formData = {
            fullName: mainForm.fullName.value.trim(),
            phone: mainForm.phone.value.trim(),
            course: mainForm.course.value
        };

        // Kiểm tra dữ liệu trước khi gửi
        if (!formData.fullName) {
            alert("❌ Vui lòng nhập họ và tên");
            return;
        }
        if (!formData.phone) {
            alert("❌ Vui lòng nhập số điện thoại");
            return;
        }

        // Disable nút submit trong khi gửi
        const submitBtn = mainForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = "⏳ Đang gửi...";

        try {
            // Gửi dữ liệu tới API backend
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            // Đọc phản hồi từ server
            const result = await response.json();

            // Hiển thị thông báo dựa trên kết quả
            if (response.ok) {
                alert(result.message);
                mainForm.reset();
                // Reset nút về trạng thái ban đầu
                submitBtn.textContent = "GỬI THÔNG TIN ĐĂNG KÝ HỌC TRẢI NGHIỆM MIỄN PHÍ";
            } else {
                alert(result.message || "❌ Có lỗi xảy ra. Vui lòng thử lại.");
                submitBtn.textContent = "GỬI THÔNG TIN ĐĂNG KÝ HỌC TRẢI NGHIỆM MIỄN PHÍ";
            }
        } catch (error) {
            console.error("❌ Lỗi kết nối:", error);
            alert("❌ Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.");
            submitBtn.textContent = "GỬI THÔNG TIN ĐĂNG KÝ HỌC TRẢI NGHIỆM MIỄN PHÍ";
        }
    });
}