//DomReady
!function () { var e = window.DomReady = {}, t = navigator.userAgent.toLowerCase(), o = { version: (t.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1], safari: /webkit/.test(t), opera: /opera/.test(t), msie: /msie/.test(t) && !/opera/.test(t), mozilla: /mozilla/.test(t) && !/(compatible|webkit)/.test(t) }, n = !1, i = !1, a = []; function d() { if (!i && (i = !0, a)) { for (var e = 0; e < a.length; e++)a[e].call(window, []); a = [] } } function l() { if (!n) { var e, t, a; if (n = !0, document.addEventListener && !o.opera && document.addEventListener("DOMContentLoaded", d, !1), o.msie && window == top && function () { if (!i) { try { document.documentElement.doScroll("left") } catch (e) { return void setTimeout(arguments.callee, 0) } d() } }(), o.opera && document.addEventListener("DOMContentLoaded", function () { if (!i) { for (var e = 0; e < document.styleSheets.length; e++)if (document.styleSheets[e].disabled) return void setTimeout(arguments.callee, 0); d() } }, !1), o.safari) !function () { if (!i) if ("loaded" == document.readyState || "complete" == document.readyState) { if (void 0 === e) { for (var t = document.getElementsByTagName("link"), o = 0; o < t.length; o++)"stylesheet" == t[o].getAttribute("rel") && e++; var n = document.getElementsByTagName("style"); e += n.length } document.styleSheets.length == e ? d() : setTimeout(arguments.callee, 0) } else setTimeout(arguments.callee, 0) }(); t = d, a = window.onload, "function" != typeof window.onload ? window.onload = t : window.onload = function () { a && a(), t() } } } e.ready = function (e, t) { l(), i ? e.call(window, []) : a.push(function () { return e.call(window, []) }) }, l() }();

//InstagramFeed
function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}(function(a,b){"function"==typeof define&&define.amd?define([],b):"object"===("undefined"==typeof exports?"undefined":_typeof(exports))?module.exports=b():a.InstagramFeed=b()})(this,function(){function a(a){return a.replace(/[&<>"'`=\/]/g,function(a){return k[a]})}function b(a){return"undefined"!=typeof a.node.edge_media_to_caption.edges[0]&&"undefined"!=typeof a.node.edge_media_to_caption.edges[0].node&&"undefined"!=typeof a.node.edge_media_to_caption.edges[0].node.text&&null!==a.node.edge_media_to_caption.edges[0].node.text?a.node.edge_media_to_caption.edges[0].node.text:"undefined"!=typeof a.node.title&&null!==a.node.title&&0!=a.node.title.length?a.node.title:"undefined"!=typeof a.node.accessibility_caption&&null!==a.node.accessibility_caption&&0!=a.node.accessibility_caption.length&&a.node.accessibility_caption}function c(a,b){var c=b||!1;if(!b&&0<a.cache_time){var d=localStorage.getItem(a.cache_time_key);null!==d&&parseInt(d)+60000*a.cache_time>new Date().getTime()&&(c=!0)}if(c){var e=localStorage.getItem(a.cache_data_key);if(null!==e)return JSON.parse(e)}return!1}function d(a,b){var c=localStorage.getItem(a.cache_time_key),d=0!=a.cache_time&&(null===c||parseInt(c)+60000*a.cache_time>new Date().getTime());d&&(localStorage.setItem(a.cache_data_key,JSON.stringify(b)),localStorage.setItem(a.cache_time_key,new Date().getTime()))}function e(a,b){switch(a){case"username":case"tag":case"location":try{b=b.split("window._sharedData = ")[1].split("</script>")[0]}catch(a){return!1}return b=JSON.parse(b.substr(0,b.length-1)),b=b.entry_data.ProfilePage||b.entry_data.TagPage||b.entry_data.LocationsPage,"undefined"!=typeof b&&(b[0].graphql.user||b[0].graphql.hashtag||b[0].graphql.location);break;case"userid":return"undefined"!=typeof b.data.user&&b.data.user;}}function f(a,b,c,d,g,h){var i;g&&h&&(i="https://images"+~~(3333*Math.random())+"-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url="+a);var j=new XMLHttpRequest;j.onload=function(){4===j.readyState&&200===j.status&&(data=e(b,j.responseText),!1===data?d(!1):d(data))},j.onerror=function(i){1<c?(console.warn("Instagram Feed: Request failed, "+(c-1)+" tries left. Retrying..."),f(a,b,c-1,d,g,!h)):d(!1,i)},j.open("GET",i||a,!0),j.send()}function g(a,b){var e=c(a,!1);if(!1!==e)b(e);else{var g;switch(a.type){case"username":g=a.host+a.id+"/";break;case"tag":g=a.host+"explore/tags/"+a.id+"/";break;case"location":g=a.host+"explore/locations/"+a.id+"/";break;case"userid":g=a.host+"graphql/query/?query_id=17888483320059182&variables={\"id\":\""+a.id+"\",\"first\":"+a.items+",\"after\":null}";}f(g,a.type,a.max_tries,function(e,f){!1===e?"undefined"==typeof f?a.on_error("Instagram Feed: It looks like the profile you are trying to fetch is age restricted. See https://github.com/jsanahuja/InstagramFeed/issues/26",3):(e=c(a,!0),!1===e?a.on_error("Instagram Feed: Unable to fetch the given user/tag. Instagram responded with the status code: "+f.status,5):b(e)):(d(a,e),b(e))},a.host===i.host&&"userid"!=a.type,!1)}}function h(c,d){var e,f="";if(c.styling){var g=(100-2*c.margin*c.items_per_row)/c.items_per_row;e={profile_container:" style=\"text-align:center;\"",profile_image:" style=\"border-radius:10em;width:15%;max-width:125px;min-width:50px;\"",profile_name:" style=\"font-size:1.2em;\"",profile_biography:" style=\"font-size:1em;\"",gallery_image:" style=\"width:100%;\"",gallery_image_link:" style=\"width:"+g+"%; margin:"+c.margin+"%;position:relative; display: inline-block; height: 100%;\""},c.display_captions&&(f+="<style>                    a[data-caption]:hover::after {                        content: attr(data-caption);                        text-align: center;                        font-size: 0.8rem;                        color: black;                        position: absolute;                        left: 0;                        right: 0;                        bottom: 0;                        padding: 1%;                        max-height: 100%;                        overflow-y: auto;                        overflow-x: hidden;                        background-color: hsla(0, 100%, 100%, 0.8);                    }                </style>")}else e={profile_container:"",profile_image:"",profile_name:"",profile_biography:"",gallery_image:"",gallery_image_link:""};if(c.display_profile&&"userid"!==c.type&&(f+="<div class=\"instagram_profile\""+e.profile_container+">",f+="<img class=\"instagram_profile_image\" src=\""+d.profile_pic_url+"\" alt=\""+("tag"==c.type?d.name+" tag pic":d.username+" profile pic")+"\""+e.profile_image+(c.lazy_load?" loading=\"lazy\"":"")+" />","tag"==c.type?f+="<p class=\"instagram_tag\""+e.profile_name+"><a href=\"https://www.instagram.com/explore/tags/"+c.tag+"/\" rel=\"noopener\" target=\"_blank\">#"+c.tag+"</a></p>":"username"==c.type?(f+="<p class='instagram_username'"+e.profile_name+">@"+d.full_name+" (<a href='https://www.instagram.com/"+c.username+"/' rel='noopener' target='_blank'>@"+c.username+"</a>)</p>",c.display_biography&&(f+="<p class='instagram_biography'"+e.profile_biography+">"+d.biography+"</p>")):"location"==c.type&&(f+="<p class='instagram_location'"+e.profile_name+"><a href='https://www.instagram.com/explore/locations/"+c.location+"/' rel='noopener' target='_blank'>"+d.name+"</a></p>"),f+="</div>"),c.display_gallery)if("undefined"!=typeof d.is_private&&!0===d.is_private)f+="<p class=\"instagram_private\"><strong>This profile is private</strong></p>";else{var h="undefined"==typeof j[c.image_size]?j[640]:j[c.image_size],k=(d.edge_owner_to_timeline_media||d.edge_hashtag_to_media||d.edge_location_to_media).edges,l=k.length>c.items?c.items:k.length;f+="<div class='instagram_gallery'>";for(var m=0;m<l;m++){var n,o,p="https://www.instagram.com/p/"+k[m].node.shortcode,q=b(k[m],d);switch(!1===q&&(q=("userid"==c.type?"":c.id)+" image"),q=a(q),k[m].node.__typename){case"GraphSidecar":o="sidecar",n=k[m].node.thumbnail_resources[h].src;break;case"GraphVideo":o="video",n=k[m].node.thumbnail_src;break;default:o="image",n=k[m].node.thumbnail_resources[h].src;}f+="<a href=\""+p+"\""+(c.display_captions?" data-caption=\""+q+"\"":"")+" class=\"instagram-"+o+"\" rel=\"noopener\" target=\"_blank\""+e.gallery_image_link+">",f+="<img"+(c.lazy_load?" loading=\"lazy\"":"")+" src=\""+n+"\" alt=\""+q+"\""+e.gallery_image+" />",f+="</a>"}f+="</div>"}if(c.display_igtv&&"undefined"!=typeof d.edge_felix_video_timeline){var r=d.edge_felix_video_timeline.edges,l=r.length>c.items?c.items:r.length;if(0<r.length){f+="<div class=\"instagram_igtv\">";for(var m=0;m<l;m++){var p="https://www.instagram.com/p/"+r[m].node.shortcode,q=b(r[m],d);!1===q&&(q=("userid"==c.type?"":c.id)+" image"),q=a(q),f+="<a href=\""+p+"\""+(c.display_captions?" data-caption=\""+q+"\"":"")+" rel=\"noopener\" target=\"_blank\""+e.gallery_image_link+">",f+="<img"+(c.lazy_load?" loading=\"lazy\"":"")+" src=\""+r[m].node.thumbnail_src+"\" alt=\""+q+"\""+e.gallery_image+" />",f+="</a>"}f+="</div>"}}c.container.innerHTML=f}var i={host:"https://www.instagram.com/",username:"",tag:"",user_id:"",location:"",container:"",display_profile:!0,display_biography:!0,display_gallery:!0,display_captions:!1,display_igtv:!1,max_tries:8,callback:null,styling:!0,items:8,items_per_row:4,margin:.5,image_size:640,lazy_load:!1,cache_time:360,on_error:console.error},j={150:0,240:1,320:2,480:3,640:4},k={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};return"function"!=typeof Object.assign&&(Object.assign=function(a){'use strict';if(null==a)throw new TypeError("Cannot convert undefined or null to object");a=Object(a);for(var b,c=1;c<arguments.length;c++)if(b=arguments[c],null!=b)for(var d in b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a}),function(a){this.valid=!1;var b=Object.assign({},i);return(b=Object.assign(b,a),""==b.username&&""==b.tag&&""==b.user_id&&""==b.location)?(b.on_error("Instagram Feed: Error, no username, tag or user_id defined.",1),!1):("undefined"!=typeof a.display_profile&&a.display_profile&&""!=b.user_id&&console.warn("Instagram Feed: 'display_profile' is not available using 'user_id' (GraphQL API)"),"undefined"!=typeof a.display_biography&&a.display_biography&&(""!=b.tag||""!=b.location||""!=b.user_id)&&console.warn("Instagram Feed: 'display_biography' is not available unless you are loading an user ('username' parameter)"),"undefined"!=typeof b.get_data&&console.warn("Instagram Feed: options.get_data is deprecated, options.callback is always called if defined"),null==b.callback&&""==b.container?(b.on_error("Instagram Feed: Error, neither container found nor callback defined.",2),!1):void(""==b.username?""==b.tag?""==b.location?(b.type="userid",b.id=b.user_id):(b.type="location",b.id=b.location):(b.type="tag",b.id=b.tag):(b.type="username",b.id=b.username),b.cache_data_key="instagramFeed_"+b.type+"_"+b.id,b.cache_time_key=b.cache_data_key+"_time",g(b,function(a){""!=b.container&&h(b,a),null!=b.callback&&b.callback(a)}),this.valid=!0))}});

DomReady.ready(function(){
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
        console.log(e);
    }
});
