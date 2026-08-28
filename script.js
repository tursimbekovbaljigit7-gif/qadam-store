let products = JSON.parse(localStorage.getItem("nexoraProducts")) || [];
let cart = JSON.parse(localStorage.getItem("nexoraCart")) || [];

function formatPrice(price) {
    return Number(price).toLocaleString("uz-UZ") + " so'm";
}

function showProducts() {
    const container = document.getElementById("products-list");

    if (!container) return;

    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = "<p>Hozircha mahsulotlar yo'q.</p>";
        return;
    }

    products.forEach((product, index) => {
        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image || ""}" alt="${product.name}">

            <div class="product-info">
                <span class="product-category">
                    ${product.category || "Mahsulot"}
                </span>

                <h3>${product.name}</h3>

                <p class="product-price">
                    ${formatPrice(product.price)}
                </p>

                <button onclick="addToCart(${index})">
                    🛒 Xarid qilish
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

function addToCart(index) {
    const product = products[index];

    if (!product) return;

    cart.push(product);

    localStorage.setItem("nexoraCart", JSON.stringify(cart));

    updateCart();

    alert("🛒 " + product.name + " savatga qo'shildi!");
}

function updateCart() {
    const count = document.getElementById("cart-count");
    const items = document.getElementById("cart-items");
    const total = document.getElementById("cart-total");

    if (count) {
        count.textContent = cart.length;
    }

    if (items) {
        if (cart.length === 0) {
            items.innerHTML = "Savat hozircha bo'sh.";
        } else {
            items.innerHTML = "";

            cart.forEach((product, index) => {
                const item = document.createElement("div");

                item.innerHTML = `
                    <p>
                        <b>${product.name}</b>
                        <br>
                        ${formatPrice(product.price)}
                        <br>
                        <button onclick="removeFromCart(${index})">
                            ❌ O'chirish
                        </button>
                    </p>
                    <hr>
                `;

                items.appendChild(item);
            });
        }
    }

    if (total) {
        let sum = 0;

        cart.forEach(product => {
            sum += Number(product.price) || 0;
        });

        total.textContent = formatPrice(sum);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);

    localStorage.setItem("nexoraCart", JSON.stringify(cart));

    updateCart();
}


document.addEventListener("DOMContentLoaded", function () {

    showProducts();
    updateCart();

    // SAVAT
    const openCart = document.getElementById("open-cart");
    const closeCart = document.getElementById("close-cart");
    const cartModal = document.getElementById("cart-modal");

    if (openCart && cartModal) {
        openCart.onclick = function () {
            cartModal.style.display = "flex";
            updateCart();
        };
    }

    if (closeCart && cartModal) {
        closeCart.onclick = function () {
            cartModal.style.display = "none";
        };
    }


    // BUYURTMA
    const checkoutBtn = document.getElementById("checkout-btn");
    const checkoutModal = document.getElementById("checkout-modal");
    const closeCheckout = document.getElementById("close-checkout");
    const checkoutForm = document.getElementById("checkout-form");

    if (checkoutBtn && checkoutModal) {
        checkoutBtn.onclick = function () {

            if (cart.length === 0) {
                alert("🛒 Savat bo'sh!");
                return;
            }

            checkoutModal.style.display = "flex";
        };
    }

    if (closeCheckout && checkoutModal) {
        closeCheckout.onclick = function () {
            checkoutModal.style.display = "none";
        };
    }

    if (checkoutForm) {
        checkoutForm.onsubmit = function (event) {

            event.preventDefault();

            const name =
                document.getElementById("customer-name").value.trim();

            const phone =
                document.getElementById("customer-phone").value.trim();

            const address =
                document.getElementById("customer-address").value.trim();

            const payment =
                document.getElementById("payment-method").value;


            if (!name || !phone || !address || !payment) {
                alert("⚠️ Barcha maydonlarni to'ldiring!");
                return;
            }


            const orders =
                JSON.parse(localStorage.getItem("nexoraOrders")) || [];


            const total = cart.reduce(function (sum, item) {
                return sum + Number(item.price || 0);
            }, 0);


            const order = {
                id: Date.now(),
                date: new Date().toLocaleString("uz-UZ"),
                name: name,
                phone: phone,
                address: address,
                payment: payment,
                items: cart,
                total: total,
                status: "Yangi"
            };


            orders.push(order);

            localStorage.setItem(
                "nexoraOrders",
                JSON.stringify(orders)
            );


            alert(
                "✅ Buyurtma qabul qilindi!\n\n" +
                "👤 Ism: " + name + "\n" +
                "📞 Telefon: " + phone + "\n" +
                "📍 Manzil: " + address + "\n" +
                "💳 To'lov: " + payment + "\n" +
                "💰 Jami: " + formatPrice(total)
            );


            cart = [];

            localStorage.setItem(
                "nexoraCart",
                JSON.stringify(cart)
            );

            updateCart();

            checkoutForm.reset();

            checkoutModal.style.display = "none";

            if (cartModal) {
                cartModal.style.display = "none";
            }
        };
    }

});