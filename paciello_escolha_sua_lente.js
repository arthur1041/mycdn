// /checkout/cart/add?
//data
let chooseLensData = {
    oculosModelo: null,
    oculosPreco: null,
    lenteResina: {
        addToCartParameters: "sku=117&qty=1&seller=1&redirect=true&sc=1",
        productUrl: "/helsinki-paciello-cor-offwhitebege-oculosdesol/p",
        price: 14.96,
        name: "Resina"
    }, 
    lentePolicarbonato: {
        addToCartParameters: "sku=115&qty=1&seller=1&redirect=true&sc=1",
        productUrl: "/cannes-paciello-cor-branca-oculosdegrau/p",
        price: 14.96,
        name: "Policarbonato"
    },

    lenteResinaAltoIndice: {
        addToCartParameters: "sku=55&qty=1&seller=1&redirect=true&sc=1",
        productUrl: "/vancouver-paciello-cor-mel-lentesg15-oculosdesol/p",
        price: 19.60,
        name: "Resina de Alto Índice"
    },

    acabamentoLuzesAzuis: {
        addToCartParameters: "sku=41&qty=1&seller=1&redirect=true&sc=1",
        productUrl: "/moscou-paciello-cor-azul-oculosdegrau/p",
        price: 11.74,
        name: "Tratamento Proteção Luzes Azuis"
    }
}

let chosenConfiguration = {

}

function stringifyPrice(n){
    return "R$ "+Number(n).toFixed(2).replace(".", ",");
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
function ClassName(className) {

}


//application:
let productImageSrc = null;
let chooseLensImages = null;
let orderResume = null;
let selectedLensItems = null;
let chooseDecorationBtn = null;
let lensItems = null;

DomReady.ready(function () {
    try {
        chooseLensData.oculosModelo = vtxctx.categoryName;
    } catch (error) {
        console.log(error);
    }

    try {
        chooseLensData.oculosPreco = document.querySelector(".price-info .price .regular").innerText;
    } catch (error) {
        console.log(error);
    }

    try {
        productImageSrc = document.querySelector(".product-grid-container .product-images .image-wrapper img").getAttribute("src");
    } catch (error) {
        console.log(error);
    }

    orderResume = document.querySelectorAll(".choose-lens-box .order-resume");

    orderResume.forEach(function (el) {
        el.querySelector(".order-model .nome").innerText = chooseLensData.oculosModelo;
        el.querySelector(".order-model .price").innerText = chooseLensData.oculosPreco;
    });

    chooseLensImages = document.querySelectorAll(".choose-lens-box .product .product-image");

    chooseLensImages.forEach(function (el) {
        try {
            el.setAttribute("src", productImageSrc);
        } catch (e) {
            console.log(e);
        }
    });

    selectedLensItems = document.querySelectorAll(".choose-lens-box .lens-list .lens-item.selected");

    lensItems = document.querySelectorAll(".choose-lens-box .lens-list .lens-item");

    lensItems.forEach(function (el) {
        el.addEventListener("click", function () {
            document.querySelector(".choose-lens-box .lens-list .lens-item.selected");
        });
    });

    chooseDecorationBtn = document.querySelectorAll(".choose-lens-box .prod-btn.choose-decoration-btn");

    chooseDecorationBtn.forEach(function (el) {
        el.addEventListener("click", function () {
            selectedLensItems = document.querySelectorAll(".choose-lens-box .lens-list .lens-item.selected");

        });
    });
});

