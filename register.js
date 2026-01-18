


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



});




