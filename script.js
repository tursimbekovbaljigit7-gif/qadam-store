// ===============================
// QADAM ONLINE STORE
// ===============================

let products = JSON.parse(localStorage.getItem("nexoraProducts")) || [];
let cart = JSON.parse(localStorage.getItem("nexoraCart")) || [];

// ===============================
// NARX FORMAT
// ===============================

function formatPrice(price) {
    return Number(price || 0).toLocaleString("uz-UZ") + " so'm";
}

// ===============================
// MAHSULOTLARNI CHIQARISH
// ===============================

function showProducts(list = products) {

    const container = document.getElementById("products-list");

    if (!container) return;

    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <h3>😔 Mahsulot topilmadi</h3>
                <p>Boshqa mahsulot nomini qidirib ko‘ring.</p>
            </div>
        `;
        return;
    }

    list.forEach(function(product) {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img 
                src="${product.image || ""}" 
                alt="${product.name || "Mahsulot"}"
            >

            <div class="product-info">

                <span class="product-category">
                    ${product.category || "Mahsulot"}
                </span>

                <h3>
                    ${product.name || "Nomsiz mahsulot"}
                </h3>

                <p class="product-price">
                    ${formatPrice(product.price)}
                </p>

                <button type="button">
                    🛒 Xarid qilish
                </button>

            </div>
        `;

        const button = card.querySelector("button");

        button.addEventListener("click", function() {
            addToCart(product);
        });

        container.appendChild(card);
    });
}

// ===============================
// SAVATGA QO‘SHISH
// ===============================

function addToCart(product) {

    if (!product) return;

    cart.push(product);

    localStorage.setItem(
        "nexoraCart",
        JSON.stringify(cart)
    );

    updateCart();

    alert(
        "🛒 " +
        (product.name || "Mahsulot") +
        " savatga qo‘shildi!"
    );
}

// ===============================
// SAVATNI YANGILASH
// ===============================

function updateCart() {

    const count = document.getElementById("cart-count");
    const items = document.getElementById("cart-items");
    const total = document.getElementById("cart-total");

    // SAVAT SONI
    if (count) {
        count.textContent = cart.length;
    }

    // SAVAT MAHSULOTLARI
    if (items) {

        if (cart.length === 0) {

            items.innerHTML = `
                <p>Savat hozircha bo‘sh.</p>
            `;

        } else {

            items.innerHTML = "";

            cart.forEach(function(product, index) {

                const item = document.createElement("div");

                item.innerHTML = `
                    <div class="cart-item">

                        <strong>
                            ${product.name || "Mahsulot"}
                        </strong>

                        <p>
                            ${formatPrice(product.price)}
                        </p>

                        <button type="button">
                            ❌ O‘chirish
                        </button>

                    </div>

                    <hr>
                `;

                const removeButton = item.querySelector("button");

                removeButton.addEventListener("click", function() {
                    removeFromCart(index);
                });

                items.appendChild(item);
            });
        }
    }

    // JAMI
    if (total) {

        let sum = 0;

        cart.forEach(function(product) {
            sum += Number(product.price || 0);
        });

        total.textContent = formatPrice(sum);
    }
}

// ===============================
// SAVATDAN O‘CHIRISH
// ===============================

function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "nexoraCart",
        JSON.stringify(cart)
    );

    updateCart();
}

// ===============================
// QIDIRUV
// ===============================

function setupSearch() {

    const searchInput = document.getElementById("search-input");

    if (!searchInput) return;

    searchInput.addEventListener("input", function() {

        const text = this.value
            .toLowerCase()
            .trim();

        const filteredProducts = products.filter(function(product) {

            const name = String(
                product.name || ""
            ).toLowerCase();

            const category = String(
                product.category || ""
            ).toLowerCase();

            return (
                name.includes(text) ||
                category.includes(text)
            );
        });

        showProducts(filteredProducts);
    });
}

// ===============================
// SAHIFA YUKLANGANDA
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // Mahsulotlar
        showProducts();

        // Savat
        updateCart();

        // Qidiruv
        setupSearch();


        // =========================
        // SAVAT OCHISH
        // =========================

        const openCart =
            document.getElementById("open-cart");

        const closeCart =
            document.getElementById("close-cart");

        const cartModal =
            document.getElementById("cart-modal");


        if (openCart && cartModal) {

            openCart.addEventListener(
                "click",
                function() {

                    cartModal.style.display = "flex";

                    updateCart();
                }
            );
        }


        if (closeCart && cartModal) {

            closeCart.addEventListener(
                "click",
                function() {

                    cartModal.style.display = "none";
                }
            );
        }


        // =========================
        // BUYURTMA
        // =========================

        const checkoutBtn =
            document.getElementById("checkout-btn");

        const checkoutModal =
            document.getElementById("checkout-modal");

        const closeCheckout =
            document.getElementById("close-checkout");

        const checkoutForm =
            document.getElementById("checkout-form");


        if (checkoutBtn && checkoutModal) {

            checkoutBtn.addEventListener(
                "click",
                function() {

                    if (cart.length === 0) {

                        alert("🛒 Savat bo‘sh!");

                        return;
                    }

                    checkoutModal.style.display = "flex";
                }
            );
        }


        if (closeCheckout && checkoutModal) {

            closeCheckout.addEventListener(
                "click",
                function() {

                    checkoutModal.style.display = "none";
                }
            );
        }


        // =========================
        // BUYURTMA TASDIQLASH
        // =========================

        if (checkoutForm) {

            checkoutForm.addEventListener(
                "submit",
                function(event) {

                    event.preventDefault();


                    const name =
                        document
                        .getElementById("customer-name")
                        .value
                        .trim();


                    const phone =
                        document
                        .getElementById("customer-phone")
                        .value
                        .trim();


                    const address =
                        document
                        .getElementById("customer-address")
                        .value
                        .trim();


                    const payment =
                        document
                        .getElementById("payment-method")
                        .value;


                    if (
                        !name ||
                        !phone ||
                        !address ||
                        !payment
                    ) {

                        alert(
                            "⚠️ Barcha maydonlarni to‘ldiring!"
                        );

                        return;
                    }


                    // Eski buyurtmalar
                    const orders =
                        JSON.parse(
                            localStorage.getItem(
                                "nexoraOrders"
                            )
                        ) || [];


                    // JAMI
                    const total =
                        cart.reduce(
                            function(sum, product) {

                                return (
                                    sum +
                                    Number(
                                        product.price || 0
                                    )
                                );

                            },
                            0
                        );


                    // BUYURTMA
                    const order = {

                        id: Date.now(),

                        date:
                            new Date()
                            .toLocaleString("uz-UZ"),

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

                        "👤 Ism: " +
                        name +

                        "\n📞 Telefon: " +
                        phone +

                        "\n📍 Manzil: " +
                        address +

                        "\n💳 To‘lov: " +
                        payment +

                        "\n💰 Jami: " +
                        formatPrice(total)
                    );


                    // SAVATNI TOZALASH
                    cart = [];


                    localStorage.setItem(
                        "nexoraCart",
                        JSON.stringify(cart)
                    );


                    updateCart();


                    checkoutForm.reset();


                    checkoutModal.style.display =
                        "none";


                    if (cartModal) {

                        cartModal.style.display =
                            "none";
                    }

                }
            );
        }

    }
);