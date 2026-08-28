// ======================================
// QADAM ONLINE STORE
// ======================================

var products = JSON.parse(localStorage.getItem("nexoraProducts")) || [];
var cart = JSON.parse(localStorage.getItem("nexoraCart")) || [];

var selectedCategory = "all";


// ======================================
// NARX
// ======================================

function formatPrice(price) {
    return Number(price || 0).toLocaleString("uz-UZ") + " so'm";
}


// ======================================
// MAHSULOTLARNI CHIQARISH
// ======================================

function showProducts(list) {

    var container = document.getElementById("products-list");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (!list) {
        list = products;
    }

    if (list.length === 0) {

        var empty = document.createElement("div");

        empty.className = "no-products";

        var title = document.createElement("h3");
        title.textContent = "😔 Mahsulot topilmadi";

        var text = document.createElement("p");
        text.textContent = "Boshqa mahsulotni qidirib ko'ring.";

        empty.appendChild(title);
        empty.appendChild(text);

        container.appendChild(empty);

        return;
    }


    list.forEach(function(product) {

        var card = document.createElement("div");

        card.className = "product-card";


        var image = document.createElement("img");

        image.src = product.image || "";

        image.alt = product.name || "Mahsulot";


        var info = document.createElement("div");

        info.className = "product-info";


        var category = document.createElement("span");

        category.className = "product-category";

        category.textContent = product.category || "Mahsulot";


        var name = document.createElement("h3");

        name.textContent = product.name || "Nomsiz mahsulot";


        var price = document.createElement("p");

        price.className = "product-price";

        price.textContent = formatPrice(product.price);


        var button = document.createElement("button");

        button.type = "button";

        button.textContent = "👁 Batafsil";


        var index = products.findIndex(function(item) {

            return item.id === product.id;

        });


        button.addEventListener("click", function() {

            showProductDetails(index);

        });


        info.appendChild(category);

        info.appendChild(name);

        info.appendChild(price);

        info.appendChild(button);


        card.appendChild(image);

        card.appendChild(info);


        container.appendChild(card);

    });

}


// ======================================
// MAHSULOT BATAFSIL
// ======================================

function showProductDetails(index) {

    var product = products[index];

    if (!product) {
        return;
    }


    var modal = document.getElementById("product-modal");

    var details = document.getElementById("product-details");


    if (!modal || !details) {

        alert(
            "Mahsulot oynasi HTML faylda topilmadi."
        );

        return;

    }


    details.innerHTML = "";


    var image = document.createElement("img");

    image.src = product.image || "";

    image.alt = product.name || "Mahsulot";

    image.className = "product-detail-image";


    var info = document.createElement("div");

    info.className = "product-detail-info";


    var category = document.createElement("span");

    category.className = "product-category";

    category.textContent =
        product.category || "Mahsulot";


    var name = document.createElement("h2");

    name.textContent =
        product.name || "Nomsiz mahsulot";


    var price = document.createElement("p");

    price.className = "product-detail-price";

    price.textContent =
        formatPrice(product.price);


    var description = document.createElement("p");

    description.className = "product-description";

    description.textContent =
        product.description ||
        "Sifatli va zamonaviy mahsulot.";


    var button = document.createElement("button");

    button.type = "button";

    button.className = "detail-cart-btn";

    button.textContent = "🛒 Savatga qo'shish";


    button.addEventListener("click", function() {

        addToCart(index);

        closeProductModal();

    });


    info.appendChild(category);

    info.appendChild(name);

    info.appendChild(price);

    info.appendChild(description);

    info.appendChild(button);


    details.appendChild(image);

    details.appendChild(info);


    modal.style.display = "flex";

}


// ======================================
// MAHSULOT OYNASINI YOPISH
// ======================================

function closeProductModal() {

    var modal =
        document.getElementById("product-modal");

    if (modal) {

        modal.style.display = "none";

    }

}


// ======================================
// SAVATGA QO'SHISH
// ======================================

function addToCart(index) {

    var product = products[index];

    if (!product) {
        return;
    }


    cart.push(product);


    localStorage.setItem(
        "nexoraCart",
        JSON.stringify(cart)
    );


    updateCart();


    alert(
        "🛒 " +
        product.name +
        " savatga qo'shildi!"
    );

}


// ======================================
// SAVATNI YANGILASH
// ======================================

function updateCart() {

    var count =
        document.getElementById("cart-count");

    var items =
        document.getElementById("cart-items");

    var total =
        document.getElementById("cart-total");


    if (count) {

        count.textContent = cart.length;

    }


    if (items) {

        items.innerHTML = "";


        if (cart.length === 0) {

            items.textContent =
                "🛒 Savat hozircha bo'sh.";

        }


        cart.forEach(function(product, index) {

            var item =
                document.createElement("div");

            item.className = "cart-item";


            var info =
                document.createElement("div");


            var name =
                document.createElement("strong");

            name.textContent =
                product.name;


            var price =
                document.createElement("p");

            price.textContent =
                formatPrice(product.price);


            var remove =
                document.createElement("button");

            remove.type = "button";

            remove.textContent =
                "❌ O'chirish";


            remove.addEventListener(
                "click",
                function() {

                    removeFromCart(index);

                }
            );


            info.appendChild(name);

            info.appendChild(price);


            item.appendChild(info);

            item.appendChild(remove);


            items.appendChild(item);

        });

    }


    if (total) {

        var sum = 0;


        cart.forEach(function(product) {

            sum += Number(product.price) || 0;

        });


        total.textContent =
            formatPrice(sum);

    }

}


// ======================================
// SAVATDAN O'CHIRISH
// ======================================

function removeFromCart(index) {

    cart.splice(index, 1);


    localStorage.setItem(
        "nexoraCart",
        JSON.stringify(cart)
    );


    updateCart();

}


// ======================================
// QIDIRUV
// ======================================

function searchProducts() {

    var input =
        document.getElementById("search-input");


    if (!input) {
        return;
    }


    var text =
        input.value.toLowerCase().trim();


    var filtered =
        products.filter(function(product) {

            var name =
                String(product.name || "")
                .toLowerCase();


            var category =
                String(product.category || "")
                .toLowerCase();


            var result =
                name.includes(text) ||
                category.includes(text);


            if (
                selectedCategory !== "all"
            ) {

                result =
                    result &&
                    category ===
                    selectedCategory.toLowerCase();

            }


            return result;

        });


    showProducts(filtered);

}


// ======================================
// KATEGORIYA
// ======================================

function filterCategory(category) {

    selectedCategory = category;


    var buttons =
        document.querySelectorAll(
            ".category-btn"
        );


    buttons.forEach(function(button) {

        button.classList.remove("active");

    });


    var active =
        document.querySelector(
            '.category-btn[data-category="' +
            category +
            '"]'
        );


    if (active) {

        active.classList.add("active");

    }


    searchProducts();

}


// ======================================
// SAHIFA YUKLANGANDA
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    function() {


        // Mahsulotlar
        showProducts();


        // Savat
        updateCart();


        // Qidiruv

        var search =
            document.getElementById(
                "search-input"
            );


        if (search) {

            search.addEventListener(
                "input",
                searchProducts
            );

        }


        // Kategoriyalar

        var buttons =
            document.querySelectorAll(
                ".category-btn"
            );


        buttons.forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    filterCategory(
                        button.dataset.category
                    );

                }
            );

        });


        // Savatni ochish

        var openCart =
            document.getElementById(
                "open-cart"
            );


        var cartModal =
            document.getElementById(
                "cart-modal"
            );


        var closeCart =
            document.getElementById(
                "close-cart"
            );


        if (openCart && cartModal) {

            openCart.addEventListener(
                "click",
                function() {

                    cartModal.style.display =
                        "flex";

                    updateCart();

                }
            );

        }


        // Savatni yopish

        if (closeCart && cartModal) {

            closeCart.addEventListener(
                "click",
                function() {

                    cartModal.style.display =
                        "none";

                }
            );

        }


        // Mahsulot oynasini yopish

        var closeProduct =
            document.getElementById(
                "close-product"
            );


        if (closeProduct) {

            closeProduct.addEventListener(
                "click",
                closeProductModal
            );

        }


        // Buyurtma

        var checkout =
            document.getElementById(
                "checkout-btn"
            );


        var checkoutModal =
            document.getElementById(
                "checkout-modal"
            );


        var closeCheckout =
            document.getElementById(
                "close-checkout"
            );


        if (checkout && checkoutModal) {

            checkout.addEventListener(
                "click",
                function() {

                    if (cart.length === 0) {

                        alert(
                            "🛒 Avval savatga mahsulot qo'shing!"
                        );

                        return;

                    }


                    checkoutModal.style.display =
                        "flex";

                }
            );

        }


        // Buyurtma oynasini yopish

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


        // Buyurtma formasi

        var form =
            document.getElementById(
                "checkout-form"
            );


        if (form) {

            form.addEventListener(
                "submit",
                function(event) {

                    event.preventDefault();


                    var name =
                        document.getElementById(
                            "customer-name"
                        ).value.trim();


                    var phone =
                        document.getElementById(
                            "customer-phone"
                        ).value.trim();


                    var address =
                        document.getElementById(
                            "customer-address"
                        ).value.trim();


                    var payment =
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
                            "⚠️ Barcha maydonlarni to'ldiring!"
                        );

                        return;

                    }


                    var orders =
                        JSON.parse(
                            localStorage.getItem(
                                "nexoraOrders"
                            )
                        ) || [];


                    var total = 0;


                    cart.forEach(function(product) {

                        total +=
                            Number(product.price) || 0;

                    });


                    var order = {

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
                        "\n💳 To'lov: " +
                        payment +
                        "\n💰 Jami: " +
                        formatPrice(total)
                    );


                    cart = [];


                    localStorage.setItem(
                        "nexoraCart",
                        JSON.stringify(cart)
                    );


                    updateCart();

                    form.reset();


                    checkoutModal.style.display =
                        "none";


                    if (cartModal) {

                        cartModal.style.display =
                            "none";

                    }

                }
            );

        }


        // Modal tashqarisiga bosish

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


                var productModal =
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