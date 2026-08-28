// ==========================================
// QADAM ONLINE STORE
// SCRIPT.JS
// ==========================================

let products = JSON.parse(
    localStorage.getItem("nexoraProducts")
) || [];

let cart = JSON.parse(
    localStorage.getItem("nexoraCart")
) || [];

let selectedCategory = "all";


// ==========================================
// NARX FORMAT
// ==========================================

function formatPrice(price) {
    return Number(price || 0).toLocaleString("uz-UZ") + " so'm";
}


// ==========================================
// SAVATNI SAQLASH
// ==========================================

function saveCart() {
    localStorage.setItem(
        "nexoraCart",
        JSON.stringify(cart)
    );
}


// ==========================================
// MAHSULOTLARNI CHIQARISH
// ==========================================

function showProducts(list = products) {

    const container =
        document.getElementById("products-list");

    if (!container) return;

    container.innerHTML = "";

    if (list.length === 0) {

        container.innerHTML = `
            <div class="no-products">
                <h3>😔 Mahsulot topilmadi</h3>
                <p>Boshqa mahsulot nomini yoki kategoriyani tanlang.</p>
            </div>
        `;

        return;
    }

    list.forEach(function(product) {

        const card =
            document.createElement("div");

        card.className = "product-card";

        const realIndex =
            products.findIndex(function(item) {
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
                    onclick="showProductDetails(${realIndex})"
                >
                    👁 Batafsil
                </button>

            </div>
        `;

        container.appendChild(card);
    });
}


// ==========================================
// MAHSULOT BATAFSIL
// ==========================================

function showProductDetails(index) {

    const product = products[index];

    if (!product) return;

    const modal =
        document.getElementById("product-modal");

    const details =
        document.getElementById("product-details");

    if (!modal || !details) return;

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
                class="detail-cart-btn"
                onclick="addToCart(${index}); closeProductModal();"
            >
                🛒 Savatga qo‘shish
            </button>

        </div>
    `;

    modal.style.display = "flex";
}


// ==========================================
// BATAFSIL OYNANI YOPISH
// ==========================================

function closeProductModal() {

    const modal =
        document.getElementById("product-modal");

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

    const existingProduct =
        cart.find(function(item) {
            return item.id === product.id;
        });

    if (existingProduct) {

        existingProduct.quantity =
            (Number(existingProduct.quantity) || 1) + 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    saveCart();

    updateCart();

    alert(
        "🛒 " +
        product.name +
        " savatga qo‘shildi!"
    );
}


// ==========================================
// SAVATNI YANGILASH
// ==========================================

function updateCart() {

    const count =
        document.getElementById("cart-count");

    const items =
        document.getElementById("cart-items");

    const total =
        document.getElementById("cart-total");


    // ======================================
    // SAVAT SONI
    // ======================================

    if (count) {

        let countNumber = 0;

        cart.forEach(function(product) {

            countNumber +=
                Number(product.quantity) || 1;

        });

        count.textContent = countNumber;
    }


    // ======================================
    // SAVAT MAHSULOTLARI
    // ======================================

    if (items) {

        if (cart.length === 0) {

            items.innerHTML = `
                <div class="empty-cart">
                    🛒 Savat hozircha bo‘sh.
                </div>
            `;

        } else {

            items.innerHTML = "";

            cart.forEach(function(product, index) {

                if (!product.quantity) {
                    product.quantity = 1;
                }

                const item =
                    document.createElement("div");

                item.className = "cart-item";

                item.innerHTML = `
                    <div class="cart-item-left">

                        <img
                            src="${product.image || ""}"
                            alt="${product.name || "Mahsulot"}"
                        >

                        <div>

                            <strong>
                                ${product.name || "Mahsulot"}
                            </strong>

                            <p>
                                ${formatPrice(product.price)}
                            </p>

                            <div class="cart-quantity">

                                <button
                                    type="button"
                                    onclick="decreaseQuantity(${index})"
                                >
                                    −
                                </button>

                                <span>
                                    ${product.quantity}
                                </span>

                                <button
                                    type="button"
                                    onclick="increaseQuantity(${index})"
                                >
                                    +
                                </button>

                            </div>

                        </div>

                    </div>

                    <button
                        type="button"
                        onclick="removeFromCart(${index})"
                    >
                        ❌ O‘chirish
                    </button>
                `;

                items.appendChild(item);
            });
        }
    }


    // ======================================
    // JAMI NARX
    // ======================================

    if (total) {

        let sum = 0;

        cart.forEach(function(product) {

            const price =
                Number(product.price) || 0;

            const quantity =
                Number(product.quantity) || 1;

            sum += price * quantity;

        });

        total.textContent =
            formatPrice(sum);
    }

    saveCart();
}


// ==========================================
// + MIQDORNI OSHIRISH
// ==========================================

function increaseQuantity(index) {

    if (!cart[index]) return;

    cart[index].quantity =
        (Number(cart[index].quantity) || 1) + 1;

    saveCart();

    updateCart();
}


// ==========================================
// − MIQDORNI KAMAYTIRISH
// ==========================================

function decreaseQuantity(index) {

    if (!cart[index]) return;

    const quantity =
        Number(cart[index].quantity) || 1;

    if (quantity > 1) {

        cart[index].quantity =
            quantity - 1;

    } else {

        cart.splice(index, 1);

    }

    saveCart();

    updateCart();
}


// ==========================================
// SAVATDAN O‘CHIRISH
// ==========================================

function removeFromCart(index) {

    if (!cart[index]) return;

    cart.splice(index, 1);

    saveCart();

    updateCart();
}


// ==========================================
// QIDIRUV
// ==========================================

function searchProducts() {

    const input =
        document.getElementById("search-input");

    if (!input) return;

    const searchText =
        input.value.toLowerCase().trim();

    let filtered =
        products.filter(function(product) {

            const name =
                String(product.name || "")
                    .toLowerCase();

            const category =
                String(product.category || "")
                    .toLowerCase();

            return (
                name.includes(searchText) ||
                category.includes(searchText)
            );
        });


    if (selectedCategory !== "all") {

        filtered =
            filtered.filter(function(product) {

                return String(
                    product.category || ""
                ).toLowerCase() ===
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
            '.category-btn[data-category="' +
            category +
            '"]'
        );


    if (activeButton) {
        activeButton.classList.add("active");
    }

    searchProducts();
}


// ==========================================
// SAHIFA YUKLANGANDA
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {


        // MAHSULOTLAR
        showProducts();


        // SAVAT
        updateCart();


        // ==================================
        // QIDIRUV
        // ==================================

        const searchInput =
            document.getElementById("search-input");

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchProducts
            );
        }


        // ==================================
        // KATEGORIYALAR
        // ==================================

        const categoryButtons =
            document.querySelectorAll(
                ".category-btn"
            );

        categoryButtons.forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        filterCategory(
                            this.dataset.category
                        );

                    }
                );

            }
        );


        // ==================================
        // SAVATNI OCHISH
        // ==================================

        const openCart =
            document.getElementById("open-cart");

        const cartModal =
            document.getElementById("cart-modal");

        const closeCart =
            document.getElementById("close-cart");


        if (openCart) {

            openCart.onclick =
                function() {

                    const modal =
                        document.getElementById(
                            "cart-modal"
                        );

                    if (modal) {

                        modal.style.display =
                            "flex";

                        updateCart();

                    }

                };
        }


        // ==================================
        // SAVATNI YOPISH
        // ==================================

        if (closeCart) {

            closeCart.onclick =
                function() {

                    if (cartModal) {

                        cartModal.style.display =
                            "none";

                    }

                };
        }


        // ==================================
        // BATAFSIL OYNANI YOPISH
        // ==================================

        const closeProduct =
            document.getElementById(
                "close-product"
            );

        if (closeProduct) {

            closeProduct.onclick =
                closeProductModal;

        }


        // ==================================
        // BUYURTMA
        // ==================================

        const checkoutBtn =
            document.getElementById(
                "checkout-btn"
            );

        const checkoutModal =
            document.getElementById(
                "checkout-modal"
            );

        const closeCheckout =
            document.getElementById(
                "close-checkout"
            );


        if (checkoutBtn) {

            checkoutBtn.onclick =
                function() {

                    if (cart.length === 0) {

                        alert(
                            "🛒 Avval savatga mahsulot qo‘shing!"
                        );

                        return;
                    }

                    if (checkoutModal) {

                        checkoutModal.style.display =
                            "flex";

                    }

                };
        }


        // ==================================
        // BUYURTMA OYNASINI YOPISH
        // ==================================

        if (closeCheckout) {

            closeCheckout.onclick =
                function() {

                    if (checkoutModal) {

                        checkoutModal.style.display =
                            "none";

                    }

                };
        }


        // ==================================
        // BUYURTMA FORMASI
        // ==================================

        const checkoutForm =
            document.getElementById(
                "checkout-form"
            );


        if (checkoutForm) {

            checkoutForm.addEventListener(
                "submit",
                function(event) {

                    event.preventDefault();


                    const name =
                        document
                        .getElementById(
                            "customer-name"
                        )
                        .value
                        .trim();


                    const phone =
                        document
                        .getElementById(
                            "customer-phone"
                        )
                        .value
                        .trim();


                    const address =
                        document
                        .getElementById(
                            "customer-address"
                        )
                        .value
                        .trim();


                    const payment =
                        document
                        .getElementById(
                            "payment-method"
                        )
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


                    const orders =
                        JSON.parse(
                            localStorage.getItem(
                                "nexoraOrders"
                            )
                        ) || [];


                    let total = 0;


                    cart.forEach(
                        function(product) {

                            const price =
                                Number(
                                    product.price
                                ) || 0;

                            const quantity =
                                Number(
                                    product.quantity
                                ) || 1;

                            total +=
                                price * quantity;

                        }
                    );


                    const order = {

                        id: Date.now(),

                        date:
                            new Date()
                            .toLocaleString(
                                "uz-UZ"
                            ),

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


                    cart = [];


                    saveCart();


                    updateCart();


                    checkoutForm.reset();


                    if (checkoutModal) {

                        checkoutModal.style.display =
                            "none";

                    }


                    if (cartModal) {

                        cartModal.style.display =
                            "none";

                    }

                }
            );
        }


        // ==================================
        // MODAL TASHQARISIGA BOSILSA YOPISH
        // ==================================

        window.addEventListener(
            "click",
            function(event) {


                if (
                    cartModal &&
                    event.target === cartModal
                ) {

                    cartModal.style.display =
                        "none";

                }


                const productModal =
                    document.getElementById(
                        "product-modal"
                    );


                if (
                    productModal &&
                    event.target === productModal
                ) {

                    productModal.style.display =
                        "none";

                }


                if (
                    checkoutModal &&
                    event.target === checkoutModal
                ) {

                    checkoutModal.style.display =
                        "none";

                }

            }
        );

    }
);