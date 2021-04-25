//data
let chooseLensData = {
    lenteResina: {
        addToCartUrl: "/checkout/cart/add?sku=117&qty=1&seller=1&redirect=true&sc=1",
        productUrl: "https://paciello.myvtex.com/helsinki-paciello-cor-offwhitebege-oculosdesol/p",
    },
    lentePolicarbonato: {
        addToCartUrl: "/checkout/cart/add?sku=115&qty=1&seller=1&redirect=true&sc=1",
        productUrl: "https://paciello.myvtex.com/cannes-paciello-cor-branca-oculosdegrau/p"
    },

    lenteResinaAltoIndice: {
        addToCartUrl: "/checkout/cart/add?sku=55&qty=1&seller=1&redirect=true&sc=1",
        productUrl: "https://paciello.myvtex.com/vancouver-paciello-cor-mel-lentesg15-oculosdesol/p"
    },

    acabamentoLuzesAzuis: {
        addToCartUrl: "/checkout/cart/add?sku=41&qty=1&seller=1&redirect=true&sc=1",
        productUrl: "https://paciello.myvtex.com/moscou-paciello-cor-azul-oculosdegrau/p"
    }
}

//adjusts
try {
    if (document.querySelector(".portal-notify-me-ref .notifyme.sku-notifyme").style.display !== "none") {
        document.querySelector(".prod-buttons").innerHTML = "<p class='txt-prod-indisponivel'>Esgotado</p>";
    }
} catch (e) {
    console.log(e);
}

//functions
function findLensItemByClassName(className) {
    try {
        lensItems.forEach(function (el) {
            if(el.classList.contains(className)){
                return el;
            }
        });
    } catch (e) {
        console.log(e);
    }
}

//application:
let productImageSrc = null;
let chooseLensImages = null;
let orderResume = null;
let lensItems = null;

DomReady.ready(function () {
    try {
        productImageSrc = document.querySelector(".product-grid-container .product-images .image-wrapper img").getAttribute("src");
    } catch (error) {
        console.log(error);
    }

    orderResume = document.querySelectorAll(".choose-lens-box .order-resume");

    chooseLensImages = document.querySelectorAll(".choose-lens-box .product .product-image");

    chooseLensImages.forEach(function (el) {
        try {
            el.setAttribute("src", productImageSrc);
        } catch (e) {
            console.log(e);
        }
    });

    lensItems = document.querySelectorAll(".choose-lens-box .lens-list .lens-item");

    lensItems.forEach(function (el) {
        el.addEventListener("click", function () {

        });
    })
});

