window.addEventListener("load", () => {
    document.body.removeAttribute("style");
});

function htd(code) {
    const parser = new DOMParser();
    return parser.parseFromString(code, "text/html").querySelector("body").firstChild;
}

function configurePrateleiras() {
    let prateleirasAndSliders = [
        {
            prateleira: document.querySelector(".prateleira-modelos-paciello-mobile"),
            slider: document.querySelector(".prateleira-modelos-paciello-mobile + .slider")
        },
        {
            prateleira: document.querySelector(".prateleira-modelos-paciello"),
            slider: document.querySelector(".prateleira-modelos-paciello + .slider")
        },
        {
            prateleira: document.querySelector(".prateleira-special-partners"),
            slider: document.querySelector(".prateleira-special-partners + .slider")
        },
        {
            prateleira: document.querySelector(".prateleira-produtos-relacionados-mobile"),
            slider: document.querySelector(".prateleira-produtos-relacionados-mobile + .slider")
        },
        {
            prateleira: document.querySelector(".prateleira-produtos-relacionados"),
            slider: document.querySelector(".prateleira-produtos-relacionados + .slider")
        },

    ]
    prateleirasAndSliders.forEach(function (el) {
        try {
            el.prateleira.querySelectorAll("div.product-item").forEach(function (elm) {
                el.slider.append(elm);
            });
        } catch (error) {
            console.log(error);
        }
    });
}

function configureProductImages() {
    let productSlider = document.querySelector(".product-images > .product-slider");
    let productSliderNav = document.querySelector(".product-slider-nav");
    try {
        document.querySelectorAll(".apresentacao .thumbs li a").forEach(function (el) {
            productSliderNav.append(htd(`
            <img class="product-image" src="${el.getAttribute("zoom")}" />
        `));
            productSlider.appendChild(htd(`
        <div class="image-wrapper">
            <img class="product-image" src="${el.getAttribute("zoom")}" />
        </div>
        `));
        });
    } catch (error) {
        console.log(error);
    }
}

function configureProductPrice() {
    let valorDe = document.querySelector(".descricao-preco .valor-de strong");
    let valorPor = document.querySelector(".descricao-preco .valor-por strong");
    let numeroDeParcelas = document.querySelector(".descricao-preco .skuBestInstallmentNumber");
    let valorDaParcela = document.querySelector(".descricao-preco .skuBestInstallmentValue");
    let precoAvista = document.querySelector(".preco-a-vista .skuPrice");
    let economiaDe = document.querySelector(".economia-de .economia");

    let price = document.querySelector(".product-info .price");

    let priceInfo = document.querySelector(".product-info .price-info");

    if (priceInfo) {

        if (valorDe && valorDe.innerText.trim() != "") {
            try {
                priceInfo.append(htd(`
                <div class="price">
                    <span class="slash">${valorDe.innerText}</span>
                    <span class="regular">${valorPor.innerText}</span>
                </div>
                `));

            } catch (error) {
                console.log(error);
            }
        } else if (!valorDe) {
            try {
                priceInfo.append(htd(`
                <div class="price">
                    <span class="regular">${precoAvista.innerText}</span>
                </div>
                `));
            } catch (error) {
                console.log(error);
            }
        }

        if (valorDaParcela && valorDaParcela.innerText.trim() != "") {
            try {
                priceInfo.append(htd(`
                <p class="installments">ou <b>${numeroDeParcelas.innerText}</b> de <b>${valorDaParcela.innerText}</b> ${document.querySelector("em.valor-dividido.price-installments").innerText.includes("juros") ? "sem juros" : ""}</p>
            `));
            } catch (error) {
                console.log(error);
            }
        }
    }
}

function setUpLensModalFunctionalities() {
    let lensModalDesk = document.querySelector(".choose-lens-modal-desktop");
    let lensModalMob = document.querySelector(".choose-lens-modal-mobile");

    let lensItemsDesk = lensModalDesk.querySelectorAll(".lens-item");
    let lensItemsMob = lensModalMob.querySelectorAll(".lens-item");

    let decorationItemsDesk = lensModalDesk.querySelectorAll(".decoration-item");
    let decorationItemsMob = lensModalMob.querySelectorAll(".decoration-item");

    let chooseDecorationBtnDesk = lensModalDesk.querySelector(".choose-decoration-btn");
    let chooseDecorationBtnMob = lensModalMob.querySelector(".choose-decoration-btn");

    let chooseOtherLensBtnDesk = lensModalDesk.querySelector(".choose-other-lens-btn");
    let chooseOtherLensBtnMob = lensModalMob.querySelectorAll(".choose-other-lens-btn");

    if (lensModalDesk && lensModalMob) {
        if (lensItemsDesk) {
            for (let i = 0; i < lensItemsDesk.length; i++) {
                lensItemsDesk[i].addEventListener("click", function () {
                    if (!lensItemsDesk[i].classList.contains("selected")) {
                        lensItemsDesk.forEach(function (el) {
                            el.classList.remove("selected");
                        });

                        lensItemsDesk[i].classList.add("selected");

                        lensItemsMob.forEach(function (el) {
                            el.classList.remove("selected");
                        });

                        lensItemsMob[i].classList.add("selected");
                    } else {
                        lensItemsDesk[i].classList.remove("selected");
                        lensItemsMob[i].classList.remove("selected");
                    }
                });
            }
        }

        if (lensItemsMob) {
            for (let i = 0; i < lensItemsMob.length; i++) {
                lensItemsMob[i].addEventListener("click", function () {
                    if (!lensItemsMob[i].classList.contains("selected")) {
                        lensItemsMob.forEach(function (el) {
                            el.classList.remove("selected");
                        });
                        lensItemsMob[i].classList.add("selected");

                        //virar desk
                        lensItemsDesk.forEach(function (el) {
                            el.classList.remove("selected");
                        });

                        //virar desk
                        lensItemsDesk[i].classList.add("selected");
                    } else {
                        lensItemsMob[i].classList.remove("selected");
                        lensItemsMob[i].classList.remove("selected");
                    }
                });
            }
        }

        if (decorationItemsDesk) {
            for (let i = 0; i < decorationItemsDesk.length; i++) {
                decorationItemsDesk[i].addEventListener("click", function () {
                    if (!decorationItemsDesk[i].classList.contains("selected")) {
                        decorationItemsDesk.forEach(function (el) {
                            el.classList.remove("selected");
                        });

                        decorationItemsDesk[i].classList.add("selected");

                        decorationItemsMob.forEach(function (el) {
                            el.classList.remove("selected");
                        });

                        decorationItemsMob[i].classList.add("selected");
                    } else {
                        decorationItemsDesk[i].classList.remove("selected");
                        decorationItemsMob[i].classList.remove("selected");
                    }
                });
            }
        }

        if (decorationItemsMob) {
            for (let i = 0; i < decorationItemsMob.length; i++) {
                decorationItemsMob[i].addEventListener("click", function () {
                    if (!decorationItemsMob[i].classList.contains("selected")) {
                        decorationItemsMob.forEach(function (el) {
                            el.classList.remove("selected");
                        });
                        decorationItemsMob[i].classList.add("selected");

                        //virar desk
                        decorationItemsDesk.forEach(function (el) {
                            el.classList.remove("selected");
                        });

                        //virar desk
                        decorationItemsDesk[i].classList.add("selected");
                    } else {
                        decorationItemsMob[i].classList.remove("selected");
                        decorationItemsMob[i].classList.remove("selected");
                    }
                });
            }
        }

        chooseDecorationBtnDesk.addEventListener("click", function () {
            lensModalDesk.querySelector(".lens-list-wrapper").style.display = "none";
            lensModalDesk.querySelector(".decoration-list-wrapper").style.display = "block";

            lensModalMob.querySelector(".lens-list-wrapper").style.display = "none";
            lensModalMob.querySelector(".decoration-list-wrapper").style.display = "block";

        });

        chooseDecorationBtnMob.addEventListener("click", function () {
            lensModalMob.querySelector(".lens-list-wrapper").style.display = "none";
            lensModalMob.querySelector(".decoration-list-wrapper").style.display = "block";

            lensModalDesk.querySelector(".lens-list-wrapper").style.display = "none";
            lensModalDesk.querySelector(".decoration-list-wrapper").style.display = "block";

        });

        chooseOtherLensBtnDesk.addEventListener("click", function () {
            lensModalDesk.querySelector(".lens-list-wrapper").style.display = "block";
            lensModalDesk.querySelector(".decoration-list-wrapper").style.display = "none";

            lensModalMob.querySelector(".lens-list-wrapper").style.display = "block";
            lensModalMob.querySelector(".decoration-list-wrapper").style.display = "none";
            lensModalMob.querySelector(".choose-lens-product-wrapper").style.display = "none";

        });

        chooseOtherLensBtnMob.forEach(function (el) {
            el.addEventListener("click", function () {
                lensModalMob.querySelector(".lens-list-wrapper").style.display = "block";
                lensModalMob.querySelector(".decoration-list-wrapper").style.display = "none";
                lensModalMob.querySelector(".choose-lens-product-wrapper").style.display = "none";

                lensModalDesk.querySelector(".lens-list-wrapper").style.display = "block";
                lensModalDesk.querySelector(".decoration-list-wrapper").style.display = "none";
            });
        });

        console.log("rodoooooooooooooouuuuuuuuuuu")
    }
}

function setUpShortDescription() {
    try {
        if (document.querySelector(".product-description .productDescription") && document.querySelectorAll(".product-description .productDescription p").length > 1) {
            document.querySelector(".short-description").innerHTML = document.querySelector(".product-description .productDescription p:first-child").innerHTML;
        }
    } catch (error) {
        console.log(error);
    }
}

function setUpImageZoom() {
    let options = {
        // zoomWidth: 500,
        offset: { vertical: 0, horizontal: 0 },
        scale: 1.5
    }

    try {
        document.querySelectorAll(".product-slider .image-wrapper").forEach(function (el) {
            new ImageZoom(el, options);
        });
    } catch (error) {
        console.log(error);
    }
}

function setUpProductListingDepCatBus() {
    let productListingBox = document.querySelector(".category-product-listing");
    document.querySelectorAll(".fetched-products-wrapper .product-item").forEach(function (el) {
        try {
            productListingBox.append(el);
        } catch (e) {
            console.log(e);
        }
    })
}

function setUpOrderBy() {
    try {
        document.querySelector(".order-wrapper").append(document.querySelector(".orderBy #O"));
    } catch (e) {
        console.log(e);
    }
}


let numberOfOpenElementsThatBlocksScroll = 0;
let numberOfOpenElementsThatActivesOverlay = 0;

// add listener to disable scroll
function disableScroll() {
    numberOfOpenElementsThatBlocksScroll++;
    document.body.style.overflow = "hidden";
    // window.addEventListener("scroll", noScroll);
}

// Remove listener to re-enable scroll
function enableScroll() {
    numberOfOpenElementsThatBlocksScroll--;
    if (numberOfOpenElementsThatBlocksScroll === 0) {
        document.body.style.overflow = "auto";
    }
    // window.removeEventListener("scroll", noScroll);
}

function toggleMinicart() {
    let minicart = document.querySelector(".minicart");
    if (!minicart.classList.contains("open")) {

        disableScroll();
        showOverlay();
        minicart.classList.add("open");
    } else {
        enableScroll();
        hideOverlay();
        minicart.classList.remove("open");
    }
}

function openMinicart() {
    let minicart = document.querySelector(".minicart");
    if (!minicart.classList.contains("open")) {
        disableScroll();
        showOverlay();
        minicart.classList.add("open");
    }
}

function closeMinicart() {
    let minicart = document.querySelector(".minicart");
    if (minicart.classList.contains("open")) {
        enableScroll();
        hideOverlay();
        minicart.classList.remove("open");
    }
}

function showOverlay() {
    numberOfOpenElementsThatActivesOverlay++;
    let pageOverlay = document.querySelector(".page-overlay");
    if (!pageOverlay.classList.contains("open")) {
        document.querySelector(".page-overlay").classList.add("open");
    }
}

function hideOverlay() {
    numberOfOpenElementsThatActivesOverlay--;
    let pageOverlay = document.querySelector(".page-overlay");
    if (pageOverlay.classList.contains("open")) {
        if (numberOfOpenElementsThatActivesOverlay === 0) {
            document.querySelector(".page-overlay").classList.remove("open");
        }
    }
}

let websitedomain = null;

function fetchProductsFromCart(context = "") {
    let miniCart = document.querySelector("div.minicart");

    try {
        websitedomain = new URL(window.location.href).origin;
    } catch (error) {
        console.log(error);
    }

    if (websitedomain) {
        fetch(websitedomain + "/api/checkout/pub/orderForm?sc=1").then(function (response) {
            return response.json();
        }).then(function (responseData) {
            let cartItems = responseData.items;

            if (cartItems) {

                if (cartItems.length > 0) {
                    try {
                        miniCart.querySelector(".empty-minicart").classList.add("hidden");
                        miniCart.querySelector(".minicart-products").classList.remove("hidden");
                        miniCart.querySelector(".minicart-buttons").classList.remove("hidden");
                    } catch (error) {
                        console.log(error);
                    }

                } else {
                    try {
                        miniCart.querySelector(".empty-minicart").classList.remove("hidden");
                        miniCart.querySelector(".minicart-products").classList.add("hidden");
                        miniCart.querySelector(".minicart-buttons").classList.add("hidden");
                    } catch (error) {
                        console.log(error);
                    }
                }

                miniCart.querySelector(".product-list").innerHTML = "";

                cartItems.forEach(function (el) {
                    miniCart.querySelector(".product-list").append(htd(/*html */`
                        <li class="minicart-product-item">
                            <div class="minicart-product-item-content-wrapper">
                                <button class="btn-remove-from-cart" data-id-sku="${el.id}" data-produto-nome="${el.name}">
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
                                </button>
                                <div class="mc-prod-image"><a href="${websitedomain + el.detailUrl}"><img src="${el.imageUrl}"></a></div>
                                <div class="mc-prod-data">
                                    <p>${el.name}</p>
                                    <p>Qnt: ${el.quantity}</p>
                                    <p>R$ ${(el.price && el.price !== "") ? Number(el.price / 100).toFixed(2).replace(".", ",") : ""}</p>
                                </div>
                            </div>
                        </li>
                    `));
                });
            }

            document.querySelectorAll(".btn-remove-from-cart").forEach(function (el) {
                el.addEventListener("click", function (params) {
                    let produtoNome = el.getAttribute("data-produto-nome");
                    let produtoSku = el.getAttribute('data-id-sku');

                    vtexjs.checkout.getOrderForm().done(function (orderForm) {
                        // console.log(orderForm); 
                        for (var i = 0; i < orderForm.items.length; i++) {
                            if (orderForm.items[i].name == produtoNome) {
                                var updateItemObj = {
                                    "index": i,
                                    "quantity": 0
                                };
                                vtexjs.checkout.removeItems([updateItemObj]).done(function () {
                                    vtexjs.checkout.getOrderForm().done(function (orderForm) {
                                        fetchProductsFromCart();
                                    });
                                });

                            }
                        }

                    });
                })
            });

            if (context === "adding_prod") {
                openMinicart();
            }
        });
    }


}

function configureBuyBtn() {
    let btnComprar = null;

    try {
        btnComprar = document.querySelector(".prod-btn.buy-without-lens").parentElement;
    } catch (error) {
        console.log(error);
    }

    if (btnComprar) {

        try {
            btnComprar.onclick = function () {

                fetch(btnComprar.href).then(function () {
                    fetchProductsFromCart("adding_prod");
                });

                //prevent buy button from adding directly to cart

                return false;
            };
        } catch (error) {
            console.log(error);
        }
    }

}

function setUpBreadCrumb() {
    let breadcrumb = document.querySelector(".breadcrumb-section .breadcrumb");
    try {
        document.querySelectorAll(".vtex-breadcrumb-wrapper li").forEach(function (el) {
            breadcrumb.append(htd(/*html*/`
                <span class="breadcrumb-item">${el.innerText}</span>        
            `));
        });
    } catch (error) {
        console.log(e);
    }
}

DomReady.ready(function () {
    const header = document.querySelector("header");
    const menuBtn = document.querySelector(".menu-btn");
    const mobileMenu = document.querySelector(".mobile-menu");
    const submenuBtn = document.querySelectorAll(".submenu-btn");
    const closeSearchBtn = document.querySelector(".icon-close-search");
    const searchBtn = document.querySelector(".btn-search .search-icon");
    const searchBox = document.querySelector(".search-box");
    const productDetailsBtns = document.querySelectorAll(".product-details-controller .details-btn");
    const submenuItems = document.querySelectorAll(".desktop-nav > ul > li");
    const submenuItemsChildren = document.querySelectorAll("header .desktop-nav ul li .submenu");
    const cartBtn = document.querySelector(".header-icons-container .icon-cart");
    const closeMiniCartButton = document.querySelector(".minicart-close-button .close-button");
    const continuarComprandoBtn = document.querySelector(".continuar-comprando-btn");
    const lensModals = document.querySelectorAll(".choose-lens-modal-desktop, .choose-lens-modal-mobile");
    const addToCartBtn_opensModal = document.querySelector(".prod-buttons .add-to-cart-button");

    let menuOpen = false;

    configureProductPrice()
    configureProductImages();
    configurePrateleiras();
    setUpShortDescription();
    setUpImageZoom();
    setUpProductListingDepCatBus();
    setUpOrderBy();
    fetchProductsFromCart();
    configureBuyBtn();
    setUpBreadCrumb();

    try {
        menuBtn.addEventListener("click", () => {
            if (!menuOpen) {
                menuBtn.classList.add("open");
                // mobileMenu.classList.add("mobile-menu-open");
                disableScroll();
                menuOpen = true;
            } else {
                menuBtn.classList.remove("open");
                // mobileMenu.classList.remove("mobile-menu-open");
                enableScroll();
                menuOpen = false;
            }
        });
    } catch (e) {
        console.log(e);
    }

    let minicart = document.querySelector(".minicart");
    try {
        cartBtn.addEventListener("click", () => {
            toggleMinicart();
        });

    } catch (e) {
        console.log(e);
    }

    try {
        minicart.style.top = getElementDistanceFromTop(header) + "px";
    } catch (e) {
        console.log(e);
    }

    window.addEventListener("scroll", () => {
        try {
            if (getElementDistanceFromTop(header) > 0) {
                minicart.style.top = getElementDistanceFromTop(header) + "px";
            } else {
                minicart.setAttribute("style", "");
            }
        } catch (e) {
            console.log(e);
        }
    });

    try {
        closeMiniCartButton.addEventListener("click", () => {
            closeMinicart();
        });
    } catch (e) {
        console.log(e);
    }

    try {
        continuarComprandoBtn.addEventListener("click", () => {
            closeMinicart();
        });
    } catch (e) {
        console.log(e);
    }

    try {
        menuBtn.addEventListener("click", () => {
            if (menuOpen) {
                mobileMenu.classList.add("open");
            } else {
                mobileMenu.classList.remove("open");
            }
        });
    } catch (e) {
        console.log(e);
    }

    try {
        submenuBtn.forEach((el) => {
            el.addEventListener("click", () => {
                if (!el.querySelector("img").classList.contains("open")) {
                    submenuBtn.forEach((sb) => {
                        sb.querySelector("img").classList.remove("open");
                        sb.parentElement.querySelector(".submenu").classList.remove("open");
                    });
                    el.querySelector("img").classList.add("open");
                    el.parentElement.querySelector(".submenu").classList.add("open");
                } else {
                    el.querySelector("img").classList.remove("open");
                    el.parentElement.querySelector(".submenu").classList.remove("open");
                }
            });
        });
    } catch (e) {
        console.log(e);
    }

    try {
        searchBtn.addEventListener("click", () => {
            if (!searchBtn.classList.contains("cross")) {
                searchBtn.classList.add("cross");
                searchBox.classList.add("open");
            } else {
                searchBtn.classList.remove("cross");
                searchBox.classList.remove("open");
            }
        });
    } catch (e) {
        console.log(e);
    }

    try {
        productDetailsBtns.forEach((el) => {
            el.addEventListener("click", () => {
                if (!el.classList.contains("selected")) {
                    productDetailsBtns.forEach((elm) => {
                        if (elm.classList.contains("selected")) {
                            elm.classList.remove("selected");
                        }
                    });
                    document
                        .querySelectorAll(".product-details .prod-details-item")
                        .forEach((elm) => {
                            if (elm.classList.contains("open")) {
                                elm.classList.remove("open");
                            }
                        });

                    el.classList.add("selected");
                    document
                        .querySelector(
                            ".product-details .prod-details-item[aria-details='" +
                            el.getAttribute("aria-details") +
                            "']"
                        )
                        .classList.add("open");
                }
            });
        });
    } catch (e) {
        console.log(e);
    }

    const pageOverlay = document.querySelector(".page-overlay");
    try {
        submenuItems.forEach((el) => {
            el.addEventListener("mouseover", () => {
                if (
                    !pageOverlay.classList.contains("open") &&
                    el.querySelector(".submenu")
                ) {
                    showOverlay();
                }
            });
            el.addEventListener("mouseleave", () => {
                if (pageOverlay.classList.contains("open")) {
                    hideOverlay();
                }
            });
        });

        submenuItemsChildren.forEach((el) => {
            el.addEventListener("mouseover", () => {
                if (!pageOverlay.classList.contains("open")) {
                    showOverlay();
                }
            });

            el.addEventListener("mouseleave", () => {
                if (pageOverlay.classList.contains("open")) {
                    hideOverlay();
                }
            });
        });
    } catch (e) {
        console.log(e);
    }
    try {
        $(".carousel-mobile").slick({
            autoplay: true,
            prevArrow: false,
            nextArrow: false,
            infinite: true,
            slidesToShow: 1,
        });
    } catch (e) {
        console.log(e);
    }

    try {
        $(".carousel-desktop").slick({
            autoplay: true,
            prevArrow: false,
            nextArrow: false,
            infinite: true,
            slidesToShow: 1,
        });
    } catch (e) {
        console.log(e);
    }

    try {
        $(".products-section.has-small-slider .slider.desktop").slick({
            autoplay: true,
            dots: true,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 4,
        });
    } catch (e) {
        console.log(e);
    }

    try {
        $(".products-section.has-small-slider .slider.mobile").slick({
            autoplay: true,
            dots: true,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            rows: 2,
            slidesPerRow: 1,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                    },
                },
            ],
        });
    } catch (e) {
        console.log(e);
    }

    try {
        $(".marcas-section .marcas .slider").slick({
            autoplay: true,
            dots: true,
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 2,
        });
    } catch (e) {
        console.log(e);
    }

    try {
        $(".slider.one-prod").slick({
            autoplay: true,
            dots: true,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 4,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                    },
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ],
        });
    } catch (e) {
        console.log(e);
    }


    //lens modals common actions
    try {
        lensModals.forEach(el => {
            el.querySelector(".choose-lens-box-close-btn").addEventListener("click", () => {
                closeLensModals();
            });
        });
    } catch (e) {
        console.log(e);
    }

    try {
        addToCartBtn_opensModal.addEventListener("click", () => {
            openLensModals();
        });
    } catch (e) {
        console.log(e);
    }
    try {
        (function () {
            new InstagramFeed({
                'username': 'paciello.ipanema',
                'container': document.getElementById("instagram-images"),
                'display_profile': false,
                'display_biography': false,
                'display_gallery': true,
                'display_captions': false,
                'callback': slickInstaPosts,
                'styling': false,
                'items': 8,
                'items_per_row': 4,
                'margin': 1,
                'lazy_load': true,
                'on_error': console.error
            });
        })();
    } catch (e) {
        console.log(e);
    }


    function slickInstaPosts() {
        try {
            $(".slider-two-social").slick({
                autoplay: true,
                infinite: true,
                slidesToShow: 4,
                slidesToScroll: 4,
                responsive: [
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        },
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        },
                    },
                ],
            });
        } catch (e) {
            console.log(e);
        }
    }

    try {
        $(".product-slider").slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            infinite: true,
            asNavFor: ".product-slider-nav",
        });
    } catch (e) {
        console.log(e);
    }

    try {
        $(".product-slider-nav").slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: ".product-slider",
            centerMode: true,
            focusOnSelect: true,
            arrows: false,
        });
    } catch (e) {
        console.log(e);
    }

    try {
        $(".pictures-gallery-slider").slick({
            autoplay: true,
            dots: true,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ],
        });
    } catch (e) { }

    if (document.querySelector(".pagina-produto")) {
        try {
            document.querySelector(".product-details-controller span[aria-details='description']").click();
        } catch (error) {
            console.log(error);
        }
    }

    function noScroll() {
        window.scrollTo(0, 0);
    }



    function getElementDistanceFromTop(element) {
        return element.getBoundingClientRect().bottom;
    }

    function openLensModals() {
        disableScroll();
        lensModals.forEach(ele => {
            ele.classList.add("open");
        });
    }

    function closeLensModals() {
        enableScroll();
        lensModals.forEach(ele => {
            ele.classList.remove("open");
        });
    }


    setUpLensModalFunctionalities();

    document.querySelectorAll(".minicart .continuar-comprando-btn").forEach(function (el) {
        try {
            el.addEventListener("click", closeMinicart);
        } catch (e) {
            console.log(e);
        }
    })

    // Travar scroll ao abrir menu no mobile
    //espaÃ§amento titulo e btn x
    //fading no menu desk x
    //Expessura da fonte x
    // Tamanho das fontes dos produtos desk x
    // PreÃ§o inline no desk x
    // posicionamento da setas slider desk x
    //EspaÃ§o entre borda titulo x
    // Ajustar footer x
    // Tamanho da logo desk x

    // Fazer atÃ© compre com grau apenas, pular Personalize seu Ã³culos direto para institucionais 

});








// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

function ready(callbackFunc) {
    if (document.readyState !== "loading") {
        // Document is already ready, call the callback directly
        callbackFunc();
    } else if (document.addEventListener) {
        // All modern browsers to register DOMContentLoaded
        document.addEventListener("DOMContentLoaded", callbackFunc);
    } else {
        // Old IE browsers
        document.attachEvent("onreadystatechange", function () {
            if (document.readyState === "complete") {
                callbackFunc();
            }
        });
    }
}

function rebuildProductTitle(element) {
    element.forEach((el) => {
        let titleWords = el.innerText.split(" ");
        for (let i = 0; i < 2; i++) {
            titleWords.pop();
        }
        let newTitle = titleWords.join(" ");
        el.innerText = newTitle;
    });
}

ready(function () {
    let buyWithoutLensBtn = document.querySelector(".prod-btn.buy-without-lens");
    let vtexBuyBtn = document.querySelector(".buy-button.buy-button-ref");

    try {
        vtexBuyBtn.removeAttribute("style");
        buyWithoutLensBtn.parentElement.setAttribute(
            "href",
            vtexBuyBtn.getAttribute("href")
        );
    } catch (error) {

    }

    try {
        rebuildProductTitle(document.querySelectorAll(".fn.productName"));
    } catch (error) {

    }

    if (document.querySelector(".pagina-produto")) {
        document.querySelector(".product-details-controller .details-btn").click();
    }

    try {
        document.querySelectorAll(".desktop-nav .has-submenu .submenu").forEach(el => {
            el.addEventListener("mouseover", () => {
                el.parentElement.querySelector("a").classList.add("sub-item-hover");
            });
        });

        document.querySelectorAll(".desktop-nav .has-submenu .submenu").forEach(el => {
            el.addEventListener("mouseleave", () => {
                el.parentElement.querySelector("a").classList.remove("sub-item-hover");
            });
        });
    } catch (e) {
        console.log(e);
    }
});