!function () { var e = window.DomReady = {}, t = navigator.userAgent.toLowerCase(), o = { version: (t.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1], safari: /webkit/.test(t), opera: /opera/.test(t), msie: /msie/.test(t) && !/opera/.test(t), mozilla: /mozilla/.test(t) && !/(compatible|webkit)/.test(t) }, n = !1, i = !1, a = []; function d() { if (!i && (i = !0, a)) { for (var e = 0; e < a.length; e++)a[e].call(window, []); a = [] } } function l() { if (!n) { var e, t, a; if (n = !0, document.addEventListener && !o.opera && document.addEventListener("DOMContentLoaded", d, !1), o.msie && window == top && function () { if (!i) { try { document.documentElement.doScroll("left") } catch (e) { return void setTimeout(arguments.callee, 0) } d() } }(), o.opera && document.addEventListener("DOMContentLoaded", function () { if (!i) { for (var e = 0; e < document.styleSheets.length; e++)if (document.styleSheets[e].disabled) return void setTimeout(arguments.callee, 0); d() } }, !1), o.safari) !function () { if (!i) if ("loaded" == document.readyState || "complete" == document.readyState) { if (void 0 === e) { for (var t = document.getElementsByTagName("link"), o = 0; o < t.length; o++)"stylesheet" == t[o].getAttribute("rel") && e++; var n = document.getElementsByTagName("style"); e += n.length } document.styleSheets.length == e ? d() : setTimeout(arguments.callee, 0) } else setTimeout(arguments.callee, 0) }(); t = d, a = window.onload, "function" != typeof window.onload ? window.onload = t : window.onload = function () { a && a(), t() } } } e.ready = function (e, t) { l(), i ? e.call(window, []) : a.push(function () { return e.call(window, []) }) }, l() }();

try {
    (function () {
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
} catch (e) {

}