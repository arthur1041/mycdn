try {
    if (document.querySelector(".portal-notify-me-ref .notifyme.sku-notifyme").style.display !== "none") {
        document.querySelector(".prod-buttons").innerHTML = "<p class='txt-prod-indisponivel'>Esgotado</p>";
    }
} catch (e) {
    console.log(e);
}

//imagens do modal de desk e mobile
let productImageSrc = null;
let chooseLensImages = null;
let orderResume = null;

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
});

