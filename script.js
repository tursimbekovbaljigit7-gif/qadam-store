// ==========================================
// QADAM ONLINE STORE
// 27-QADAM - TO‘LIQ
// ==========================================

let products =
    JSON.parse(
        localStorage.getItem("nexoraProducts")
    ) || [];

let cart =
    JSON.parse(
        localStorage.getItem("nexoraCart")
    ) || [];

let selectedCategory = "all";


// ==========================================
// NARX
// ==========================================

function formatPrice(price) {

    return Number(price || 0)
        .toLocaleString("uz-UZ") +
        " so'm";
}


// ==========================================
// CART SAQLASH
// ==========================================

function saveCart() {

    localStorage.setItem(
        "nexoraCart",
        JSON.stringify(cart)
    );
}


// ==========================================
// MAHSULOTLAR
// ==========================================

function showProducts(list = products) {

    const container =
        document.getElementById("products-list");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    if (list.length === 0) {

        container.innerHTML =
            '<div class="no-products">' +
            '<h3>😔 Mahsulot topilmadi</h3>' +
            '<p>Boshqa mahsulotni qidirib ko‘ring.</p>' +
            '</div>';

        return;
    }


    list.forEach(function(product) {

        const index =
            products.findIndex(function(item) {

                return item.id === product.id;

            });


        const card =
            document.createElement("div");

        card.className = "product-card";


        const image =
            document.createElement("img");

        image.src =
            product.image || "";

        image.alt =
            product.name || "Mahsulot";


        const info =
            document.createElement("div");

        info.className = "product-info";


        const category =
            document.createElement("span");

        category.className =
            "product-category";

        category.textContent =
            product.category || "Mahsulot";


        const name =
            document.createElement("h3");

        name.textContent =
            product.name ||
            "Nomsiz mahsulot";


        const price =
            document.createElement("p");

        price.className =
            "product-price";

        price.textContent =
            formatPrice(product.price);


        const detailButton =
            document.createElement("button");

        detailButton.type =
            "button";

        detailButton.className =
            "detail-btn";

        detailButton.textContent =
            "👁 Batafsil";


        detailButton.addEventListener(
            "click",
            function() {

                showProductDetails(index);

            }
        );


        info.appendChild(category);
        info.appendChild(name);
        info.appendChild(price);
        info.appendChild(detailButton);

        card.appendChild(image);
        card.appendChild(info);

        container.appendChild(card);

    });
}


// ==========================================
// BATAFSIL
// ==========================================

function showProductDetails(index) {

    const product =
        products[index];

    if (!product) {
        return;
    }


    const modal =
        document.getElementById(
            "product-modal"
        );

    const details =
        document.getElementById(
            "product-details"
        );

    if (!modal || !details) {
        return;
    }


    details.innerHTML = "";


    const image =
        document.createElement("img");

    image.className =
        "product-detail-image";

    image.src =
        product.image || "";

    image.alt =
        product.name || "Mahsulot";


    const category =
        document.createElement("span");

    category.className =
        "product-category";

    category.textContent =
        product.category || "Mahsulot";


    const name =
        document.createElement("h2");

    name.textContent =
        product.name ||
        "Nomsiz mahsulot";


    const price =
        document.createElement("p");

    price.className =
        "product-detail-price";

    price.textContent =
        formatPrice(product.price);


    const description =
        document.createElement("p");

    description.className =
        "product-description";

    description.textContent =
        product.description ||
        "Sifatli va zamonaviy mahsulot.";


    const button =
        document.createElement("button");

    button.type =
        "button";

    button.className =
        "detail-cart-btn";

    button.textContent =
        "🛒 Savatga qo‘shish";


    button.addEventListener(
        "click",
        function() {

            addToCart(index);

            closeProductModal();

        }
    );


    details.appendChild(image);
    details.appendChild(category);
    details.appendChild(name);
    details.appendChild(price);
    details.appendChild(description);
    details.appendChild(button);


    modal.style.display =
        "flex";
}


// ==========================================
// BATAFSILNI YOPISH
// ==========================================

function closeProductModal() {

    const modal =
        document.getElementById(
            "product-modal"
        );

    if (modal) {

        modal.style.display =
            "none";

    }
}


// ==========================================
// SAVATGA QO‘SHISH
// ==========================================

function addToCart(index) {

    const product =
        products[index];

    if (!product) {
        return;
    }


    const existing =
        cart.find(function(item) {

            return item.id === product.id;

        });


    if (existing) {

        existing.quantity =
            (Number(existing.quantity) || 1) + 1;

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
        document.getElementById(
            "cart-count"
        );

    const items =
        document.getElementById(
            "cart-items"
        );

    const total =
        document.getElementById(
            "cart-total"
        );


    if (!count || !items || !total) {
        return;
    }


    let totalQuantity =
        0;

    let totalPrice =
        0;


    items.innerHTML = "";


    if (cart.length === 0) {

        items.innerHTML =
            '<p>🛒 Savat hozircha bo‘sh.</p>';

    } else {

        cart.forEach(
            function(product, index) {

                const quantity =
                    Number(product.quantity) || 1;

                const price =
                    Number(product.price) || 0;


                totalQuantity +=
                    quantity;

                totalPrice +=
                    price * quantity;


                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "cart-item";


                const info =
                    document.createElement(
                        "div"
                    );

                info.className =
                    "cart-item-info";


                const name =
                    document.createElement(
                        "div"
                    );

                name.className =
                    "cart-item-name";

                name.textContent =
                    product.name ||
                    "Mahsulot";


                const productPrice =
                    document.createElement(
                        "div"
                    );

                productPrice.className =
                    "cart-item-price";

                productPrice.textContent =
                    formatPrice(price);


                const controls =
                    document.createElement(
                        "div"
                    );

                controls.className =
                    "cart-controls";


                const minus =
                    document.createElement(
                        "button"
                    );

                minus.type =
                    "button";

                minus.textContent =
                    "−";


                minus.addEventListener(
                    "click",
                    function() {

                        changeQuantity(
                            index,
                            -1
                        );

                    }
                );


                const quantityText =
                    document.createElement(
                        "span"
                    );

                quantityText.textContent =
                    quantity;


                const plus =
                    document.createElement(
                        "button"
                    );

                plus.type =
                    "button";

                plus.textContent =
                    "+";


                plus.addEventListener(
                    "click",
                    function() {

                        changeQuantity(
                            index,
                            1
                        );

                    }
                );


                controls.appendChild(minus);
                controls.appendChild(quantityText);
                controls.appendChild(plus);


                info.appendChild(name);
                info.appendChild(productPrice);
                info.appendChild(controls);


                const remove =
                    document.createElement(
                        "button"
                    );

                remove.type =
                    "button";

                remove.className =
                    "remove-cart-btn";

                remove.textContent =
                    "❌";


                remove.addEventListener(
                    "click",
                    function() {

                        removeFromCart(index);

                    }
                );


                item.appendChild(info);
                item.appendChild(remove);


                items.appendChild(item);

            }
        );

    }


    count.textContent =
        totalQuantity;

    total.textContent =
        formatPrice(totalPrice);

    saveCart();
}


// ==========================================
// MIQDOR
// ==========================================

function changeQuantity(
    index,
    amount
) {

    if (!cart[index]) {
        return;
    }


    const current =
        Number(cart[index].quantity) || 1;


    cart[index].quantity =
        current + amount;


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(index, 1);

    }


    saveCart();

    updateCart();
}


// ==========================================
// O‘CHIRISH
// ==========================================

function removeFromCart(index) {

    if (!cart[index]) {
        return;
    }


    cart.splice(index, 1);

    saveCart();

    updateCart();
}


// ==========================================
// QIDIRUV
// ==========================================

function searchProducts() {

    const input =
        document.getElementById(
            "search-input"
        );

    if (!input) {
        return;
    }


    const text =
        input.value
            .toLowerCase()
            .trim();


    let result =
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


                return (
                    name.includes(text) ||
                    category.includes(text)
                );

            }
        );


    if (
        selectedCategory !==
        "all"
    ) {

        result =
            result.filter(
                function(product) {

                    return String(
                        product.category || ""
                    ).toLowerCase() ===
                    selectedCategory.toLowerCase();

                }
            );

    }


    showProducts(result);
}


// ==========================================
// KATEGORIYA
// ==========================================

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
            '.category-btn[data-category="' +
            category +
            '"]'
        );


    if (active) {

        active.classList.add(
            "active"
        );

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


        // QIDIRUV

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


        // KATEGORIYALAR

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


        // SAVATNI OCHISH

        const openCart =
            document.getElementById(
                "open-cart"
            );

        const cartModal =
            document.getElementById(
                "cart-modal"
            );


        if (
            openCart &&
            cartModal
        ) {

            openCart.addEventListener(
                "click",
                function() {

                    updateCart();

                    cartModal.style.display =
                        "flex";

                }
            );

        }


        // SAVATNI YOPISH

        const closeCart =
            document.getElementById(
                "close-cart"
            );


        if (closeCart) {

            closeCart.addEventListener(
                "click",
                function() {

                    cartModal.style.display =
                        "none";

                }
            );

        }


        // BATAFSIL YOPISH

        const closeProduct =
            document.getElementById(
                "close-product"
            );


        if (closeProduct) {

            closeProduct.addEventListener(
                "click",
                closeProductModal
            );

        }


        // BUYURTMA

        const checkoutBtn =
            document.getElementById(
                "checkout-btn"
            );

        const checkoutModal =
            document.getElementById(
                "checkout-modal"
            );


        if (
            checkoutBtn &&
            checkoutModal
        ) {

            checkoutBtn.addEventListener(
                "click",
                function() {

                    if (
                        cart.length === 0
                    ) {

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


        // BUYURTMA YOPISH

        const closeCheckout =
            document.getElementById(
                "close-checkout"
            );


        if (
            closeCheckout &&
            checkoutModal
        ) {

            closeCheckout.addEventListener(
                "click",
                function() {

                    checkoutModal.style.display =
                        "none";

                }
            );

        }


        // BUYURTMA FORMASI

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
                        document.getElementById(
                            "customer-name"
                        ).value.trim();


                    const phone =
                        document.getElementById(
                            "customer-phone"
                        ).value.trim();


                    const address =
                        document.getElementById(
                            "customer-address"
                        ).value.trim();


                    const payment =
                        document.getElementById(
                            "payment-method"
                        ).value;


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


                    let total = 0;


                    cart.forEach(
                        function(product) {

                            const quantity =
                                Number(
                                    product.quantity
                                ) || 1;

                            total +=
                                (Number(
                                    product.price
                                ) || 0) *
                                quantity;

                        }
                    );


                    const orders =
                        JSON.parse(
                            localStorage.getItem(
                                "nexoraOrders"
                            )
                        ) || [];


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


                    checkoutModal.style.display =
                        "none";


                    if (cartModal) {

                        cartModal.style.display =
                            "none";

                    }

                }
            );

        }


        // MODAL TASHQARISIGA BOSISH

        window.addEventListener(
            "click",
            function(event) {

                if (
                    event.target ===
                    cartModal
                ) {

                    cartModal.style.display =
                        "none";

                }


                const productModal =
                    document.getElementById(
                        "product-modal"
                    );


                if (
                    event.target ===
                    productModal
                ) {

                    productModal.style.display =
                        "none";

                }


                if (
                    event.target ===
                    checkoutModal
                ) {

                    checkoutModal.style.display =
                        "none";

                }

            }
        );

    }
);