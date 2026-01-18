

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const errBox = document.getElementById("loginError");
    const okBox  = document.getElementById("loginSuccess");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        errBox.style.display = okBox.style.display = "none";
        errBox.textContent = okBox.textContent = "";

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            return alert("შეიყვანე email და password");
        }

        try {
            const res = await fetch("https://api.everrest.educata.dev/auth/sign_in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                errBox.textContent = data.message || data.error || "შესვლა ვერ მოხერხდა";
                errBox.style.display = "block";
                return;
            }

            okBox.textContent = " წარმატებით შეხვედი!";
            okBox.style.display = "block";

            if (data.token && data.userId) {
                window.parent.postMessage({
                    type: "loginSuccess",
                    token: data.token,
                    userId: data.userId,
                    userEmail: email
                }, "*");
            }

        } catch (err) {
            errBox.textContent = "ქსელის პრობლემა, სცადე თავიდან";
            errBox.style.display = "block";
        }
    });
})














document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const errBox = document.getElementById("loginError");
    const okBox  = document.getElementById("loginSuccess");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        errBox.style.display = okBox.style.display = "none";
        errBox.textContent = okBox.textContent = "";

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) return alert("შეიყვანე email და password");

        try {
            // აქ შეგიძლია შენი API–ს სთხოვო, ან მარტივად საჩვენებლად:
            const fakeToken = "1234567890";
            const userId = "1";

            okBox.textContent = " წარმატებით შეხვედი!";
            okBox.style.display = "block";

            // გაგზავნა parent page–ში
            window.parent.postMessage({
                type: "loginSuccess",
                token: fakeToken,
                userId: userId,
                userEmail: email
            }, "*");

        } catch (err) {
            errBox.textContent = "პრობლემა, სცადე თავიდან";
            errBox.style.display = "block";
        }
    });
});




document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const token = "123456"; // სიმულირებული token
  window.parent.postMessage({
    type: "loginSuccess",
    token: token,
    userEmail: email
  }, "*");
});