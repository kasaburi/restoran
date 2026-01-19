const burger = document.getElementById("burger");
const mainNav = document.getElementById("mainNav");
const closeBurger = document.getElementById("closeBurger");

burger.addEventListener("click", () => {
    mainNav.classList.add("active");
});

closeBurger.addEventListener("click", () => {
    mainNav.classList.remove("active");
});





let section = document.getElementById("section");
let food = document.getElementById("food");
let filter = document.getElementById("filter");
let currentCategory = null;
let productsData = [];

document.getElementById("removeFilters").addEventListener("click", () => {
    document.getElementById("filterName").value = "";
    document.getElementById("filterVegeterian").checked = false;
    document.getElementById("filterNuts").checked = false;
    document.getElementById("filterSpiciness").value = 0;
    document.getElementById("filterMinPrice").value = 0;
    document.getElementById("filterMaxPrice").value = 100;


    renderProducts(productsData);
});



function getAllCategories() {
    fetch("https://restaurant.stepprojects.ge/api/Categories/GetAll")
        .then(res => res.json())
        .then(data => {
            section.innerHTML = `<div class="category1" onclick="getProducts(null)">All</div>`;
            data.forEach(cat => {
                section.innerHTML += `
                    <div class="category1" onclick="getProducts(${cat.id})">
                        ${cat.name}
                    </div>`;
            });
        });
}



function getProducts(categoryId = currentCategory) {
    currentCategory = categoryId; 

    let url = "https://restaurant.stepprojects.ge/api/Products/GetFiltered";
    const params = new URLSearchParams();

    if (categoryId) {
        params.append("categoryId", categoryId);
    }
const spiciness = document.getElementById("filterSpiciness")?.value;

if (spiciness && spiciness !== "0") {
    params.append("spiciness", spiciness);
    console.log("Selected spiciness:", spiciness);
console.log("API result:", data.map(i => i.spiciness));
}



const nameEl = document.getElementById("filterName");
const name = nameEl?.value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

if (name && name.length >= 2) {
    params.append("name", name);
}

    const minPrice = document.getElementById("filterMinPrice")?.value;
    const maxPrice = document.getElementById("filterMaxPrice")?.value;

    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    if (params.toString()) {
        url += "?" + params.toString();
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            productsData = data;             
            renderProducts(applyFilters(data)); 
        });
}




function applyFilters(data) {
    const searchName = document.getElementById("filterName").value.toLowerCase();
    const veg = document.getElementById("filterVegeterian").checked;
    const nuts = document.getElementById("filterNuts").checked;

    const minSpice = Number(document.getElementById("filterSpiciness").value);
    const minPrice = Number(document.getElementById("filterMinPrice").value) || 0;
    const maxPrice = Number(document.getElementById("filterMaxPrice").value) || Infinity;

    return data.filter(item => {
        if (veg && !item.vegeterian) return false;
        if (nuts && !item.nuts) return false;
        if (item.spiciness < minSpice) return false;
        if (item.price < minPrice || item.price > maxPrice) return false;
        if (searchName && !item.name.toLowerCase().includes(searchName)) return false;
        return true;
    });
}


function renderProducts(data) {
    food.innerHTML = "";
    if (!data.length) {
        food.innerHTML = "<p>No products match your filters.</p>";
        return;
    }

    data.forEach(item => {
        const canBuy = true; 

        food.innerHTML += `
        <div class="card">
            <div class="nameall">
                <p class="name">${item.name}</p>
                <p class="price">Price: ${item.price}$</p>
            </div>
            <div class="imgall">
                <img src="${item.image}" class="img">
                <p>${"🌶️".repeat(item.spiciness)}</p>
            </div>
            <div class="itemall">
                <div class="item">
                    <p>Nuts: ${item.nuts ? "✔️" : "❌"}</p>
                    <p>Vegetarian: ${item.vegeterian ? "✔️" : "❌"}</p>
                </div>
                <button 
                    onclick="addToCart(${item.id})" class="button1">
                    ${canBuy ? "Add to Cart" : "Out of Stock"}
                </button>
            </div>
        </div>`;
    });
}


document.getElementById("filterName").addEventListener("input", () => renderProducts(applyFilters(productsData)));
document.getElementById("filterVegeterian").addEventListener("change", () => renderProducts(applyFilters(productsData)));
document.getElementById("filterNuts").addEventListener("change", () => renderProducts(applyFilters(productsData)));
document.getElementById("filterSpiciness").addEventListener("input", () => renderProducts(applyFilters(productsData)));
document.getElementById("filterMinPrice").addEventListener("input", () => renderProducts(applyFilters(productsData)));
document.getElementById("filterMaxPrice").addEventListener("input", () => renderProducts(applyFilters(productsData)));

document.addEventListener("DOMContentLoaded", () => {
    getAllCategories();
    getProducts(null);
});



async function addToCart(productId) {
    try {
        const res = await fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll");
        const items = await res.json();
        const existingItem = items.find(i => i.product.id === productId);

        if (existingItem) {
            await fetch("https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    quantity: existingItem.quantity + 1
                })
            });
        } else {
            await fetch("https://restaurant.stepprojects.ge/api/Baskets/AddToBasket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    quantity: 1
                })
            });
        }
        loadCart();
        updateCartCount();

    } catch (err) {
        console.error("Add to cart error:", err);
    }
}







function loadCart() {
    fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll")
        .then(res => res.json())
        .then(data => {
            const cartItems = document.getElementById("cartItems");
            const cartTotal = document.getElementById("cartTotal");
            const cartCount = document.getElementById("cartCount"); 
            if (!cartItems) {
                console.error("❌ cartItems element not found!");
                return;
            }
            if (!cartTotal) {
                console.error("❌ cartTotal element not found!");
                return;
            }
            if (!cartCount) {
                console.error("❌ cartCount element not found!");            }

            cartItems.innerHTML = "";

            if (!Array.isArray(data) || !data.length) {
                cartItems.innerHTML = "<p>კალათა ცარიელია</p>";
                cartTotal.textContent = "Total: 0$";
                if (cartCount) cartCount.textContent = "0";
                return;
            }

            let total = 0;
            let count = 0;

            data.forEach(item => {
                total += item.product.price * item.quantity;
                count += item.quantity;

                cartItems.innerHTML += `
                <div class="cart-item">
                    <div class="oll">
                        <div>
                            <p>${item.product.name}</p>
                            <img src="${item.product.image}" class="image">
                        </div>
                        <div class="priceall">
                            <p>Price: ${item.product.price * item.quantity}$</p>
                            <p class="many">
                                <button onclick="changeQuantity(${item.product.id}, -1)">➖</button>
                                <span>${item.quantity}</span>
                                <button onclick="changeQuantity(${item.product.id}, 1)">➕</button>
                            </p>
                        </div>
                    </div>
                    <button onclick="removeItem(${item.product.id})" class="remove1">❌ Remove</button>
                </div>`;
            });

            cartTotal.textContent = `Total: ${total}$`;
            if (cartCount) cartCount.textContent = count;

            console.log("✅ Cart loaded:", count, "items, Total:", total);
        })
        .catch(err => console.error("❌ loadCart fetch error:", err));
    
}

async function changeQuantity(productId, change) {
    try {
        const res = await fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll");
        const items = await res.json();

        const item = items.find(i => i.product.id === productId);
        if (!item) return;

        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
            await fetch(
                `https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${productId}`,
                { method: "DELETE" }
            );
        } else {
            await fetch("https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    quantity: newQuantity
                })
            });
        }

        loadCart();
        updateCartCount();

    } catch (err) {
        console.error("Quantity error:", err);
    }
}
async function removeItem(productId) {
    try {
        await fetch(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${productId}`, {
            method: "DELETE"
        });
        loadCart();
        updateCartCount();
    } catch (err) {
        console.error("Remove item error:", err);
    }
}

async function clearCart() {
    try {
        const res = await fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll");
        const items = await res.json();

        for (const item of items) {
            await fetch(
                `https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${item.product.id}`,
                { method: "DELETE" }
            );
        }

        loadCart();
        updateCartCount();
    } catch (err) {
        console.error("Clear cart error:", err);
    }
}


function updateCartCount() {
    fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll")
        .then(res => res.json())
        .then(data => {

            if (!Array.isArray(data)) return;

            let count = 0;
            data.forEach(item => {
                count += Number(item.quantity) || 0;
            });

            const cartCountEl = document.querySelector(".cartCount");
            if (cartCountEl) {
                cartCountEl.textContent = count;
            }
        })
        .catch(err => {
            console.error("updateCartCount error:", err);
        });
}





function updateContainerHeight() {
    const container = document.querySelector(".category-container");
    if (!container) return; 

    const items = container.querySelectorAll(".category-item");
    let totalHeight = 0;

    items.forEach(item => {
        const style = window.getComputedStyle(item);
        totalHeight += item.offsetHeight + parseFloat(style.marginBottom || 0);
    });

    container.style.height = totalHeight + "px";
}



function filterItems(keyword) {
    const items = document.querySelectorAll(".category-item");

    items.forEach(item => {
        if (item.textContent.toLowerCase().includes(keyword.toLowerCase())) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });

    updateContainerHeight();
}

updateContainerHeight();





function openCart() {
    const modal = document.getElementById("cartModal");
    if (!modal) {
        console.error("cartModal not found!");
        return;
    }
    modal.style.display = "flex"; 
    loadCart();
}


document.addEventListener("DOMContentLoaded", () => {
    getAllCategories();
    getProducts();
    updateCartCount();
});
document.addEventListener("DOMContentLoaded", () => {
    const cartBtn = document.querySelector(".cart");
    if (cartBtn) {
        cartBtn.addEventListener("click", openCart);
    } else {
        console.error("Cart button not found!");
    }
});




function openCart() {
    const cartModal = document.getElementById("cartModal");
    if (!cartModal) {
        console.error("cartModal not found!");
        return;
    }
    cartModal.style.display = "flex"; 
    loadCart(); 
}

function closeCart() {
    const cartModal = document.getElementById("cartModal");
    if (!cartModal) return;
    cartModal.style.display = "none";
}
function openCheckout() {
    const checkoutModal = document.getElementById("checkoutModal");
    if (!checkoutModal) return;
    const cartTotal = document.getElementById("cartTotal").textContent;
    document.getElementById("checkoutTotal").textContent = cartTotal;
    checkoutModal.style.display = "flex";
}

function closeCheckout() {
    const checkoutModal = document.getElementById("checkoutModal");
    if (!checkoutModal) return;
    checkoutModal.style.display = "none";
    document.querySelectorAll("#checkoutModal input").forEach(input => input.value = "");
    document.getElementById("paymentStatus").textContent = "";
}

async function changeQuantity(productId, change) {
    try {
        const res = await fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll");
        const items = await res.json();
        const item = items.find(i => i.product.id === productId);
        if (!item) return;

        const newQty = item.quantity + change;

        if (newQty <= 0) {
            await fetch(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${productId}`, { method: "DELETE" });
        } else {
            await fetch("https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity: newQty })
            });
        }

        loadCart();

    } catch (err) {
        console.error(err);
    }
}

async function removeItem(productId) {
    try {
        await fetch(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${productId}`, { method: "DELETE" });
        loadCart();
    } catch (err) {
        console.error(err);
    }
}
async function clearCart() {
    try {
        const res = await fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll");
        const items = await res.json();

        for (const item of items) {
            await fetch(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${item.product.id}`, { method: "DELETE" });
        }

        loadCart();
    } catch (err) {
        console.error(err);
    }
}

function confirmPayment() {
    const inputs = document.querySelectorAll("#checkoutModal input");
    for (const input of inputs) {
        if (!input.value.trim()) {
            document.getElementById("paymentStatus").textContent = "❌ Fill all fields";
            document.getElementById("paymentStatus").style.color = "red";
            return;
        }
    }

    document.getElementById("paymentStatus").textContent = "⏳ Processing...";
    document.getElementById("paymentStatus").style.color = "orange";

    setTimeout(async () => {
        const success = Math.random() > 0.3;
        if (success) {
            document.getElementById("paymentStatus").textContent = "✅ Payment successful!";
            document.getElementById("paymentStatus").style.color = "green";
            await clearCart();
            setTimeout(closeCheckout, 1000);
        } else {
            document.getElementById("paymentStatus").textContent = "❌ Payment failed. Try again.";
            document.getElementById("paymentStatus").style.color = "red";
        }
    }, 1500);
}


document.addEventListener("DOMContentLoaded", () => {
    loadCart();
});




const registerBtn = document.getElementById("registerBtn");
const authBtn = document.getElementById("authBtn");
const popupModal = document.getElementById("popupModal");
const popupContent = document.getElementById("popupContent");

const cartModal = document.getElementById("cartModal");
const checkoutModal = document.getElementById("checkoutModal");

const themeToggle = document.getElementById("themeToggle");

if (registerBtn) {
    registerBtn.addEventListener("click", () => {
        openPopup("register.html");
    });
}

if (authBtn) {
    authBtn.addEventListener("click", () => {
        openPopup("auth.html");
    });
}

function openPopup(url) {
    popupContent.innerHTML = `
        <iframe src="${url}"  style="width:100%;height:400px;border:none;"></iframe>
        <button id="closePopupBtn">❌</button>
    `;
    popupModal.style.display = "flex";

    document
        .getElementById("closePopupBtn")
        ?.addEventListener("click", closePopup);
}

function closePopup() {
    popupModal.style.display = "none";
    popupContent.innerHTML = "";
}

function openCart() {
    cartModal.style.display = "flex";
}

function closeCart() {
    cartModal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
});

themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
});






document.querySelectorAll(".cartimg").forEach(img => {
    img.addEventListener("mousemove", (e) => {
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const moveX = (x / rect.width - 0.5) * 12;
        const moveY = (y / rect.height - 0.5) * 12;

        img.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
    });

    img.addEventListener("mouseleave", () => {
        img.style.transform = "translate(0,0) scale(1)";
    });
});









































































































































































































































































































































































