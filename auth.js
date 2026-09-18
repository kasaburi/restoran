document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const errBox = document.getElementById("loginError");
    const okBox  = document.getElementById("loginSuccess");

    // Show / Hide Password toggle
    const showPassword = document.getElementById("showPassword");
    const passwordInput = document.getElementById("password");
    if (showPassword && passwordInput) {
        showPassword.addEventListener("change", () => {
            passwordInput.type = showPassword.checked ? "text" : "password";
        });
    }

    // Burger menu toggle
    const burger = document.getElementById("burger");
    const mainNav = document.getElementById("mainNav");
    const closeBurger = document.getElementById("closeBurger");
    if (burger && mainNav) {
        burger.addEventListener("click", () => mainNav.classList.add("active"));
    }
    if (closeBurger && mainNav) {
        closeBurger.addEventListener("click", () => mainNav.classList.remove("active"));
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        errBox.style.display = "none";
        okBox.style.display = "none";
        errBox.textContent = "";
        okBox.textContent = "";

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            errBox.textContent = "❌ გთხოვ, შეიყვანე ელ-ფოსტა და პაროლი";
            errBox.style.display = "block";
            return;
        }

        try {
            const res = await fetch("https://api.everrest.educata.dev/auth/sign_in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                errBox.textContent = "❌ " + (data.message || "ავტორიზაცია ვერ მოხერხდა.");
                errBox.style.display = "block";
                return;
            }

            okBox.textContent = "✅ წარმატებით გაიარე ავტორიზაცია!";
            okBox.style.display = "block";

            if (data.token && data.userId) {
                localStorage.setItem("userToken", data.token);
                localStorage.setItem("userId", data.userId);
                
                window.parent.postMessage({
                    type: "loginSuccess",
                    token: data.token,
                    userId: data.userId,
                    userEmail: email
                }, "*"); 
            }

        } catch (error) {
            errBox.textContent = "❌ ქსელის შეცდომა, სცადე თავიდან.";
            errBox.style.display = "block";
        }
    });
});

// Theme switcher function
function applyTheme(theme) {
    const isDark = theme === "dark";
    if (isDark) {
        document.body.classList.add("dark");
        document.body.classList.remove("light");
    } else {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
    }

    const btn = document.getElementById("themeToggle");
    if (btn) {
        btn.innerHTML = isDark ? "🌙" : "☀️";
        btn.setAttribute("title", isDark ? "Switch to Day Mode" : "Switch to Night Mode");
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    const btn = document.getElementById("themeToggle");
    if (btn) {
        btn.onclick = () => {
            const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
            localStorage.setItem("theme", nextTheme);
            applyTheme(nextTheme);
        };
    }
}

document.addEventListener("DOMContentLoaded", initTheme);
initTheme();

// Cart / Modal helpers
function openCart() {
    const m = document.getElementById("cartModal");
    if (m) m.style.display = "flex";
}
function closeCart() {
    const m = document.getElementById("cartModal");
    if (m) m.style.display = "none";
}
function openCheckout() {
    const cm = document.getElementById("checkoutModal");
    if (cm) cm.style.display = "flex";
}
function closeCheckout() {
    const cm = document.getElementById("checkoutModal");
    if (cm) cm.style.display = "none";
}
function clearCart() {}
function confirmPayment() {}