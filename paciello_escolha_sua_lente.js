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
    selectedLensParameters: null,
    selectedDecoParameters: null
}

//functions
function stringifyPrice(n) {
    return "R$ " + Number(n).toFixed(2).replace(".", ",");
}
function numberfyPrice(n) {
    console.log(n);
    try {
        return Number(
            n.replaceAll("R", "").replaceAll("$", "").replaceAll(" ", "").replaceAll(",", ".")
        );
    } catch (e) {
        console.log(e);
    }
    return 0;
}

function configureSelectedStuff() {
    if (selectedLensItems[0]) {
        if (selectedLensItems[0].classList.contains("lente-resina")) {
            chosenConfiguration.selectedLensParameters = chooseLensData.lenteResina.addToCartParameters;
        } else if (selectedLensItems[0].classList.contains("lente-policarbonato")) {
            chosenConfiguration.selectedLensParameters = chooseLensData.lentePolicarbonato.addToCartParameters;
        } else if (selectedLensItems[0].classList.contains("lente-resina-alto-indice")) {
            chosenConfiguration.selectedLensParameters = chooseLensData.lenteResinaAltoIndice.addToCartParameters;
        } else {
            chosenConfiguration.selectedDecoParameters = null;
        }
    }

    if (selectedDecorationItems[0]) {
        if (selectedDecorationItems[0].classList.contains("acabamento-luzes-azuis")) {
            chosenConfiguration.selectedDecoParameters = chooseLensData.lenteResinaAltoIndice.addToCartParameters;
        } else {
            chosenConfiguration.selectedDecoParameters = null;
        }
    }
}

//application:
let productImageSrc = null;
let chooseLensImages = null;
let orderResume = null;
let selectedLensItems = null;
let selectedDecorationItems = null;
let chooseDecorationBtn = null;
let lensItems = null;
let decorationItems = null;
let addToCartButtons = null;

DomReady.ready(function () {
    //adjusts
    try {
        if (document.querySelector(".portal-notify-me-ref .notifyme.sku-notifyme").style.display !== "none") {
            document.querySelector(".prod-buttons").innerHTML = "<p class='txt-prod-indisponivel'>Esgotado</p>";
        }
    } catch (e) {
        console.log(e);
    }

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

    selectedLensItems = document.querySelectorAll(".choose-lens-box .lens-list .lens-item.selected");
    selectedDecorationItems = document.querySelectorAll(".choose-lens-box .decoration-list .decoration-item.selected");

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

    lensItems = document.querySelectorAll(".choose-lens-box .lens-list .lens-item");

    lensItems.forEach(function (el) {
        el.addEventListener("click", function () {
            let selectedItem = document.querySelector(".choose-lens-box .lens-list .lens-item.selected");

            if (selectedItem.classList.contains("lente-resina")) {
                orderResume.forEach(function (ell) {
                    ell.querySelector(".order-lens .nome").innerText = chooseLensData.lenteResina.name;
                    ell.querySelector(".order-lens .price").innerText = stringifyPrice(chooseLensData.lenteResina.price);
                });
            } else if (selectedItem.classList.contains("lente-policarbonato")) {
                orderResume.forEach(function (ell) {
                    ell.querySelector(".order-lens .nome").innerText = chooseLensData.lentePolicarbonato.name;
                    ell.querySelector(".order-lens .price").innerText = stringifyPrice(chooseLensData.lentePolicarbonato.price);
                });
            } else if (selectedItem.classList.contains("lente-resina-alto-indice")) {
                orderResume.forEach(function (ell) {
                    ell.querySelector(".order-lens .nome").innerText = chooseLensData.lenteResinaAltoIndice.name;
                    ell.querySelector(".order-lens .price").innerText = stringifyPrice(chooseLensData.lenteResinaAltoIndice.price);;
                });
            } else {
                orderResume.forEach(function (ell) {
                    ell.querySelector(".order-lens .nome").innerText = "";
                    ell.querySelector(".order-lens .price").innerText = "";
                });
            }
            selectedLensItems = document.querySelectorAll(".choose-lens-box .lens-list .lens-item.selected");
            selectedDecorationItems = document.querySelectorAll(".choose-lens-box .decoration-list .decoration-item.selected");

            orderResume.forEach(function (ell) {
                try {
                    ell.querySelector(".order-total .price").innerText =
                        stringifyPrice(
                            numberfyPrice(chooseLensData.oculosPreco) +
                            numberfyPrice(orderResume[0].querySelector(".order-lens .price").innerText) +
                            numberfyPrice(orderResume[0].querySelector(".order-decoration .price").innerText)
                        );
                } catch (e) {
                    console.log(e)
                }
            });
        });
    });

    decorationItems = document.querySelectorAll(".choose-lens-box .decoration-list .decoration-item");

    decorationItems.forEach(function (el) {
        el.addEventListener("click", function () {
            let selectedItem = document.querySelector(".choose-lens-box .decoration-list .decoration-item.selected");

            if (selectedItem.classList.contains("acabamento-luzes-azuis")) {
                orderResume.forEach(function (ell) {
                    ell.querySelector(".order-decoration .nome").innerText = chooseLensData.acabamentoLuzesAzuis.name;
                    ell.querySelector(".order-decoration .price").innerText = stringifyPrice(chooseLensData.acabamentoLuzesAzuis.price);
                });
            } else {
                orderResume.forEach(function (ell) {
                    ell.querySelector(".order-decoration .nome").innerText = "";
                    ell.querySelector(".order-decoration .price").innerText = "";
                });
            }
            selectedLensItems = document.querySelectorAll(".choose-lens-box .lens-list .lens-item.selected");
            selectedDecorationItems = document.querySelectorAll(".choose-lens-box .decoration-list .decoration-item.selected");

            orderResume.forEach(function (ell) {
                try {
                    ell.querySelector(".order-total .price").innerText =
                        stringifyPrice(
                            numberfyPrice(chooseLensData.oculosPreco) +
                            numberfyPrice(orderResume[0].querySelector(".order-lens .price").innerText) +
                            numberfyPrice(orderResume[0].querySelector(".order-decoration .price").innerText)
                        );
                } catch (e) {
                    console.log(e)
                }
            });
        });
    });

    chooseDecorationBtn = document.querySelectorAll(".choose-lens-box .prod-btn.choose-decoration-btn");

    chooseDecorationBtn.forEach(function (el) {
        el.addEventListener("click", function () {
            selectedLensItems = document.querySelectorAll(".choose-lens-box .lens-list .lens-item.selected");

        });
    });

    addToCartButtons = document.querySelectorAll(".choose-lens-box .add-to-cart-btn:not(.continue)");

    addToCartButtons.addEventListener("click", function () {
        let params = "";

        configureSelectedStuff();

        if(chosenConfiguration.selectedLensParameters){
            params = chosenConfiguration.selectedLensParameters;
        } else if (chosenConfiguration.selectedDecoParameters){
            params = chosenConfiguration.selectedDecoParameters;
        } else if (chosenConfiguration.selectedLensParameters && chosenConfiguration.selectedDecoParameters){
            params = chosenConfiguration.selectedLensParameters + "&" + chosenConfiguration.selectedDecoParameters;
        }

        fetch(websitedomain + "/checkout/cart/add?"+params).then(function(response){
            console.log(response);
            fetchProductsFromCart("adding_prod");
        });
    });
});

