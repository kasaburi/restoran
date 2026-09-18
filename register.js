


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const errBox = document.getElementById("formError");
  const okBox  = document.getElementById("formSuccess");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const showPassword = document.getElementById("showPassword");


  phoneInput.addEventListener("input", () => {
    const phonePattern = /^\+995\d{9}$/; 
    if (!phonePattern.test(phoneInput.value.trim())) {
      phoneInput.setCustomValidity("გთხოვ სწორად შეიყვანე ნომერი ფორმატში: +995XXXXXXXXX");
    } else {
      phoneInput.setCustomValidity("");
    }
  });


  emailInput.addEventListener("input", () => {
    if (emailInput.validity.valueMissing) {
      emailInput.setCustomValidity("გთხოვ, შეიყვანე ელ-ფოსტა");
    } else if (emailInput.validity.typeMismatch) {
      emailInput.setCustomValidity("გთხოვ, შეიყვანე სწორი ელ-ფოსტა (მაგ: user@example.com)");
    } else {
      emailInput.setCustomValidity("");
    }
  });

  showPassword.addEventListener("change", () => {
    passwordInput.type = showPassword.checked ? "text" : "password";
  });



form.addEventListener("submit", async (e) => {
    e.preventDefault();

    errBox.style.display = "none";
    okBox.style.display  = "none";
    errBox.textContent = "";
    okBox.textContent  = "";

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const payload = {
        firstName: form.firstName.value.trim(),
        lastName:  form.lastName.value.trim(),
        age:       Number(form.age.value),
        email:     form.email.value.trim(),
        password:  form.password.value,
        address:   form.address.value.trim(),
        phone:     form.phone.value.trim(),
        zipcode:   form.zipcode.value.trim(),
        avatar:    "https://api.dicebear.com/7.x/pixel-art/svg?seed=Jane",
        gender:    form.gender.value,
    };

    try {
        const res = await fetch("https://api.everrest.educata.dev/auth/sign_up", {
            method: "POST",
            headers: { "Content-Type": "application/json", "accept": "*/*" },
            body: JSON.stringify(payload),
        });

        let data = {};
        let text = "";

        try {
            text = await res.text();          // response as text
            data = JSON.parse(text || "{}");  // try parse JSON
        } catch {
        }

        if (!res.ok) {
            let errorMessage = "";

            if (res.status === 409) {
                errorMessage = "❌ ეს ელ-ფოსტა უკვე გამოყენებულია";
            } else if (data.message) {
                errorMessage = `❌ ${data.message}`;
            } else if (data.error) {
                errorMessage = `❌ ${data.error}`;
            } else if (text) {
                errorMessage = `❌ ${text}`;
            } else {
                errorMessage = `❌ ვერ დარეგისტრირდი (HTTP ${res.status})`;
            }

            errBox.innerHTML = errorMessage;
            errBox.style.display = "block";
            return;
        }

        // წარმატება
        okBox.textContent = "✅ წარმატებით დარეგისტრირდი!";
        okBox.style.display = "block";

        if (data.token && data.userId) {
            localStorage.setItem("userToken", data.token);
            localStorage.setItem("userId", data.userId);

            window.parent.postMessage({
                type: "loginSuccess",
                token: data.token,
                userId: data.userId,
                userEmail: form.email.value.trim()
            }, "*");
        }

        form.reset();

    } catch (err) {
        console.error("Network/CORS error:", err);
        errBox.textContent = "❌ ვერ დარეგისტრირდი (ქსელის ან CORS პრობლემა)";
        errBox.style.display = "block";
    }
});



    // Live avatar preview update
    const avatarInput = document.getElementById("avatar");
    const avatarImg = document.getElementById("avatarImg");
    if (avatarInput && avatarImg) {
        avatarInput.addEventListener("input", () => {
            const url = avatarInput.value.trim();
            if (url) {
                avatarImg.src = url;
            }
        });
        avatarImg.addEventListener("error", () => {
            avatarImg.src = "https://api.dicebear.com/7.x/pixel-art/svg?seed=Jane";
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
});

// Theme toggle logic
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

// Cart / Modal helpers to prevent errors if clicked
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





