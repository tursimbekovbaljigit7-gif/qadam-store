// ========================================
// QADAM ONLINE STORE
// SCRIPT.JS
// ========================================

let products = JSON.parse(
    localStorage.getItem("nexoraProducts")
) || [];

let cart = JSON.parse(
    localStorage.getItem("nexoraCart")
) || [];

let selectedCategory = "all";

// ========================================
// NARX
// ========================================

function formatPrice(price) {
    return Number(price || 0).toLocaleString("uz-UZ") + " so'm";
}

// ========================================
// MAHSULOTLARNI CHIQARISH
// ========================================

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

        const realIndex = products.findIndex(
            item => item.id === product.id
        );

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

                <button
                    type="button"
                    onclick="addToCart(${realIndex})"
                >
                    🛒 Xarid qilish
                </button>

            </div>
        `;

        container.appendChild(card);

    });
}

// ========================================
// SAVATGA QO‘SHISH
// ========================================

function addToCart(index) {

    const product = products[index];

    if (!product) return;

    cart.push(product);

    localStorage.setItem(
        "nexoraCart",
        JSON.stringify(cart)
    );

    updateCart();

    alert(
        "🛒 " + product.name + " savatga qo‘shildi!"
    );
}

// ========================================
// SAVATNI YANGILASH
// ========================================

function updateCart() {

    const count = document.getElementById("cart-count");
    const items = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    // SAVAT SONI

    if (count) {
        count.textContent = cart.length;
    }

    // SAVAT MAHSULOTLARI

    if (items) {

        if (cart.length === 0) {

            items.innerHTML = `
                <p>🛒 Savat hozircha bo‘sh.</p>
            `;

        } else {

            items.innerHTML = "";

            cart.forEach(function(product, index) {

                const item = document.createElement("div");

                item.className = "cart-item";

                item.innerHTML = `
                    <strong>
                        ${product.name}
                    </strong>

                    <p>
                        ${formatPrice(product.price)}
                    </p>

                    <button
                        type="button"
                        onclick="removeFromCart(${index})"
                    >
                        ❌ O‘chirish
                    </button>

                    <hr>
                `;

                items.appendChild(item);

            });
        }
    }

    // JAMI

    if (totalElement) {

        let sum = 0;

        cart.forEach(function(product) {

            sum += Number(product.price) || 0;

        });

        totalElement.textContent = formatPrice(sum);
    }
}

// ========================================
// SAVATDAN O‘CHIRISH
// ========================================

function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "nexoraCart",
        JSON.stringify(cart)
    );

    updateCart();
}

// ========================================
// QIDIRUV + KATEGORIYA
// ========================================

function searchProducts() {

    const input = document.getElementById("search-input");

    if (!input) return;

    const searchText = input.value
        .toLowerCase()
        .trim();

    let filtered = products.filter(function(product) {

        const name = String(product.name || "")
            .toLowerCase();

        const category = String(product.category || "")
            .toLowerCase();

        const searchMatch =
            name.includes(searchText) ||
            category.includes(searchText);

        const categoryMatch =
            selectedCategory === "all" ||
            category === selectedCategory.toLowerCase();

        return searchMatch && categoryMatch;

    });

    showProducts(filtered);
}

// ========================================
// KATEGORIYA
// ========================================

function filterCategory(category) {

    selectedCategory = category;

    const buttons = document.querySelectorAll(
        ".category-btn"
    );

    buttons.forEach(function(button) {

        button.classList.remove("active");

    });

    const activeButton = document.querySelector(
        `.category-btn[data-category="${category}"]`
    );

    if (activeButton) {
        activeButton.classList.add("active");
    }

    searchProducts();
}

// ========================================
// SAHIFA YUKLANGANDA
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // MAHSULOTLAR
        showProducts();

        // SAVAT
        updateCart();

        // ====================================
        // QIDIRUV
        // ====================================

        const searchInput =
            document.getElementById("search-input");

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                function() {

                    searchProducts();

                }
            );

        }

        // ====================================
        // KATEGORIYALAR
        // ====================================

        const categoryButtons =
            document.querySelectorAll(".category-btn");

        categoryButtons.forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const category =
                        this.dataset.category;

                    filterCategory(category);

                }
            );

        });

        // ====================================
        // SAVATNI OCHISH
        // ====================================

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

        // ====================================
        // SAVATNI YOPISH
        // ====================================

        if (closeCart && cartModal) {

            closeCart.addEventListener(
                "click",
                function() {

                    cartModal.style.display = "none";

                }
            );

        }

        // ====================================
        // BUYURTMA
        // ====================================

        const checkoutBtn =
            document.getElementById("checkout-btn");

        const checkoutModal =
            document.getElementById("checkout-modal");

        const closeCheckout =
            document.getElementById("close-checkout");

        if (checkoutBtn && checkoutModal) {

            checkoutBtn.addEventListener(
                "click",
                function() {

                    if (cart.length === 0) {

                        alert(
                            "🛒 Avval savatga mahsulot qo‘shing!"
                        );

                        return;
                    }

                    checkoutModal.style.display = "flex";

                }
            );

        }

        // ====================================
        // BUYURTMA OYNASINI YOPISH
        // ====================================

        if (closeCheckout && checkoutModal) {

            closeCheckout.addEventListener(
                "click",
                function() {

                    checkoutModal.style.display = "none";

                }
            );

        }

        // ====================================
        // BUYURTMA FORMASI
        // ====================================

        const checkoutForm =
            document.getElementById("checkout-form");

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

                    // ====================================
                    // ESKI BUYURTMALAR
                    // ====================================

                    const orders =
                        JSON.parse(
                            localStorage.getItem("nexoraOrders")
                        ) || [];

                    // ====================================
                    // JAMI
                    // ====================================

                    let total = 0;

                    cart.forEach(function(product) {

                        total += Number(product.price) || 0;

                    });

                    // ====================================
                    // BUYURTMA
                    // ====================================

                    const order = {

                        id: Date.now(),

                        date:
                            new Date().toLocaleString("uz-UZ"),

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

                    // ====================================
                    // XABAR
                    // ====================================

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

                    // ====================================
                    // SAVATNI TOZALASH
                    // ====================================

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

                }
            );

        }

    }
);