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
const mainForm = document.getElementById("mainForm");
if (mainForm) {
    mainForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = {
            fullName: mainForm.fullName.value,
            phone: mainForm.phone.value,
            course: mainForm.course.value
        };
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                mainForm.reset();
            } else {
                alert(result.message || "Có lỗi xảy ra.");
            }
        } catch (error) {
            console.error(error);
            alert("Không thể kết nối tới server.");
        }
    });
}