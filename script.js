// ========================================
// QADAM ONLINE STORE
// SCRIPT.JS
// 26-30 QADAMLAR
// ========================================


// ========================================
// MAHSULOTLAR
// ========================================

let products = JSON.parse(
    localStorage.getItem("nexoraProducts")
) || [];


// ========================================
// SAVAT
// ========================================

let cart = JSON.parse(
    localStorage.getItem("nexoraCart")
) || [];


// ========================================
// SEVIMLILAR
// ========================================

let favorites = JSON.parse(
    localStorage.getItem("qadamFavorites")
) || [];


// ========================================
// KATEGORIYA
// ========================================

let selectedCategory = "all";


// ========================================
// NARX FORMAT
// ========================================

function formatPrice(price) {

    return Number(price || 0)
        .toLocaleString("uz-UZ") +
        " so'm";

}


// ========================================
// MAHSULOTLARNI CHIQARISH
// ========================================

function showProducts(list = products) {

    const container =
        document.getElementById("products-list");

    if (!container) return;

    container.innerHTML = "";


    if (list.length === 0) {

        container.innerHTML = `
            <div class="no-products">

                <h3>
                    😔 Mahsulot topilmadi
                </h3>

                <p>
                    Boshqa mahsulot nomini
                    qidirib ko‘ring.
                </p>

            </div>
        `;

        return;

    }


    list.forEach(function(product) {

        const card =
            document.createElement("div");

        card.className =
            "product-card";


        const index =
            products.findIndex(
                item =>
                    item.id === product.id
            );


        const isFavorite =
            favorites.some(
                item =>
                    item.id === product.id
            );


        card.innerHTML = `

            <img
                src="${product.image || ""}"
                alt="${product.name || "Mahsulot"}"
                onclick="openProductModal(${index})"
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
                    onclick="addToCart(${index})"
                >
                    🛒 Xarid qilish
                </button>

                <button
                    type="button"
                    class="favorite-btn"
                    onclick="toggleFavorite(${index})"
                    style="
                        margin-top:8px;
                        background:${isFavorite ? "#ef4444" : "#f3f4f6"};
                        color:${isFavorite ? "white" : "#111827"};
                    "
                >
                    ${isFavorite ? "❤️ Sevimlida" : "🤍 Sevimli"}
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

    const product =
        products[index];

    if (!product) return;


    const existing =
        cart.find(
            item =>
                item.id === product.id
        );


    if (existing) {

        existing.quantity =
            (existing.quantity || 1) + 1;

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


// ========================================
// SAVATNI SAQLASH
// ========================================

function saveCart() {

    localStorage.setItem(
        "nexoraCart",
        JSON.stringify(cart)
    );

}


// ========================================
// SAVATNI YANGILASH
// ========================================

function updateCart() {

    const count =
        document.getElementById(
            "cart-count"
        );

    const items =
        document.getElementById(
            "cart-items"
        );

    const totalElement =
        document.getElementById(
            "cart-total"
        );


    // SONI

    let totalQuantity = 0;


    cart.forEach(function(item) {

        totalQuantity +=
            Number(item.quantity || 1);

    });


    if (count) {

        count.textContent =
            totalQuantity;

    }


    // MAHSULOTLAR

    if (items) {

        if (cart.length === 0) {

            items.innerHTML = `
                <p>
                    🛒 Savat hozircha bo‘sh.
                </p>
            `;

        } else {

            items.innerHTML = "";


            cart.forEach(
                function(product, index) {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "cart-item";


                    const quantity =
                        product.quantity || 1;


                    item.innerHTML = `

                        <strong>
                            ${product.name}
                        </strong>

                        <p class="cart-item-price">
                            ${formatPrice(product.price)}
                        </p>

                        <div class="quantity-box">

                            <button
                                type="button"
                                onclick="changeQuantity(${index}, -1)"
                            >
                                −
                            </button>

                            <span>
                                ${quantity}
                            </span>

                            <button
                                type="button"
                                onclick="changeQuantity(${index}, 1)"
                            >
                                +
                            </button>

                        </div>

                        <button
                            type="button"
                            class="remove-btn"
                            onclick="removeFromCart(${index})"
                        >
                            ❌ O‘chirish
                        </button>

                    `;


                    items.appendChild(item);

                }
            );

        }

    }


    // JAMI

    let total = 0;


    cart.forEach(function(product) {

        total +=
            (Number(product.price) || 0) *
            (Number(product.quantity) || 1);

    });


    if (totalElement) {

        totalElement.textContent =
            formatPrice(total);

    }

}


// ========================================
// MIQDORNI O‘ZGARTIRISH
// ========================================

function changeQuantity(index, change) {

    if (!cart[index]) return;


    cart[index].quantity =
        (cart[index].quantity || 1) +
        change;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();

    updateCart();

}


// ========================================
// SAVATDAN O‘CHIRISH
// ========================================

function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();

    updateCart();

}


// ========================================
// QIDIRUV
// ========================================

function searchProducts() {

    const input =
        document.getElementById(
            "search-input"
        );

    if (!input) return;


    const text =
        input.value
            .toLowerCase()
            .trim();


    let filtered =
        products.filter(
            function(product) {

                const name =
                    String(
                        product.name || ""
                    ).toLowerCase();


                const category =
                    String(
                        product.category || ""
                    ).toLowerCase();


                const searchMatch =
                    name.includes(text) ||
                    category.includes(text);


                const categoryMatch =
                    selectedCategory === "all" ||
                    category ===
                    selectedCategory.toLowerCase();


                return (
                    searchMatch &&
                    categoryMatch
                );

            }
        );


    showProducts(filtered);

}


// ========================================
// KATEGORIYA
// ========================================

function filterCategory(category) {

    selectedCategory =
        category;


    document
        .querySelectorAll(
            ".category-btn"
        )
        .forEach(
            function(button) {

                button.classList.remove(
                    "active"
                );

            }
        );


    const active =
        document.querySelector(
            `.category-btn[data-category="${category}"]`
        );


    if (active) {

        active.classList.add(
            "active"
        );

    }


    searchProducts();

}


// ========================================
// SEVIMLILAR
// ========================================

function toggleFavorite(index) {

    const product =
        products[index];

    if (!product) return;


    const existing =
        favorites.findIndex(
            item =>
                item.id === product.id
        );


    if (existing !== -1) {

        favorites.splice(
            existing,
            1
        );

        alert(
            "🤍 Sevimlilardan olib tashlandi"
        );

    } else {

        favorites.push(product);

        alert(
            "❤️ Sevimlilarga qo‘shildi!"
        );

    }


    localStorage.setItem(
        "qadamFavorites",
        JSON.stringify(favorites)
    );


    searchProducts();

}


// ========================================
// MAHSULOT BATAFSIL
// ========================================

let selectedProductIndex =
    null;


function openProductModal(index) {

    const product =
        products[index];

    if (!product) return;


    selectedProductIndex =
        index;


    const modal =
        document.getElementById(
            "product-modal"
        );


    const image =
        document.getElementById(
            "modal-product-image"
        );


    const category =
        document.getElementById(
            "modal-product-category"
        );


    const name =
        document.getElementById(
            "modal-product-name"
        );


    const price =
        document.getElementById(
            "modal-product-price"
        );


    const description =
        document.getElementById(
            "modal-product-description"
        );


    image.src =
        product.image || "";


    image.alt =
        product.name || "Mahsulot";


    category.textContent =
        product.category || "Mahsulot";


    name.textContent =
        product.name || "Nomsiz mahsulot";


    price.textContent =
        formatPrice(product.price);


    description.textContent =
        product.description ||
        "Sifatli va zamonaviy mahsulot.";


    modal.style.display =
        "flex";

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
            document.getElementById(
                "search-input"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchProducts
            );

        }


        // ====================================
        // KATEGORIYA
        // ====================================

        document
            .querySelectorAll(
                ".category-btn"
            )
            .forEach(
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


        // ====================================
        // SAVAT OCHISH
        // ====================================

        const openCart =
            document.getElementById(
                "open-cart"
            );


        const cartModal =
            document.getElementById(
                "cart-modal"
            );


        const closeCart =
            document.getElementById(
                "close-cart"
            );


        if (openCart) {

            openCart.addEventListener(
                "click",
                function() {

                    cartModal.style.display =
                        "flex";

                    updateCart();

                }
            );

        }


        // ====================================
        // SAVAT YOPISH
        // ====================================

        if (closeCart) {

            closeCart.addEventListener(
                "click",
                function() {

                    cartModal.style.display =
                        "none";

                }
            );

        }


        // ====================================
        // PRODUCT MODAL YOPISH
        // ====================================

        const productModal =
            document.getElementById(
                "product-modal"
            );


        const closeProductModal =
            document.getElementById(
                "close-product-modal"
            );


        if (closeProductModal) {

            closeProductModal.addEventListener(
                "click",
                function() {

                    productModal.style.display =
                        "none";

                }
            );

        }


        // ====================================
        // MODALDAN SAVATGA
        // ====================================

        const modalAddCart =
            document.getElementById(
                "modal-add-cart"
            );


        if (modalAddCart) {

            modalAddCart.addEventListener(
                "click",
                function() {

                    if (
                        selectedProductIndex !== null
                    ) {

                        addToCart(
                            selectedProductIndex
                        );

                    }

                }
            );

        }


        // ====================================
        // CHECKOUT
        // ====================================

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

            checkoutBtn.addEventListener(
                "click",
                function() {

                    if (cart.length === 0) {

                        alert(
                            "🛒 Avval savatga mahsulot qo‘shing!"
                        );

                        return;

                    }


                    checkoutModal.style.display =
                        "flex";

                }
            );

        }


        // ====================================
        // CHECKOUT YOPISH
        // ====================================

        if (closeCheckout) {

            closeCheckout.addEventListener(
                "click",
                function() {

                    checkoutModal.style.display =
                        "none";

                }
            );

        }


        // ====================================
        // BUYURTMA
        // ====================================

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


                    // BUYURTMALAR

                    const orders =
                        JSON.parse(
                            localStorage.getItem(
                                "nexoraOrders"
                            )
                        ) || [];


                    // JAMI

                    let total = 0;


                    cart.forEach(
                        function(product) {

                            total +=
                                (Number(
                                    product.price
                                ) || 0) *
                                (Number(
                                    product.quantity
                                ) || 1);

                        }
                    );


                    // BUYURTMA

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
                        JSON.stringify(
                            orders
                        )
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
                        formatPrice(
                            total
                        )
                    );


                    // SAVATNI TOZALASH

                    cart = [];


                    saveCart();

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


        // ====================================
        // MODALNI TASHQARISIGA BOSISH
        // ====================================

        document.addEventListener(
            "click",
            function(event) {

                if (
                    event.target === cartModal
                ) {

                    cartModal.style.display =
                        "none";

                }


                if (
                    event.target === productModal
                ) {

                    productModal.style.display =
                        "none";

                }


                if (
                    event.target === checkoutModal
                ) {

                    checkoutModal.style.display =
                        "none";

                }

            }
        );

    }
);