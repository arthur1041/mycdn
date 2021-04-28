

(function(){
    new InstagramFeed({
        'username': 'memento.vest',
        'container': document.querySelector("#instagram .galeria"),
        'display_profile': false,
        'display_biography': false,
        'display_gallery': true,
        'display_captions': false,
        'callback': null,
        'styling': true,
        'items': 8,
        'items_per_row': 4,
        'margin': 1 
    });
})();