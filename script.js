// ==========================================
// QADAM ONLINE STORE
// SCRIPT.JS
// ==========================================

let products = JSON.parse(localStorage.getItem("nexoraProducts")) || [];
let cart = JSON.parse(localStorage.getItem("nexoraCart")) || [];

let selectedCategory = "all";

// ==========================================
// NARX
// ==========================================

function formatPrice(price) {
    return Number(price || 0).toLocaleString("uz-UZ") + " so'm";
}

// ==========================================
// MAHSULOTLARNI CHIQARISH
// ==========================================

function showProducts(list = products) {

    const container = document.getElementById("products-list");

    if (!container) return;

    container.innerHTML = "";

    if (list.length === 0) {

        container.innerHTML = `
            <div class="no-products">
                <h3>😔 Mahsulot topilmadi</h3>
                <p>Boshqa mahsulotni qidirib ko‘ring.</p>
            </div>
        `;

        return;
    }

    list.forEach(function(product) {

        const card = document.createElement("div");

        card.className = "product-card";

        const realIndex = products.findIndex(function(item) {
            return item.id === product.id;
        });

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
                    class="detail-btn"
                    data-index="${realIndex}"
                >
                    👁 Batafsil
                </button>

            </div>
        `;

        container.appendChild(card);
    });

    // BATAFSIL tugmalari
    const detailButtons = document.querySelectorAll(".detail-btn");

    detailButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            const index = Number(this.dataset.index);

            showProductDetails(index);

        });

    });
}

// ==========================================
// MAHSULOT BATAFSIL
// ==========================================

function showProductDetails(index) {

    const product = products[index];

    if (!product) return;

    const modal = document.getElementById("product-modal");
    const details = document.getElementById("product-details");

    if (!modal || !details) {

        alert("Mahsulot oynasi HTMLda topilmadi.");

        return;
    }

    details.innerHTML = `
        <img
            src="${product.image || ""}"
            alt="${product.name || "Mahsulot"}"
            class="product-detail-image"
        >

        <div class="product-detail-info">

            <span class="product-category">
                ${product.category || "Mahsulot"}
            </span>

            <h2>
                ${product.name || "Nomsiz mahsulot"}
            </h2>

            <p class="product-detail-price">
                ${formatPrice(product.price)}
            </p>

            <p class="product-description">
                ${product.description || "Sifatli va zamonaviy mahsulot."}
            </p>

            <button
                type="button"
                id="detail-add-cart"
                class="detail-cart-btn"
            >
                🛒 Savatga qo‘shish
            </button>

        </div>
    `;

    modal.style.display = "flex";

    const addButton = document.getElementById("detail-add-cart");

    if (addButton) {

        addButton.addEventListener("click", function() {

            addToCart(index);

            closeProductModal();

        });

    }
}

// ==========================================
// BATAFSIL OYNANI YOPISH
// ==========================================

function closeProductModal() {

    const modal = document.getElementById("product-modal");

    if (modal) {

        modal.style.display = "none";

    }
}

// ==========================================
// SAVATGA QO‘SHISH
// ==========================================

function addToCart(index) {

    const product = products[index];

    if (!product) return;

    cart.push(product);

    localStorage.setItem(
        "nexoraCart",
        JSON.stringify(cart)
    );

    updateCart();

    alert("🛒 " + product.name + " savatga qo‘shildi!");
}

// ==========================================
// SAVATNI YANGILASH
// ==========================================

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
                <p>🛒 Savat hozircha bo‘sh.</p>
            `;

        } else {

            items.innerHTML = "";

            cart.forEach(function(product, index) {

                const item = document.createElement("div");

                item.className = "cart-item";

                item.innerHTML = `
                    <div>

                        <strong>
                            ${product.name || "Mahsulot"}
                        </strong>

                        <p>
                            ${formatPrice(product.price)}
                        </p>

                    </div>

                    <button
                        type="button"
                        class="remove-cart-btn"
                        data-index="${index}"
                    >
                        ❌ O‘chirish
                    </button>
                `;

                items.appendChild(item);

            });

            // O‘CHIRISH TUGMALARI
            const removeButtons =
                document.querySelectorAll(".remove-cart-btn");

            removeButtons.forEach(function(button) {

                button.addEventListener("click", function() {

                    const index = Number(this.dataset.index);

                    removeFromCart(index);

                });

            });

        }

    }

    // JAMI
    if (total) {

        let sum = 0;

        cart.forEach(function(product) {

            sum += Number(product.price) || 0;

        });

        total.textContent = formatPrice(sum);

    }
}

// ==========================================
// SAVATDAN O‘CHIRISH
// ==========================================

function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "nexoraCart",
        JSON.stringify(cart)
    );

    updateCart();
}

// ==========================================
// QIDIRUV
// ==========================================

function searchProducts() {

    const input = document.getElementById("search-input");

    if (!input) return;

    const text = input.value.toLowerCase().trim();

    let filtered = products.filter(function(product) {

        const name =
            String(product.name || "").toLowerCase();

        const category =
            String(product.category || "").toLowerCase();

        return (
            name.includes(text) ||
            category.includes(text)
        );

    });

    if (selectedCategory !== "all") {

        filtered = filtered.filter(function(product) {

            return String(product.category || "")
                .toLowerCase() ===
                selectedCategory.toLowerCase();

        });

    }

    showProducts(filtered);
}

// ==========================================
// KATEGORIYA
// ==========================================

function filterCategory(category) {

    selectedCategory = category;

    document
        .querySelectorAll(".category-btn")
        .forEach(function(button) {

            button.classList.remove("active");

        });

    const activeButton =
        document.querySelector(
            `.category-btn[data-category="${category}"]`
        );

    if (activeButton) {

        activeButton.classList.add("active");

    }

    searchProducts();
}

// ==========================================
// SAHIFA YUKLANGANDA
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    // MAHSULOTLAR
    showProducts();

    // SAVAT
    updateCart();

    // ======================================
    // QIDIRUV
    // ======================================

    const searchInput =
        document.getElementById("search-input");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchProducts
        );

    }

    // ======================================
    // KATEGORIYALAR
    // ======================================

    document
        .querySelectorAll(".category-btn")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    filterCategory(
                        this.dataset.category
                    );

                }
            );

        });

    // ======================================
    // SAVATNI OCHISH
    // ======================================

    const openCart =
        document.getElementById("open-cart");

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

    // ======================================
    // SAVATNI YOPISH
    // ======================================

    const closeCart =
        document.getElementById("close-cart");

    if (closeCart && cartModal) {

        closeCart.addEventListener(
            "click",
            function() {

                cartModal.style.display = "none";

            }
        );

    }

    // ======================================
    // BATAFSIL YOPISH
    // ======================================

    const closeProduct =
        document.getElementById("close-product");

    if (closeProduct) {

        closeProduct.addEventListener(
            "click",
            closeProductModal
        );

    }

    // ======================================
    // BUYURTMA
    // ======================================

    const checkoutBtn =
        document.getElementById("checkout-btn");

    const checkoutModal =
        document.getElementById("checkout-modal");

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

    // ======================================
    // BUYURTMA OYNASINI YOPISH
    // ======================================

    const closeCheckout =
        document.getElementById("close-checkout");

    if (closeCheckout && checkoutModal) {

        closeCheckout.addEventListener(
            "click",
            function() {

                checkoutModal.style.display = "none";

            }
        );

    }

    // ======================================
    // MODAL TASHQARISIGA BOSISH
    // ======================================

    window.addEventListener("click", function(event) {

        if (
            cartModal &&
            event.target === cartModal
        ) {

            cartModal.style.display = "none";

        }

        const productModal =
            document.getElementById("product-modal");

        if (
            productModal &&
            event.target === productModal
        ) {

            productModal.style.display = "none";

        }

        if (
            checkoutModal &&
            event.target === checkoutModal
        ) {

            checkoutModal.style.display = "none";

        }

    });

});