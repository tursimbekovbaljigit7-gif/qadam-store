const form = document.getElementById("product-form");
const productsList = document.getElementById("products-list");

let products = JSON.parse(localStorage.getItem("nexoraProducts")) || [];

function saveProducts() {
    localStorage.setItem("nexoraProducts", JSON.stringify(products));
}

function renderProducts() {
    productsList.innerHTML = "";

    if (products.length === 0) {
        productsList.innerHTML = "<p>Hozircha mahsulot yo‘q.</p>";
        return;
    }

    products.forEach(function(product) {

        const item = document.createElement("div");

        item.className = "product-item";

        item.innerHTML = `
            <div class="product-info">

                <img
                    src="${product.image || 'https://via.placeholder.com/100'}"
                    alt="${product.name}"
                    class="admin-product-image"
                >

                <div>
                    <h3>${product.name}</h3>

                    <p>
                        ${Number(product.price).toLocaleString()}
                        so‘m
                    </p>

                    <small>${product.category}</small>
                </div>

            </div>

            <button onclick="openEditProduct(${product.id})">
                ✏️ Tahrirlash
            </button>

            <button onclick="deleteProduct(${product.id})">
                🗑 O‘chirish
            </button>
        `;

        productsList.appendChild(item);
    });
}

function deleteProduct(id) {
    products = products.filter(product => product.id !== id);
    saveProducts();
    renderProducts();
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("product-name").value;
    const price = document.getElementById("product-price").value;
    const category = document.getElementById("product-category").value;
    const image = document.getElementById("product-image").value;

    products.push({
        id: Date.now(),
        name: name,
        price: price,
        category: category,
        image: image
    });

    saveProducts();
    renderProducts();
    form.reset();

    alert("✅ Mahsulot muvaffaqiyatli qo‘shildi!");
});

renderProducts();
function showOrders() {
    const ordersList = document.getElementById("orders-list");

    if (!ordersList) return;

    const orders =
        JSON.parse(localStorage.getItem("nexoraOrders")) || [];

    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="order-card">
                <h3>📭 Buyurtmalar yo‘q</h3>
                <p>Hozircha hech qanday buyurtma kelmagan.</p>
            </div>
        `;
        return;
    }

    ordersList.innerHTML = "";

    orders.slice().reverse().forEach(function(order) {

        let productsHTML = "";

        order.items.forEach(function(product) {
            productsHTML += `
                <div class="order-product">
                    <b>${product.name}</b>
                    <span>
                        ${Number(product.price).toLocaleString("uz-UZ")} so‘m
                    </span>
                </div>
            `;
        });

        ordersList.innerHTML += `
            <div class="order-card">

                <h3>📦 Buyurtma #${order.id}</h3>

                <div class="order-info">
                    <div>👤 <b>Ism:</b> ${order.name}</div>
                    <div>📞 <b>Telefon:</b> ${order.phone}</div>
                    <div>📍 <b>Manzil:</b> ${order.address}</div>
                    <div>💳 <b>To‘lov:</b> ${order.payment}</div>
                    <div>📅 <b>Sana:</b> ${order.date}</div>
                    <div>
                        📌 <b>Holat:</b>
                        <select
    class="order-status-select"
    onchange="changeOrderStatus(${order.id}, this.value)"
>
    <option value="Yangi" ${order.status === "Yangi" ? "selected" : ""}>
        🆕 Yangi
    </option>

    <option value="Qabul qilindi" ${order.status === "Qabul qilindi" ? "selected" : ""}>
        ✅ Qabul qilindi
    </option>

    <option value="Yetkazilmoqda" ${order.status === "Yetkazilmoqda" ? "selected" : ""}>
        🚚 Yetkazilmoqda
    </option>

    <option value="Yetkazildi" ${order.status === "Yetkazildi" ? "selected" : ""}>
        🎉 Yetkazildi
    </option>
</select>
                    </div>
                </div>

                <div class="order-products">
                    <h4>🛒 Mahsulotlar</h4>

                    ${productsHTML}

                </div>

                <div class="order-total">
                    💰 Jami:
                    ${Number(order.total).toLocaleString("uz-UZ")}
                    so‘m
                </div>

                <button
                    class="delete-order"
                    onclick="deleteOrder(${order.id})">
                    🗑️ Buyurtmani o‘chirish
                </button>

            </div>
        `;
    });
}


function deleteOrder(id) {

    let orders =
        JSON.parse(localStorage.getItem("nexoraOrders")) || [];

    orders = orders.filter(function(order) {
        return order.id !== id;
    });

    localStorage.setItem(
        "nexoraOrders",
        JSON.stringify(orders)
    );

    showOrders();
}


showOrders();
function changeOrderStatus(id, newStatus) {

    let orders =
        JSON.parse(localStorage.getItem("nexoraOrders")) || [];

    const order = orders.find(function(order) {
        return order.id === id;
    });

    if (!order) return;

    order.status = newStatus;

    localStorage.setItem(
        "nexoraOrders",
        JSON.stringify(orders)
    );

    showOrders();
    updateStatistics();
}
function updateStatistics() {
    const orders =
        JSON.parse(localStorage.getItem("nexoraOrders")) || [];

    const totalOrders = orders.length;

    let totalSales = 0;
    let newOrders = 0;

    orders.forEach(function(order) {

        totalSales += Number(order.total || 0);

        if (order.status === "Yangi") {
            newOrders++;
        }

    });

    const totalOrdersElement =
        document.getElementById("total-orders");

    const totalSalesElement =
        document.getElementById("total-sales");

    const newOrdersElement =
        document.getElementById("new-orders");

    if (totalOrdersElement) {
        totalOrdersElement.textContent = totalOrders;
    }

    if (totalSalesElement) {
        totalSalesElement.textContent =
            totalSales.toLocaleString("uz-UZ") + " so‘m";
    }

    if (newOrdersElement) {
        newOrdersElement.textContent = newOrders;
    }
}
const loginButton = document.getElementById("admin-login-btn");
const logoutButton = document.getElementById("logout-btn");

if (localStorage.getItem("nexoraAdminLogin") === "true") {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
} else {
    document.getElementById("login-screen").style.display = "flex";
    document.getElementById("admin-panel").style.display = "none";
}

if (loginButton) {
    loginButton.onclick = function () {

        const username =
            document.getElementById("admin-username").value.trim();

        const password =
            document.getElementById("admin-password").value;

        const error =
            document.getElementById("login-error");

        if (username === "admin" && password === "14102008") {

            localStorage.setItem("nexoraAdminLogin", "true");

            document.getElementById("login-screen").style.display = "none";
            document.getElementById("admin-panel").style.display = "block";

            error.textContent = "";

        } else {

            error.textContent =
                "❌ Login yoki parol noto‘g‘ri!";
        }
    };
}
if (logoutButton) {
    logoutButton.onclick = function () {

        localStorage.removeItem("nexoraAdminLogin");

        document.getElementById("admin-panel").style.display = "none";
        document.getElementById("login-screen").style.display = "flex";

    };
}
function editProduct(id) {

    const product = products.find(function(product) {
        return product.id === id;
    });

    if (!product) return;

    const newName = prompt(
        "Mahsulot nomi:",
        product.name
    );

    if (newName === null) return;

    const newPrice = prompt(
        "Mahsulot narxi:",
        product.price
    );

    if (newPrice === null) return;

    const newCategory = prompt(
        "Kategoriya:",
        product.category
    );

    if (newCategory === null) return;

    product.name = newName;
    product.price = newPrice;
    product.category = newCategory;

    saveProducts();
    renderProducts();

    alert("✅ Mahsulot muvaffaqiyatli tahrirlandi!");
}function openEditProduct(id) {

    const product = products.find(function(product) {
        return product.id === id;
    });

    if (!product) return;

    document.getElementById("edit-id").value = product.id;
    document.getElementById("edit-name").value = product.name;
    document.getElementById("edit-price").value = product.price;
    document.getElementById("edit-category").value = product.category;
    document.getElementById("edit-image").value = product.image || "";

    document.getElementById("edit-modal").style.display = "flex";
}

document.getElementById("close-edit").onclick = function() {
    document.getElementById("edit-modal").style.display = "none";
};

document.getElementById("close-edit-2").onclick = function() {
    document.getElementById("edit-modal").style.display = "none";
};

document.getElementById("edit-form").addEventListener("submit", function(event) {

    event.preventDefault();

    const id = Number(
        document.getElementById("edit-id").value
    );

    const product = products.find(function(product) {
        return product.id === id;
    });

    if (!product) return;

    product.name =
        document.getElementById("edit-name").value;

    product.price =
        document.getElementById("edit-price").value;

    product.category =
        document.getElementById("edit-category").value;

    product.image =
        document.getElementById("edit-image").value;

    saveProducts();
    renderProducts();

    document.getElementById("edit-modal").style.display = "none";

    alert("✅ Mahsulot yangilandi!");
});
const productSearch = document.getElementById("product-search");

if (productSearch) {

    productSearch.addEventListener("input", function() {

        const searchText = this.value.toLowerCase().trim();

        const filteredProducts = products.filter(function(product) {

            return product.name
                .toLowerCase()
                .includes(searchText);

        });

        productsList.innerHTML = "";

        if (filteredProducts.length === 0) {

            productsList.innerHTML =
                "<p>🔍 Mahsulot topilmadi.</p>";

            return;
        }

        filteredProducts.forEach(function(product) {

            const item = document.createElement("div");

            item.className = "product-item";

            item.innerHTML = `
                <div class="product-info">

                    <img
                        src="${product.image || 'https://via.placeholder.com/100'}"
                        alt="${product.name}"
                        class="admin-product-image"
                    >

                    <div>
                        <h3>${product.name}</h3>

                        <p>
                            ${Number(product.price).toLocaleString()}
                            so‘m
                        </p>

                        <small>${product.category}</small>
                    </div>

                </div>

                <button onclick="openEditProduct(${product.id})">
                    ✏️ Tahrirlash
                </button>

                <button onclick="deleteProduct(${product.id})">
                    🗑 O‘chirish
                </button>
            `;

            productsList.appendChild(item);

        });

    });

}
const productFilter = document.getElementById("product-filter");

if (productFilter) {

    productFilter.addEventListener("change", function() {

        const selectedCategory = this.value;

        const searchText =
            document.getElementById("product-search").value
            .toLowerCase()
            .trim();

        const filteredProducts = products.filter(function(product) {

            const categoryMatch =
                selectedCategory === "all" ||
                product.category === selectedCategory;

            const searchMatch =
                product.name.toLowerCase().includes(searchText);

            return categoryMatch && searchMatch;

        });

        productsList.innerHTML = "";

        if (filteredProducts.length === 0) {

            productsList.innerHTML =
                "<p>🔍 Mahsulot topilmadi.</p>";

            return;
        }

        filteredProducts.forEach(function(product) {

            const item = document.createElement("div");

            item.className = "product-item";

            item.innerHTML = `
                <div class="product-info">

                    <img
                        src="${product.image || 'https://via.placeholder.com/100'}"
                        alt="${product.name}"
                        class="admin-product-image"
                    >

                    <div>
                        <h3>${product.name}</h3>
                        <p>
                            ${Number(product.price).toLocaleString()}
                            so‘m
                        </p>
                        <small>${product.category}</small>
                    </div>

                </div>

                <button onclick="openEditProduct(${product.id})">
                    ✏️ Tahrirlash
                </button>

                <button onclick="deleteProduct(${product.id})">
                    🗑 O‘chirish
                </button>
            `;

            productsList.appendChild(item);
        });
    });
}
const orderSearch = document.getElementById("order-search");

if (orderSearch) {

    orderSearch.addEventListener("input", function() {

        const searchText = this.value.toLowerCase().trim();

        const orders =
            JSON.parse(localStorage.getItem("nexoraOrders")) || [];

        const filteredOrders = orders.filter(function(order) {

            return String(order.id)
                .toLowerCase()
                .includes(searchText)
                ||
                String(order.name)
                .toLowerCase()
                .includes(searchText)
                ||
                String(order.phone)
                .toLowerCase()
                .includes(searchText);

        });

        const ordersList =
            document.getElementById("orders-list");

        if (!ordersList) return;

        if (filteredOrders.length === 0) {

            ordersList.innerHTML =
                "<p>🔍 Buyurtma topilmadi.</p>";

            return;
        }

        ordersList.innerHTML = "";

        filteredOrders.slice().reverse().forEach(function(order) {

            let productsHTML = "";

            order.items.forEach(function(product) {

                productsHTML += `
                    <div class="order-product">
                        <b>${product.name}</b>
                        <span>
                            ${Number(product.price).toLocaleString("uz-UZ")}
                            so‘m
                        </span>
                    </div>
                `;

            });

            ordersList.innerHTML += `
                <div class="order-card">

                    <h3>📦 Buyurtma #${order.id}</h3>

                    <div class="order-info">
                        <div>👤 <b>Ism:</b> ${order.name}</div>
                        <div>📞 <b>Telefon:</b> ${order.phone}</div>
                        <div>📍 <b>Manzil:</b> ${order.address}</div>
                        <div>💳 <b>To‘lov:</b> ${order.payment}</div>
                        <div>📅 <b>Sana:</b> ${order.date}</div>
                    </div>

                    <div class="order-products">
                        <h4>🛒 Mahsulotlar</h4>
                        ${productsHTML}
                    </div>

                    <div class="order-total">
                        💰 Jami:
                        ${Number(order.total).toLocaleString("uz-UZ")}
                        so‘m
                    </div>

                    <button
                        class="delete-order"
                        onclick="deleteOrder(${order.id})">
                        🗑️ Buyurtmani o‘chirish
                    </button>

                </div>
            `;
        });

    });

}
const orderFilter = document.getElementById("order-filter");

if (orderFilter) {

    orderFilter.addEventListener("change", function() {

        const selectedStatus = this.value;

        const searchInput =
            document.getElementById("order-search");

        const searchText =
            searchInput
                ? searchInput.value.toLowerCase().trim()
                : "";

        const orders =
            JSON.parse(localStorage.getItem("nexoraOrders")) || [];

        const filteredOrders = orders.filter(function(order) {

            const statusMatch =
                selectedStatus === "all" ||
                order.status === selectedStatus;

            const searchMatch =
                String(order.id)
                    .toLowerCase()
                    .includes(searchText)
                ||
                String(order.name)
                    .toLowerCase()
                    .includes(searchText)
                ||
                String(order.phone)
                    .toLowerCase()
                    .includes(searchText);

            return statusMatch && searchMatch;
        });

        const ordersList =
            document.getElementById("orders-list");

        if (!ordersList) return;

        if (filteredOrders.length === 0) {

            ordersList.innerHTML =
                "<p>🔍 Buyurtma topilmadi.</p>";

            return;
        }

        ordersList.innerHTML = "";

        filteredOrders.slice().reverse().forEach(function(order) {

            let productsHTML = "";

            order.items.forEach(function(product) {

                productsHTML += `
                    <div class="order-product">
                        <b>${product.name}</b>
                        <span>
                            ${Number(product.price).toLocaleString("uz-UZ")}
                            so‘m
                        </span>
                    </div>
                `;

            });

            ordersList.innerHTML += `
                <div class="order-card">

                    <h3>📦 Buyurtma #${order.id}</h3>

                    <div class="order-info">
                        <div>👤 <b>Ism:</b> ${order.name}</div>
                        <div>📞 <b>Telefon:</b> ${order.phone}</div>
                        <div>📍 <b>Manzil:</b> ${order.address}</div>
                        <div>💳 <b>To‘lov:</b> ${order.payment}</div>
                        <div>📅 <b>Sana:</b> ${order.date}</div>

                        <div>
                            📌 <b>Holat:</b>
                            ${order.status}
                        </div>
                    </div>

                    <div class="order-products">
                        <h4>🛒 Mahsulotlar</h4>
                        ${productsHTML}
                    </div>

                    <div class="order-total">
                        💰 Jami:
                        ${Number(order.total).toLocaleString("uz-UZ")}
                        so‘m
                    </div>

                    <button
                        class="delete-order"
                        onclick="deleteOrder(${order.id})">
                        🗑️ Buyurtmani o‘chirish
                    </button>

                </div>
            `;
        });

    });

}
const exportOrdersBtn =
    document.getElementById("export-orders-btn");

if (exportOrdersBtn) {

    exportOrdersBtn.addEventListener("click", function() {

        const orders =
            JSON.parse(localStorage.getItem("nexoraOrders")) || [];

        if (orders.length === 0) {
            alert("📭 Hozircha buyurtmalar yo‘q!");
            return;
        }

        let csv = "ID,Ism,Telefon,Manzil,To‘lov,Holat,Jami,Sana\n";

        orders.forEach(function(order) {

            csv += `"${order.id}",`;
            csv += `"${order.name}",`;
            csv += `"${order.phone}",`;
            csv += `"${order.address}",`;
            csv += `"${order.payment}",`;
            csv += `"${order.status}",`;
            csv += `"${order.total}",`;
            csv += `"${order.date}"\n`;

        });

        const blob = new Blob(
            ["\uFEFF" + csv],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "nexora-buyurtmalar.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        alert("✅ Buyurtmalar yuklab olindi!");
    });
}