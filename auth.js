
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const errBox = document.getElementById("loginError");
    const okBox  = document.getElementById("loginSuccess");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        errBox.style.display = "none";
        okBox.style.display = "none";
        errBox.textContent = "";
        okBox.textContent = "";

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("შეიყვანე email და password");
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
                errBox.textContent = data.message || "Login failed.";
                errBox.style.display = "block";
                return;
            }

            okBox.textContent = "You have successfully logged in.!";
            okBox.style.display = "block";

            if (data.token && data.userId) {
                window.parent.postMessage({
                    type: "loginSuccess",
                    token: data.token,
                    userId: data.userId,
                    userEmail: email
                }, "*"); 
            }

        } catch (error) {
            errBox.textContent = "Network problem, try again.";
            errBox.style.display = "block";
        }
    });
});