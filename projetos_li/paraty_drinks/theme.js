(function () {
  var DomReady = (window.DomReady = {});

  // Everything that has to do with properly supporting our document ready event. Brought over from the most awesome jQuery.

  var userAgent = navigator.userAgent.toLowerCase();

  // Figure out what browser is being used
  var browser = {
    version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
    safari: /webkit/.test(userAgent),
    opera: /opera/.test(userAgent),
    msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
    mozilla:
      /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
  };

  var readyBound = false;
  var isReady = false;
  var readyList = [];

  // Handle when the DOM is ready
  function domReady() {
    // Make sure that the DOM is not already loaded
    if (!isReady) {
      // Remember that the DOM is ready
      isReady = true;

      if (readyList) {
        for (var fn = 0; fn < readyList.length; fn++) {
          readyList[fn].call(window, []);
        }

        readyList = [];
      }
    }
  }

  // From Simon Willison. A safe way to fire onload w/o screwing up everyone else.
  function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
      window.onload = func;
    } else {
      window.onload = function () {
        if (oldonload) {
          oldonload();
        }
        func();
      };
    }
  }

  // does the heavy work of working through the browsers idiosyncracies (let's call them that) to hook onload.
  function bindReady() {
    if (readyBound) {
      return;
    }

    readyBound = true;

    // Mozilla, Opera (see further below for it) and webkit nightlies currently support this event
    if (document.addEventListener && !browser.opera) {
      // Use the handy event callback
      document.addEventListener('DOMContentLoaded', domReady, false);
    }

    // If IE is used and is not in a frame
    // Continually check to see if the document is ready
    if (browser.msie && window == top)
      (function () {
        if (isReady) return;
        try {
          // If IE is used, use the trick by Diego Perini
          // http://javascript.nwbox.com/IEContentLoaded/
          document.documentElement.doScroll('left');
        } catch (error) {
          setTimeout(arguments.callee, 0);
          return;
        }
        // and execute any waiting functions
        domReady();
      })();

    if (browser.opera) {
      document.addEventListener(
        'DOMContentLoaded',
        function () {
          if (isReady) return;
          for (var i = 0; i < document.styleSheets.length; i++)
            if (document.styleSheets[i].disabled) {
              setTimeout(arguments.callee, 0);
              return;
            }
          // and execute any waiting functions
          domReady();
        },
        false
      );
    }

    if (browser.safari) {
      var numStyles;
      (function () {
        if (isReady) return;
        if (
          document.readyState != 'loaded' &&
          document.readyState != 'complete'
        ) {
          setTimeout(arguments.callee, 0);
          return;
        }
        if (numStyles === undefined) {
          var links = document.getElementsByTagName('link');
          for (var i = 0; i < links.length; i++) {
            if (links[i].getAttribute('rel') == 'stylesheet') {
              numStyles++;
            }
          }
          var styles = document.getElementsByTagName('style');
          numStyles += styles.length;
        }
        if (document.styleSheets.length != numStyles) {
          setTimeout(arguments.callee, 0);
          return;
        }

        // and execute any waiting functions
        domReady();
      })();
    }

    // A fallback to window.onload, that will always work
    addLoadEvent(domReady);
  }

  // This is the public function that people can use to hook up ready.
  DomReady.ready = function (fn, args) {
    // Attach the listeners
    bindReady();

    // If the DOM is already ready
    if (isReady) {
      // Execute the function immediately
      fn.call(window, []);
    } else {
      // Add the function to the wait list
      readyList.push(function () {
        return fn.call(window, []);
      });
    }
  };

  bindReady();
})();

//https://code.google.com/archive/p/domready/

!(function (e) {
  var a = {
      host: 'https://www.instagram.com/',
      username: '',
      tag: '',
      container: '',
      display_profile: !0,
      display_biography: !0,
      display_gallery: !0,
      display_igtv: !1,
      get_data: !1,
      callback: null,
      styling: !0,
      items: 8,
      items_per_row: 4,
      margin: 0.5,
      image_size: 640,
    },
    t = { 150: 0, 240: 1, 320: 2, 480: 3, 640: 4 };
  e.instagramFeed = function (r) {
    var i = e.fn.extend({}, a, r);
    if ('' == i.username && '' == i.tag)
      return (
        console.error('Instagram Feed: Error, no username or tag found.'), !1
      );
    if (
      (void 0 !== i.get_raw_json &&
        (console.warn(
          'Instagram Feed: get_raw_json is deprecated. See use get_data instead'
        ),
        (i.get_data = i.get_raw_json)),
      !i.get_data && '' == i.container)
    )
      return console.error('Instagram Feed: Error, no container found.'), !1;
    if (i.get_data && null == i.callback)
      return (
        console.error(
          'Instagram Feed: Error, no callback defined to get the raw json'
        ),
        !1
      );
    var s = '' == i.username,
      n = s
        ? i.host + 'explore/tags/' + i.tag + '/'
        : i.host + i.username + '/';
    return (
      e
        .get(n, function (a) {
          try {
            a = a.split('window._sharedData = ')[1].split('</script>')[0];
          } catch (e) {
            return void console.error(
              'Instagram Feed: It looks like the profile you are trying to fetch is age restricted. See https://github.com/jsanahuja/InstagramFeed/issues/26'
            );
          }
          if (
            void 0 !==
            (a =
              (a = JSON.parse(a.substr(0, a.length - 1))).entry_data
                .ProfilePage || a.entry_data.TagPage)
          )
            if (((a = a[0].graphql.user || a[0].graphql.hashtag), i.get_data))
              i.callback(a);
            else {
              var r = {
                profile_container: '',
                profile_image: '',
                profile_name: '',
                profile_biography: '',
                gallery_image: '',
              };
              if (i.styling) {
                (r.profile_container = " style='text-align:center;'"),
                  (r.profile_image =
                    " style='border-radius:10em;width:15%;max-width:125px;min-width:50px;'"),
                  (r.profile_name = " style='font-size:1.2em;'"),
                  (r.profile_biography = " style='font-size:1em;'");
                var n =
                  (100 - 2 * i.margin * i.items_per_row) / i.items_per_row;
                r.gallery_image =
                  " style='margin:" +
                  i.margin +
                  '% ' +
                  i.margin +
                  '%;width:' +
                  n +
                  "%;float:left;'";
              }
              var o = '';
              i.display_profile &&
                ((o +=
                  "<div class='instagram_profile'" + r.profile_container + '>'),
                (o +=
                  "<img class='instagram_profile_image' src='" +
                  a.profile_pic_url +
                  "' alt='" +
                  (s ? a.name + ' tag pic' : a.username + ' profile pic') +
                  "'" +
                  r.profile_image +
                  ' />'),
                (o += s
                  ? "<p class='instagram_tag'" +
                    r.profile_name +
                    "><a href='https://www.instagram.com/explore/tags/" +
                    i.tag +
                    "' rel='noopener' target='_blank'>#" +
                    i.tag +
                    '</a></p>'
                  : "<p class='instagram_username'" +
                    r.profile_name +
                    '>@' +
                    a.full_name +
                    " (<a href='https://www.instagram.com/" +
                    i.username +
                    "' rel='noopener' target='_blank'>@" +
                    i.username +
                    '</a>)</p>'),
                !s &&
                  i.display_biography &&
                  (o +=
                    "<p class='instagram_biography'" +
                    r.profile_biography +
                    '>' +
                    a.biography +
                    '</p>'),
                (o += '</div>'));
              var l = void 0 !== t[i.image_size] ? t[i.image_size] : t[640];
              if (i.display_gallery)
                if (void 0 !== a.is_private && !0 === a.is_private)
                  o +=
                    "<p class='instagram_private'><strong>This profile is private</strong></p>";
                else {
                  var g = (
                    a.edge_owner_to_timeline_media || a.edge_hashtag_to_media
                  ).edges;
                  (h = g.length > i.items ? i.items : g.length),
                    (o += "<div class='instagram_gallery'>"),
                    (o += '<ul>');
                  for (var d = 0; d < h; d++) {
                    var m,
                      _,
                      p = 'https://www.instagram.com/p/' + g[d].node.shortcode;
                    switch (g[d].node.__typename) {
                      case 'GraphSidecar':
                        (_ = 'sidecar'),
                          (m = g[d].node.thumbnail_resources[l].src);
                        break;
                      case 'GraphVideo':
                        (_ = 'video'), (m = g[d].node.thumbnail_src);
                        break;
                      default:
                        (_ = 'image'),
                          (m = g[d].node.thumbnail_resources[l].src);
                    }
                    void 0 !== g[d].node.edge_media_to_caption.edges[0] &&
                    void 0 !== g[d].node.edge_media_to_caption.edges[0].node &&
                    void 0 !==
                      g[d].node.edge_media_to_caption.edges[0].node.text &&
                    null !== g[d].node.edge_media_to_caption.edges[0].node.text
                      ? g[d].node.edge_media_to_caption.edges[0].node.text
                      : void 0 !== g[d].node.accessibility_caption &&
                        null !== g[d].node.accessibility_caption
                      ? g[d].node.accessibility_caption
                      : (s ? a.name : a.username) + ' image ' + d,
                      (o += '<li>'),
                      (o +=
                        "<a href='" +
                        p +
                        "' class='instagram-" +
                        _ +
                        "' rel='noopener' target='_blank'>"),
                      (o +=
                        "<img src='" +
                        m +
                        "' alt='Globe Commerce' style='height: auto;' />"),
                      (o += '</a>'),
                      (o += '</li>');
                  }
                  (o += '</ul>'), (o += '</div>');
                }
              if (i.display_igtv && void 0 !== a.edge_felix_video_timeline) {
                var c = a.edge_felix_video_timeline.edges,
                  h = c.length > i.items ? i.items : c.length;
                if (c.length > 0) {
                  o += "<div class='instagram_igtv'>";
                  for (d = 0; d < h; d++)
                    (o +=
                      "<a href='https://www.instagram.com/p/" +
                      c[d].node.shortcode +
                      "' rel='noopener' target='_blank'>"),
                      (o +=
                        "<img src='" +
                        c[d].node.thumbnail_src +
                        "' alt='" +
                        i.username +
                        ' instagram image ' +
                        d +
                        "'" +
                        r.gallery_image +
                        ' />'),
                      (o += '</a>');
                  o += '</div>';
                }
              }
              e(i.container).html(o);
            }
          else
            console.error(
              'Instagram Feed: It looks like YOUR network has been temporary banned because of too many requests. See https://github.com/jsanahuja/jquery.instagramFeed/issues/25'
            );
        })
        .fail(function (e) {
          console.error(
            'Instagram Feed: Unable to fetch the given user/tag. Instagram responded with the status code: ',
            e.status
          );
        }),
      !0
    );
  };
})(jQuery);

!(function (i) {
  'use strict';
  'function' == typeof define && define.amd
    ? define(['jquery'], i)
    : 'undefined' != typeof exports
    ? (module.exports = i(require('jquery')))
    : i(jQuery);
})(function (i) {
  'use strict';
  var e = window.Slick || {};
  ((e = (function () {
    var e = 0;
    return function (t, o) {
      var s,
        n = this;
      (n.defaults = {
        accessibility: !0,
        adaptiveHeight: !1,
        appendArrows: i(t),
        appendDots: i(t),
        arrows: !0,
        asNavFor: null,
        prevArrow:
          '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
        nextArrow:
          '<button class="slick-next" aria-label="Next" type="button">Next</button>',
        autoplay: !1,
        autoplaySpeed: 3e3,
        centerMode: !1,
        centerPadding: '50px',
        cssEase: 'ease',
        customPaging: function (e, t) {
          return i('<button type="button" />').text(t + 1);
        },
        dots: !1,
        dotsClass: 'slick-dots',
        draggable: !0,
        easing: 'linear',
        edgeFriction: 0.35,
        fade: !1,
        focusOnSelect: !1,
        focusOnChange: !1,
        infinite: !0,
        initialSlide: 0,
        lazyLoad: 'ondemand',
        mobileFirst: !1,
        pauseOnHover: !0,
        pauseOnFocus: !0,
        pauseOnDotsHover: !1,
        respondTo: 'window',
        responsive: null,
        rows: 1,
        rtl: !1,
        slide: '',
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: !0,
        swipeToSlide: !1,
        touchMove: !0,
        touchThreshold: 5,
        useCSS: !0,
        useTransform: !0,
        variableWidth: !1,
        vertical: !1,
        verticalSwiping: !1,
        waitForAnimate: !0,
        zIndex: 1e3,
      }),
        (n.initials = {
          animating: !1,
          dragging: !1,
          autoPlayTimer: null,
          currentDirection: 0,
          currentLeft: null,
          currentSlide: 0,
          direction: 1,
          $dots: null,
          listWidth: null,
          listHeight: null,
          loadIndex: 0,
          $nextArrow: null,
          $prevArrow: null,
          scrolling: !1,
          slideCount: null,
          slideWidth: null,
          $slideTrack: null,
          $slides: null,
          sliding: !1,
          slideOffset: 0,
          swipeLeft: null,
          swiping: !1,
          $list: null,
          touchObject: {},
          transformsEnabled: !1,
          unslicked: !1,
        }),
        i.extend(n, n.initials),
        (n.activeBreakpoint = null),
        (n.animType = null),
        (n.animProp = null),
        (n.breakpoints = []),
        (n.breakpointSettings = []),
        (n.cssTransitions = !1),
        (n.focussed = !1),
        (n.interrupted = !1),
        (n.hidden = 'hidden'),
        (n.paused = !0),
        (n.positionProp = null),
        (n.respondTo = null),
        (n.rowCount = 1),
        (n.shouldClick = !0),
        (n.$slider = i(t)),
        (n.$slidesCache = null),
        (n.transformType = null),
        (n.transitionType = null),
        (n.visibilityChange = 'visibilitychange'),
        (n.windowWidth = 0),
        (n.windowTimer = null),
        (s = i(t).data('slick') || {}),
        (n.options = i.extend({}, n.defaults, o, s)),
        (n.currentSlide = n.options.initialSlide),
        (n.originalSettings = n.options),
        void 0 !== document.mozHidden
          ? ((n.hidden = 'mozHidden'),
            (n.visibilityChange = 'mozvisibilitychange'))
          : void 0 !== document.webkitHidden &&
            ((n.hidden = 'webkitHidden'),
            (n.visibilityChange = 'webkitvisibilitychange')),
        (n.autoPlay = i.proxy(n.autoPlay, n)),
        (n.autoPlayClear = i.proxy(n.autoPlayClear, n)),
        (n.autoPlayIterator = i.proxy(n.autoPlayIterator, n)),
        (n.changeSlide = i.proxy(n.changeSlide, n)),
        (n.clickHandler = i.proxy(n.clickHandler, n)),
        (n.selectHandler = i.proxy(n.selectHandler, n)),
        (n.setPosition = i.proxy(n.setPosition, n)),
        (n.swipeHandler = i.proxy(n.swipeHandler, n)),
        (n.dragHandler = i.proxy(n.dragHandler, n)),
        (n.keyHandler = i.proxy(n.keyHandler, n)),
        (n.instanceUid = e++),
        (n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/),
        n.registerBreakpoints(),
        n.init(!0);
    };
  })()).prototype.activateADA = function () {
    this.$slideTrack
      .find('.slick-active')
      .attr({ 'aria-hidden': 'false' })
      .find('a, input, button, select')
      .attr({ tabindex: '0' });
  }),
    (e.prototype.addSlide = e.prototype.slickAdd =
      function (e, t, o) {
        var s = this;
        if ('boolean' == typeof t) (o = t), (t = null);
        else if (t < 0 || t >= s.slideCount) return !1;
        s.unload(),
          'number' == typeof t
            ? 0 === t && 0 === s.$slides.length
              ? i(e).appendTo(s.$slideTrack)
              : o
              ? i(e).insertBefore(s.$slides.eq(t))
              : i(e).insertAfter(s.$slides.eq(t))
            : !0 === o
            ? i(e).prependTo(s.$slideTrack)
            : i(e).appendTo(s.$slideTrack),
          (s.$slides = s.$slideTrack.children(this.options.slide)),
          s.$slideTrack.children(this.options.slide).detach(),
          s.$slideTrack.append(s.$slides),
          s.$slides.each(function (e, t) {
            i(t).attr('data-slick-index', e);
          }),
          (s.$slidesCache = s.$slides),
          s.reinit();
      }),
    (e.prototype.animateHeight = function () {
      var i = this;
      if (
        1 === i.options.slidesToShow &&
        !0 === i.options.adaptiveHeight &&
        !1 === i.options.vertical
      ) {
        var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
        i.$list.animate({ height: e }, i.options.speed);
      }
    }),
    (e.prototype.animateSlide = function (e, t) {
      var o = {},
        s = this;
      s.animateHeight(),
        !0 === s.options.rtl && !1 === s.options.vertical && (e = -e),
        !1 === s.transformsEnabled
          ? !1 === s.options.vertical
            ? s.$slideTrack.animate(
                { left: e },
                s.options.speed,
                s.options.easing,
                t
              )
            : s.$slideTrack.animate(
                { top: e },
                s.options.speed,
                s.options.easing,
                t
              )
          : !1 === s.cssTransitions
          ? (!0 === s.options.rtl && (s.currentLeft = -s.currentLeft),
            i({ animStart: s.currentLeft }).animate(
              { animStart: e },
              {
                duration: s.options.speed,
                easing: s.options.easing,
                step: function (i) {
                  (i = Math.ceil(i)),
                    !1 === s.options.vertical
                      ? ((o[s.animType] = 'translate(' + i + 'px, 0px)'),
                        s.$slideTrack.css(o))
                      : ((o[s.animType] = 'translate(0px,' + i + 'px)'),
                        s.$slideTrack.css(o));
                },
                complete: function () {
                  t && t.call();
                },
              }
            ))
          : (s.applyTransition(),
            (e = Math.ceil(e)),
            !1 === s.options.vertical
              ? (o[s.animType] = 'translate3d(' + e + 'px, 0px, 0px)')
              : (o[s.animType] = 'translate3d(0px,' + e + 'px, 0px)'),
            s.$slideTrack.css(o),
            t &&
              setTimeout(function () {
                s.disableTransition(), t.call();
              }, s.options.speed));
    }),
    (e.prototype.getNavTarget = function () {
      var e = this,
        t = e.options.asNavFor;
      return t && null !== t && (t = i(t).not(e.$slider)), t;
    }),
    (e.prototype.asNavFor = function (e) {
      var t = this.getNavTarget();
      null !== t &&
        'object' == typeof t &&
        t.each(function () {
          var t = i(this).slick('getSlick');
          t.unslicked || t.slideHandler(e, !0);
        });
    }),
    (e.prototype.applyTransition = function (i) {
      var e = this,
        t = {};
      !1 === e.options.fade
        ? (t[e.transitionType] =
            e.transformType + ' ' + e.options.speed + 'ms ' + e.options.cssEase)
        : (t[e.transitionType] =
            'opacity ' + e.options.speed + 'ms ' + e.options.cssEase),
        !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
    }),
    (e.prototype.autoPlay = function () {
      var i = this;
      i.autoPlayClear(),
        i.slideCount > i.options.slidesToShow &&
          (i.autoPlayTimer = setInterval(
            i.autoPlayIterator,
            i.options.autoplaySpeed
          ));
    }),
    (e.prototype.autoPlayClear = function () {
      var i = this;
      i.autoPlayTimer && clearInterval(i.autoPlayTimer);
    }),
    (e.prototype.autoPlayIterator = function () {
      var i = this,
        e = i.currentSlide + i.options.slidesToScroll;
      i.paused ||
        i.interrupted ||
        i.focussed ||
        (!1 === i.options.infinite &&
          (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1
            ? (i.direction = 0)
            : 0 === i.direction &&
              ((e = i.currentSlide - i.options.slidesToScroll),
              i.currentSlide - 1 == 0 && (i.direction = 1))),
        i.slideHandler(e));
    }),
    (e.prototype.buildArrows = function () {
      var e = this;
      !0 === e.options.arrows &&
        ((e.$prevArrow = i(e.options.prevArrow).addClass('slick-arrow')),
        (e.$nextArrow = i(e.options.nextArrow).addClass('slick-arrow')),
        e.slideCount > e.options.slidesToShow
          ? (e.$prevArrow
              .removeClass('slick-hidden')
              .removeAttr('aria-hidden tabindex'),
            e.$nextArrow
              .removeClass('slick-hidden')
              .removeAttr('aria-hidden tabindex'),
            e.htmlExpr.test(e.options.prevArrow) &&
              e.$prevArrow.prependTo(e.options.appendArrows),
            e.htmlExpr.test(e.options.nextArrow) &&
              e.$nextArrow.appendTo(e.options.appendArrows),
            !0 !== e.options.infinite &&
              e.$prevArrow
                .addClass('slick-disabled')
                .attr('aria-disabled', 'true'))
          : e.$prevArrow
              .add(e.$nextArrow)
              .addClass('slick-hidden')
              .attr({ 'aria-disabled': 'true', tabindex: '-1' }));
    }),
    (e.prototype.buildDots = function () {
      var e,
        t,
        o = this;
      if (!0 === o.options.dots) {
        for (
          o.$slider.addClass('slick-dotted'),
            t = i('<ul />').addClass(o.options.dotsClass),
            e = 0;
          e <= o.getDotCount();
          e += 1
        )
          t.append(i('<li />').append(o.options.customPaging.call(this, o, e)));
        (o.$dots = t.appendTo(o.options.appendDots)),
          o.$dots.find('li').first().addClass('slick-active');
      }
    }),
    (e.prototype.buildOut = function () {
      var e = this;
      (e.$slides = e.$slider
        .children(e.options.slide + ':not(.slick-cloned)')
        .addClass('slick-slide')),
        (e.slideCount = e.$slides.length),
        e.$slides.each(function (e, t) {
          i(t)
            .attr('data-slick-index', e)
            .data('originalStyling', i(t).attr('style') || '');
        }),
        e.$slider.addClass('slick-slider'),
        (e.$slideTrack =
          0 === e.slideCount
            ? i('<div class="slick-track"/>').appendTo(e.$slider)
            : e.$slides.wrapAll('<div class="slick-track"/>').parent()),
        (e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent()),
        e.$slideTrack.css('opacity', 0),
        (!0 !== e.options.centerMode && !0 !== e.options.swipeToSlide) ||
          (e.options.slidesToScroll = 1),
        i('img[data-lazy]', e.$slider).not('[src]').addClass('slick-loading'),
        e.setupInfinite(),
        e.buildArrows(),
        e.buildDots(),
        e.updateDots(),
        e.setSlideClasses(
          'number' == typeof e.currentSlide ? e.currentSlide : 0
        ),
        !0 === e.options.draggable && e.$list.addClass('draggable');
    }),
    (e.prototype.buildRows = function () {
      var i,
        e,
        t,
        o,
        s,
        n,
        r,
        l = this;
      if (
        ((o = document.createDocumentFragment()),
        (n = l.$slider.children()),
        l.options.rows > 1)
      ) {
        for (
          r = l.options.slidesPerRow * l.options.rows,
            s = Math.ceil(n.length / r),
            i = 0;
          i < s;
          i++
        ) {
          var d = document.createElement('div');
          for (e = 0; e < l.options.rows; e++) {
            var a = document.createElement('div');
            for (t = 0; t < l.options.slidesPerRow; t++) {
              var c = i * r + (e * l.options.slidesPerRow + t);
              n.get(c) && a.appendChild(n.get(c));
            }
            d.appendChild(a);
          }
          o.appendChild(d);
        }
        l.$slider.empty().append(o),
          l.$slider
            .children()
            .children()
            .children()
            .css({
              width: 100 / l.options.slidesPerRow + '%',
              display: 'inline-block',
            });
      }
    }),
    (e.prototype.checkResponsive = function (e, t) {
      var o,
        s,
        n,
        r = this,
        l = !1,
        d = r.$slider.width(),
        a = window.innerWidth || i(window).width();
      if (
        ('window' === r.respondTo
          ? (n = a)
          : 'slider' === r.respondTo
          ? (n = d)
          : 'min' === r.respondTo && (n = Math.min(a, d)),
        r.options.responsive &&
          r.options.responsive.length &&
          null !== r.options.responsive)
      ) {
        s = null;
        for (o in r.breakpoints)
          r.breakpoints.hasOwnProperty(o) &&
            (!1 === r.originalSettings.mobileFirst
              ? n < r.breakpoints[o] && (s = r.breakpoints[o])
              : n > r.breakpoints[o] && (s = r.breakpoints[o]));
        null !== s
          ? null !== r.activeBreakpoint
            ? (s !== r.activeBreakpoint || t) &&
              ((r.activeBreakpoint = s),
              'unslick' === r.breakpointSettings[s]
                ? r.unslick(s)
                : ((r.options = i.extend(
                    {},
                    r.originalSettings,
                    r.breakpointSettings[s]
                  )),
                  !0 === e && (r.currentSlide = r.options.initialSlide),
                  r.refresh(e)),
              (l = s))
            : ((r.activeBreakpoint = s),
              'unslick' === r.breakpointSettings[s]
                ? r.unslick(s)
                : ((r.options = i.extend(
                    {},
                    r.originalSettings,
                    r.breakpointSettings[s]
                  )),
                  !0 === e && (r.currentSlide = r.options.initialSlide),
                  r.refresh(e)),
              (l = s))
          : null !== r.activeBreakpoint &&
            ((r.activeBreakpoint = null),
            (r.options = r.originalSettings),
            !0 === e && (r.currentSlide = r.options.initialSlide),
            r.refresh(e),
            (l = s)),
          e || !1 === l || r.$slider.trigger('breakpoint', [r, l]);
      }
    }),
    (e.prototype.changeSlide = function (e, t) {
      var o,
        s,
        n,
        r = this,
        l = i(e.currentTarget);
      switch (
        (l.is('a') && e.preventDefault(),
        l.is('li') || (l = l.closest('li')),
        (n = r.slideCount % r.options.slidesToScroll != 0),
        (o = n
          ? 0
          : (r.slideCount - r.currentSlide) % r.options.slidesToScroll),
        e.data.message)
      ) {
        case 'previous':
          (s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o),
            r.slideCount > r.options.slidesToShow &&
              r.slideHandler(r.currentSlide - s, !1, t);
          break;
        case 'next':
          (s = 0 === o ? r.options.slidesToScroll : o),
            r.slideCount > r.options.slidesToShow &&
              r.slideHandler(r.currentSlide + s, !1, t);
          break;
        case 'index':
          var d =
            0 === e.data.index
              ? 0
              : e.data.index || l.index() * r.options.slidesToScroll;
          r.slideHandler(r.checkNavigable(d), !1, t),
            l.children().trigger('focus');
          break;
        default:
          return;
      }
    }),
    (e.prototype.checkNavigable = function (i) {
      var e, t;
      if (((e = this.getNavigableIndexes()), (t = 0), i > e[e.length - 1]))
        i = e[e.length - 1];
      else
        for (var o in e) {
          if (i < e[o]) {
            i = t;
            break;
          }
          t = e[o];
        }
      return i;
    }),
    (e.prototype.cleanUpEvents = function () {
      var e = this;
      e.options.dots &&
        null !== e.$dots &&
        (i('li', e.$dots)
          .off('click.slick', e.changeSlide)
          .off('mouseenter.slick', i.proxy(e.interrupt, e, !0))
          .off('mouseleave.slick', i.proxy(e.interrupt, e, !1)),
        !0 === e.options.accessibility &&
          e.$dots.off('keydown.slick', e.keyHandler)),
        e.$slider.off('focus.slick blur.slick'),
        !0 === e.options.arrows &&
          e.slideCount > e.options.slidesToShow &&
          (e.$prevArrow && e.$prevArrow.off('click.slick', e.changeSlide),
          e.$nextArrow && e.$nextArrow.off('click.slick', e.changeSlide),
          !0 === e.options.accessibility &&
            (e.$prevArrow && e.$prevArrow.off('keydown.slick', e.keyHandler),
            e.$nextArrow && e.$nextArrow.off('keydown.slick', e.keyHandler))),
        e.$list.off('touchstart.slick mousedown.slick', e.swipeHandler),
        e.$list.off('touchmove.slick mousemove.slick', e.swipeHandler),
        e.$list.off('touchend.slick mouseup.slick', e.swipeHandler),
        e.$list.off('touchcancel.slick mouseleave.slick', e.swipeHandler),
        e.$list.off('click.slick', e.clickHandler),
        i(document).off(e.visibilityChange, e.visibility),
        e.cleanUpSlideEvents(),
        !0 === e.options.accessibility &&
          e.$list.off('keydown.slick', e.keyHandler),
        !0 === e.options.focusOnSelect &&
          i(e.$slideTrack).children().off('click.slick', e.selectHandler),
        i(window).off(
          'orientationchange.slick.slick-' + e.instanceUid,
          e.orientationChange
        ),
        i(window).off('resize.slick.slick-' + e.instanceUid, e.resize),
        i('[draggable!=true]', e.$slideTrack).off(
          'dragstart',
          e.preventDefault
        ),
        i(window).off('load.slick.slick-' + e.instanceUid, e.setPosition);
    }),
    (e.prototype.cleanUpSlideEvents = function () {
      var e = this;
      e.$list.off('mouseenter.slick', i.proxy(e.interrupt, e, !0)),
        e.$list.off('mouseleave.slick', i.proxy(e.interrupt, e, !1));
    }),
    (e.prototype.cleanUpRows = function () {
      var i,
        e = this;
      e.options.rows > 1 &&
        ((i = e.$slides.children().children()).removeAttr('style'),
        e.$slider.empty().append(i));
    }),
    (e.prototype.clickHandler = function (i) {
      !1 === this.shouldClick &&
        (i.stopImmediatePropagation(), i.stopPropagation(), i.preventDefault());
    }),
    (e.prototype.destroy = function (e) {
      var t = this;
      t.autoPlayClear(),
        (t.touchObject = {}),
        t.cleanUpEvents(),
        i('.slick-cloned', t.$slider).detach(),
        t.$dots && t.$dots.remove(),
        t.$prevArrow &&
          t.$prevArrow.length &&
          (t.$prevArrow
            .removeClass('slick-disabled slick-arrow slick-hidden')
            .removeAttr('aria-hidden aria-disabled tabindex')
            .css('display', ''),
          t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()),
        t.$nextArrow &&
          t.$nextArrow.length &&
          (t.$nextArrow
            .removeClass('slick-disabled slick-arrow slick-hidden')
            .removeAttr('aria-hidden aria-disabled tabindex')
            .css('display', ''),
          t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()),
        t.$slides &&
          (t.$slides
            .removeClass(
              'slick-slide slick-active slick-center slick-visible slick-current'
            )
            .removeAttr('aria-hidden')
            .removeAttr('data-slick-index')
            .each(function () {
              i(this).attr('style', i(this).data('originalStyling'));
            }),
          t.$slideTrack.children(this.options.slide).detach(),
          t.$slideTrack.detach(),
          t.$list.detach(),
          t.$slider.append(t.$slides)),
        t.cleanUpRows(),
        t.$slider.removeClass('slick-slider'),
        t.$slider.removeClass('slick-initialized'),
        t.$slider.removeClass('slick-dotted'),
        (t.unslicked = !0),
        e || t.$slider.trigger('destroy', [t]);
    }),
    (e.prototype.disableTransition = function (i) {
      var e = this,
        t = {};
      (t[e.transitionType] = ''),
        !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
    }),
    (e.prototype.fadeSlide = function (i, e) {
      var t = this;
      !1 === t.cssTransitions
        ? (t.$slides.eq(i).css({ zIndex: t.options.zIndex }),
          t.$slides
            .eq(i)
            .animate({ opacity: 1 }, t.options.speed, t.options.easing, e))
        : (t.applyTransition(i),
          t.$slides.eq(i).css({ opacity: 1, zIndex: t.options.zIndex }),
          e &&
            setTimeout(function () {
              t.disableTransition(i), e.call();
            }, t.options.speed));
    }),
    (e.prototype.fadeSlideOut = function (i) {
      var e = this;
      !1 === e.cssTransitions
        ? e.$slides
            .eq(i)
            .animate(
              { opacity: 0, zIndex: e.options.zIndex - 2 },
              e.options.speed,
              e.options.easing
            )
        : (e.applyTransition(i),
          e.$slides.eq(i).css({ opacity: 0, zIndex: e.options.zIndex - 2 }));
    }),
    (e.prototype.filterSlides = e.prototype.slickFilter =
      function (i) {
        var e = this;
        null !== i &&
          ((e.$slidesCache = e.$slides),
          e.unload(),
          e.$slideTrack.children(this.options.slide).detach(),
          e.$slidesCache.filter(i).appendTo(e.$slideTrack),
          e.reinit());
      }),
    (e.prototype.focusHandler = function () {
      var e = this;
      e.$slider
        .off('focus.slick blur.slick')
        .on('focus.slick blur.slick', '*', function (t) {
          t.stopImmediatePropagation();
          var o = i(this);
          setTimeout(function () {
            e.options.pauseOnFocus &&
              ((e.focussed = o.is(':focus')), e.autoPlay());
          }, 0);
        });
    }),
    (e.prototype.getCurrent = e.prototype.slickCurrentSlide =
      function () {
        return this.currentSlide;
      }),
    (e.prototype.getDotCount = function () {
      var i = this,
        e = 0,
        t = 0,
        o = 0;
      if (!0 === i.options.infinite)
        if (i.slideCount <= i.options.slidesToShow) ++o;
        else
          for (; e < i.slideCount; )
            ++o,
              (e = t + i.options.slidesToScroll),
              (t +=
                i.options.slidesToScroll <= i.options.slidesToShow
                  ? i.options.slidesToScroll
                  : i.options.slidesToShow);
      else if (!0 === i.options.centerMode) o = i.slideCount;
      else if (i.options.asNavFor)
        for (; e < i.slideCount; )
          ++o,
            (e = t + i.options.slidesToScroll),
            (t +=
              i.options.slidesToScroll <= i.options.slidesToShow
                ? i.options.slidesToScroll
                : i.options.slidesToShow);
      else
        o =
          1 +
          Math.ceil(
            (i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll
          );
      return o - 1;
    }),
    (e.prototype.getLeft = function (i) {
      var e,
        t,
        o,
        s,
        n = this,
        r = 0;
      return (
        (n.slideOffset = 0),
        (t = n.$slides.first().outerHeight(!0)),
        !0 === n.options.infinite
          ? (n.slideCount > n.options.slidesToShow &&
              ((n.slideOffset = n.slideWidth * n.options.slidesToShow * -1),
              (s = -1),
              !0 === n.options.vertical &&
                !0 === n.options.centerMode &&
                (2 === n.options.slidesToShow
                  ? (s = -1.5)
                  : 1 === n.options.slidesToShow && (s = -2)),
              (r = t * n.options.slidesToShow * s)),
            n.slideCount % n.options.slidesToScroll != 0 &&
              i + n.options.slidesToScroll > n.slideCount &&
              n.slideCount > n.options.slidesToShow &&
              (i > n.slideCount
                ? ((n.slideOffset =
                    (n.options.slidesToShow - (i - n.slideCount)) *
                    n.slideWidth *
                    -1),
                  (r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1))
                : ((n.slideOffset =
                    (n.slideCount % n.options.slidesToScroll) *
                    n.slideWidth *
                    -1),
                  (r = (n.slideCount % n.options.slidesToScroll) * t * -1))))
          : i + n.options.slidesToShow > n.slideCount &&
            ((n.slideOffset =
              (i + n.options.slidesToShow - n.slideCount) * n.slideWidth),
            (r = (i + n.options.slidesToShow - n.slideCount) * t)),
        n.slideCount <= n.options.slidesToShow &&
          ((n.slideOffset = 0), (r = 0)),
        !0 === n.options.centerMode && n.slideCount <= n.options.slidesToShow
          ? (n.slideOffset =
              (n.slideWidth * Math.floor(n.options.slidesToShow)) / 2 -
              (n.slideWidth * n.slideCount) / 2)
          : !0 === n.options.centerMode && !0 === n.options.infinite
          ? (n.slideOffset +=
              n.slideWidth * Math.floor(n.options.slidesToShow / 2) -
              n.slideWidth)
          : !0 === n.options.centerMode &&
            ((n.slideOffset = 0),
            (n.slideOffset +=
              n.slideWidth * Math.floor(n.options.slidesToShow / 2))),
        (e =
          !1 === n.options.vertical
            ? i * n.slideWidth * -1 + n.slideOffset
            : i * t * -1 + r),
        !0 === n.options.variableWidth &&
          ((o =
            n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite
              ? n.$slideTrack.children('.slick-slide').eq(i)
              : n.$slideTrack
                  .children('.slick-slide')
                  .eq(i + n.options.slidesToShow)),
          (e =
            !0 === n.options.rtl
              ? o[0]
                ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width())
                : 0
              : o[0]
              ? -1 * o[0].offsetLeft
              : 0),
          !0 === n.options.centerMode &&
            ((o =
              n.slideCount <= n.options.slidesToShow ||
              !1 === n.options.infinite
                ? n.$slideTrack.children('.slick-slide').eq(i)
                : n.$slideTrack
                    .children('.slick-slide')
                    .eq(i + n.options.slidesToShow + 1)),
            (e =
              !0 === n.options.rtl
                ? o[0]
                  ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width())
                  : 0
                : o[0]
                ? -1 * o[0].offsetLeft
                : 0),
            (e += (n.$list.width() - o.outerWidth()) / 2))),
        e
      );
    }),
    (e.prototype.getOption = e.prototype.slickGetOption =
      function (i) {
        return this.options[i];
      }),
    (e.prototype.getNavigableIndexes = function () {
      var i,
        e = this,
        t = 0,
        o = 0,
        s = [];
      for (
        !1 === e.options.infinite
          ? (i = e.slideCount)
          : ((t = -1 * e.options.slidesToScroll),
            (o = -1 * e.options.slidesToScroll),
            (i = 2 * e.slideCount));
        t < i;

      )
        s.push(t),
          (t = o + e.options.slidesToScroll),
          (o +=
            e.options.slidesToScroll <= e.options.slidesToShow
              ? e.options.slidesToScroll
              : e.options.slidesToShow);
      return s;
    }),
    (e.prototype.getSlick = function () {
      return this;
    }),
    (e.prototype.getSlideCount = function () {
      var e,
        t,
        o = this;
      return (
        (t =
          !0 === o.options.centerMode
            ? o.slideWidth * Math.floor(o.options.slidesToShow / 2)
            : 0),
        !0 === o.options.swipeToSlide
          ? (o.$slideTrack.find('.slick-slide').each(function (s, n) {
              if (n.offsetLeft - t + i(n).outerWidth() / 2 > -1 * o.swipeLeft)
                return (e = n), !1;
            }),
            Math.abs(i(e).attr('data-slick-index') - o.currentSlide) || 1)
          : o.options.slidesToScroll
      );
    }),
    (e.prototype.goTo = e.prototype.slickGoTo =
      function (i, e) {
        this.changeSlide({ data: { message: 'index', index: parseInt(i) } }, e);
      }),
    (e.prototype.init = function (e) {
      var t = this;
      i(t.$slider).hasClass('slick-initialized') ||
        (i(t.$slider).addClass('slick-initialized'),
        t.buildRows(),
        t.buildOut(),
        t.setProps(),
        t.startLoad(),
        t.loadSlider(),
        t.initializeEvents(),
        t.updateArrows(),
        t.updateDots(),
        t.checkResponsive(!0),
        t.focusHandler()),
        e && t.$slider.trigger('init', [t]),
        !0 === t.options.accessibility && t.initADA(),
        t.options.autoplay && ((t.paused = !1), t.autoPlay());
    }),
    (e.prototype.initADA = function () {
      var e = this,
        t = Math.ceil(e.slideCount / e.options.slidesToShow),
        o = e.getNavigableIndexes().filter(function (i) {
          return i >= 0 && i < e.slideCount;
        });
      e.$slides
        .add(e.$slideTrack.find('.slick-cloned'))
        .attr({ 'aria-hidden': 'true', tabindex: '-1' })
        .find('a, input, button, select')
        .attr({ tabindex: '-1' }),
        null !== e.$dots &&
          (e.$slides
            .not(e.$slideTrack.find('.slick-cloned'))
            .each(function (t) {
              var s = o.indexOf(t);
              i(this).attr({
                role: 'tabpanel',
                id: 'slick-slide' + e.instanceUid + t,
                tabindex: -1,
              }),
                -1 !== s &&
                  i(this).attr({
                    'aria-describedby':
                      'slick-slide-control' + e.instanceUid + s,
                  });
            }),
          e.$dots
            .attr('role', 'tablist')
            .find('li')
            .each(function (s) {
              var n = o[s];
              i(this).attr({ role: 'presentation' }),
                i(this)
                  .find('button')
                  .first()
                  .attr({
                    role: 'tab',
                    id: 'slick-slide-control' + e.instanceUid + s,
                    'aria-controls': 'slick-slide' + e.instanceUid + n,
                    'aria-label': s + 1 + ' of ' + t,
                    'aria-selected': null,
                    tabindex: '-1',
                  });
            })
            .eq(e.currentSlide)
            .find('button')
            .attr({ 'aria-selected': 'true', tabindex: '0' })
            .end());
      for (var s = e.currentSlide, n = s + e.options.slidesToShow; s < n; s++)
        e.$slides.eq(s).attr('tabindex', 0);
      e.activateADA();
    }),
    (e.prototype.initArrowEvents = function () {
      var i = this;
      !0 === i.options.arrows &&
        i.slideCount > i.options.slidesToShow &&
        (i.$prevArrow
          .off('click.slick')
          .on('click.slick', { message: 'previous' }, i.changeSlide),
        i.$nextArrow
          .off('click.slick')
          .on('click.slick', { message: 'next' }, i.changeSlide),
        !0 === i.options.accessibility &&
          (i.$prevArrow.on('keydown.slick', i.keyHandler),
          i.$nextArrow.on('keydown.slick', i.keyHandler)));
    }),
    (e.prototype.initDotEvents = function () {
      var e = this;
      !0 === e.options.dots &&
        (i('li', e.$dots).on(
          'click.slick',
          { message: 'index' },
          e.changeSlide
        ),
        !0 === e.options.accessibility &&
          e.$dots.on('keydown.slick', e.keyHandler)),
        !0 === e.options.dots &&
          !0 === e.options.pauseOnDotsHover &&
          i('li', e.$dots)
            .on('mouseenter.slick', i.proxy(e.interrupt, e, !0))
            .on('mouseleave.slick', i.proxy(e.interrupt, e, !1));
    }),
    (e.prototype.initSlideEvents = function () {
      var e = this;
      e.options.pauseOnHover &&
        (e.$list.on('mouseenter.slick', i.proxy(e.interrupt, e, !0)),
        e.$list.on('mouseleave.slick', i.proxy(e.interrupt, e, !1)));
    }),
    (e.prototype.initializeEvents = function () {
      var e = this;
      e.initArrowEvents(),
        e.initDotEvents(),
        e.initSlideEvents(),
        e.$list.on(
          'touchstart.slick mousedown.slick',
          { action: 'start' },
          e.swipeHandler
        ),
        e.$list.on(
          'touchmove.slick mousemove.slick',
          { action: 'move' },
          e.swipeHandler
        ),
        e.$list.on(
          'touchend.slick mouseup.slick',
          { action: 'end' },
          e.swipeHandler
        ),
        e.$list.on(
          'touchcancel.slick mouseleave.slick',
          { action: 'end' },
          e.swipeHandler
        ),
        e.$list.on('click.slick', e.clickHandler),
        i(document).on(e.visibilityChange, i.proxy(e.visibility, e)),
        !0 === e.options.accessibility &&
          e.$list.on('keydown.slick', e.keyHandler),
        !0 === e.options.focusOnSelect &&
          i(e.$slideTrack).children().on('click.slick', e.selectHandler),
        i(window).on(
          'orientationchange.slick.slick-' + e.instanceUid,
          i.proxy(e.orientationChange, e)
        ),
        i(window).on(
          'resize.slick.slick-' + e.instanceUid,
          i.proxy(e.resize, e)
        ),
        i('[draggable!=true]', e.$slideTrack).on('dragstart', e.preventDefault),
        i(window).on('load.slick.slick-' + e.instanceUid, e.setPosition),
        i(e.setPosition);
    }),
    (e.prototype.initUI = function () {
      var i = this;
      !0 === i.options.arrows &&
        i.slideCount > i.options.slidesToShow &&
        (i.$prevArrow.show(), i.$nextArrow.show()),
        !0 === i.options.dots &&
          i.slideCount > i.options.slidesToShow &&
          i.$dots.show();
    }),
    (e.prototype.keyHandler = function (i) {
      var e = this;
      i.target.tagName.match('TEXTAREA|INPUT|SELECT') ||
        (37 === i.keyCode && !0 === e.options.accessibility
          ? e.changeSlide({
              data: { message: !0 === e.options.rtl ? 'next' : 'previous' },
            })
          : 39 === i.keyCode &&
            !0 === e.options.accessibility &&
            e.changeSlide({
              data: { message: !0 === e.options.rtl ? 'previous' : 'next' },
            }));
    }),
    (e.prototype.lazyLoad = function () {
      function e(e) {
        i('img[data-lazy]', e).each(function () {
          var e = i(this),
            t = i(this).attr('data-lazy'),
            o = i(this).attr('data-srcset'),
            s = i(this).attr('data-sizes') || n.$slider.attr('data-sizes'),
            r = document.createElement('img');
          (r.onload = function () {
            e.animate({ opacity: 0 }, 100, function () {
              o && (e.attr('srcset', o), s && e.attr('sizes', s)),
                e.attr('src', t).animate({ opacity: 1 }, 200, function () {
                  e.removeAttr('data-lazy data-srcset data-sizes').removeClass(
                    'slick-loading'
                  );
                }),
                n.$slider.trigger('lazyLoaded', [n, e, t]);
            });
          }),
            (r.onerror = function () {
              e
                .removeAttr('data-lazy')
                .removeClass('slick-loading')
                .addClass('slick-lazyload-error'),
                n.$slider.trigger('lazyLoadError', [n, e, t]);
            }),
            (r.src = t);
        });
      }
      var t,
        o,
        s,
        n = this;
      if (
        (!0 === n.options.centerMode
          ? !0 === n.options.infinite
            ? (s =
                (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) +
                n.options.slidesToShow +
                2)
            : ((o = Math.max(
                0,
                n.currentSlide - (n.options.slidesToShow / 2 + 1)
              )),
              (s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide))
          : ((o = n.options.infinite
              ? n.options.slidesToShow + n.currentSlide
              : n.currentSlide),
            (s = Math.ceil(o + n.options.slidesToShow)),
            !0 === n.options.fade && (o > 0 && o--, s <= n.slideCount && s++)),
        (t = n.$slider.find('.slick-slide').slice(o, s)),
        'anticipated' === n.options.lazyLoad)
      )
        for (
          var r = o - 1, l = s, d = n.$slider.find('.slick-slide'), a = 0;
          a < n.options.slidesToScroll;
          a++
        )
          r < 0 && (r = n.slideCount - 1),
            (t = (t = t.add(d.eq(r))).add(d.eq(l))),
            r--,
            l++;
      e(t),
        n.slideCount <= n.options.slidesToShow
          ? e(n.$slider.find('.slick-slide'))
          : n.currentSlide >= n.slideCount - n.options.slidesToShow
          ? e(n.$slider.find('.slick-cloned').slice(0, n.options.slidesToShow))
          : 0 === n.currentSlide &&
            e(
              n.$slider.find('.slick-cloned').slice(-1 * n.options.slidesToShow)
            );
    }),
    (e.prototype.loadSlider = function () {
      var i = this;
      i.setPosition(),
        i.$slideTrack.css({ opacity: 1 }),
        i.$slider.removeClass('slick-loading'),
        i.initUI(),
        'progressive' === i.options.lazyLoad && i.progressiveLazyLoad();
    }),
    (e.prototype.next = e.prototype.slickNext =
      function () {
        this.changeSlide({ data: { message: 'next' } });
      }),
    (e.prototype.orientationChange = function () {
      var i = this;
      i.checkResponsive(), i.setPosition();
    }),
    (e.prototype.pause = e.prototype.slickPause =
      function () {
        var i = this;
        i.autoPlayClear(), (i.paused = !0);
      }),
    (e.prototype.play = e.prototype.slickPlay =
      function () {
        var i = this;
        i.autoPlay(),
          (i.options.autoplay = !0),
          (i.paused = !1),
          (i.focussed = !1),
          (i.interrupted = !1);
      }),
    (e.prototype.postSlide = function (e) {
      var t = this;
      t.unslicked ||
        (t.$slider.trigger('afterChange', [t, e]),
        (t.animating = !1),
        t.slideCount > t.options.slidesToShow && t.setPosition(),
        (t.swipeLeft = null),
        t.options.autoplay && t.autoPlay(),
        !0 === t.options.accessibility &&
          (t.initADA(),
          t.options.focusOnChange &&
            i(t.$slides.get(t.currentSlide)).attr('tabindex', 0).focus()));
    }),
    (e.prototype.prev = e.prototype.slickPrev =
      function () {
        this.changeSlide({ data: { message: 'previous' } });
      }),
    (e.prototype.preventDefault = function (i) {
      i.preventDefault();
    }),
    (e.prototype.progressiveLazyLoad = function (e) {
      e = e || 1;
      var t,
        o,
        s,
        n,
        r,
        l = this,
        d = i('img[data-lazy]', l.$slider);
      d.length
        ? ((t = d.first()),
          (o = t.attr('data-lazy')),
          (s = t.attr('data-srcset')),
          (n = t.attr('data-sizes') || l.$slider.attr('data-sizes')),
          ((r = document.createElement('img')).onload = function () {
            s && (t.attr('srcset', s), n && t.attr('sizes', n)),
              t
                .attr('src', o)
                .removeAttr('data-lazy data-srcset data-sizes')
                .removeClass('slick-loading'),
              !0 === l.options.adaptiveHeight && l.setPosition(),
              l.$slider.trigger('lazyLoaded', [l, t, o]),
              l.progressiveLazyLoad();
          }),
          (r.onerror = function () {
            e < 3
              ? setTimeout(function () {
                  l.progressiveLazyLoad(e + 1);
                }, 500)
              : (t
                  .removeAttr('data-lazy')
                  .removeClass('slick-loading')
                  .addClass('slick-lazyload-error'),
                l.$slider.trigger('lazyLoadError', [l, t, o]),
                l.progressiveLazyLoad());
          }),
          (r.src = o))
        : l.$slider.trigger('allImagesLoaded', [l]);
    }),
    (e.prototype.refresh = function (e) {
      var t,
        o,
        s = this;
      (o = s.slideCount - s.options.slidesToShow),
        !s.options.infinite && s.currentSlide > o && (s.currentSlide = o),
        s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0),
        (t = s.currentSlide),
        s.destroy(!0),
        i.extend(s, s.initials, { currentSlide: t }),
        s.init(),
        e || s.changeSlide({ data: { message: 'index', index: t } }, !1);
    }),
    (e.prototype.registerBreakpoints = function () {
      var e,
        t,
        o,
        s = this,
        n = s.options.responsive || null;
      if ('array' === i.type(n) && n.length) {
        s.respondTo = s.options.respondTo || 'window';
        for (e in n)
          if (((o = s.breakpoints.length - 1), n.hasOwnProperty(e))) {
            for (t = n[e].breakpoint; o >= 0; )
              s.breakpoints[o] &&
                s.breakpoints[o] === t &&
                s.breakpoints.splice(o, 1),
                o--;
            s.breakpoints.push(t), (s.breakpointSettings[t] = n[e].settings);
          }
        s.breakpoints.sort(function (i, e) {
          return s.options.mobileFirst ? i - e : e - i;
        });
      }
    }),
    (e.prototype.reinit = function () {
      var e = this;
      (e.$slides = e.$slideTrack
        .children(e.options.slide)
        .addClass('slick-slide')),
        (e.slideCount = e.$slides.length),
        e.currentSlide >= e.slideCount &&
          0 !== e.currentSlide &&
          (e.currentSlide = e.currentSlide - e.options.slidesToScroll),
        e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0),
        e.registerBreakpoints(),
        e.setProps(),
        e.setupInfinite(),
        e.buildArrows(),
        e.updateArrows(),
        e.initArrowEvents(),
        e.buildDots(),
        e.updateDots(),
        e.initDotEvents(),
        e.cleanUpSlideEvents(),
        e.initSlideEvents(),
        e.checkResponsive(!1, !0),
        !0 === e.options.focusOnSelect &&
          i(e.$slideTrack).children().on('click.slick', e.selectHandler),
        e.setSlideClasses(
          'number' == typeof e.currentSlide ? e.currentSlide : 0
        ),
        e.setPosition(),
        e.focusHandler(),
        (e.paused = !e.options.autoplay),
        e.autoPlay(),
        e.$slider.trigger('reInit', [e]);
    }),
    (e.prototype.resize = function () {
      var e = this;
      i(window).width() !== e.windowWidth &&
        (clearTimeout(e.windowDelay),
        (e.windowDelay = window.setTimeout(function () {
          (e.windowWidth = i(window).width()),
            e.checkResponsive(),
            e.unslicked || e.setPosition();
        }, 50)));
    }),
    (e.prototype.removeSlide = e.prototype.slickRemove =
      function (i, e, t) {
        var o = this;
        if (
          ((i =
            'boolean' == typeof i
              ? !0 === (e = i)
                ? 0
                : o.slideCount - 1
              : !0 === e
              ? --i
              : i),
          o.slideCount < 1 || i < 0 || i > o.slideCount - 1)
        )
          return !1;
        o.unload(),
          !0 === t
            ? o.$slideTrack.children().remove()
            : o.$slideTrack.children(this.options.slide).eq(i).remove(),
          (o.$slides = o.$slideTrack.children(this.options.slide)),
          o.$slideTrack.children(this.options.slide).detach(),
          o.$slideTrack.append(o.$slides),
          (o.$slidesCache = o.$slides),
          o.reinit();
      }),
    (e.prototype.setCSS = function (i) {
      var e,
        t,
        o = this,
        s = {};
      !0 === o.options.rtl && (i = -i),
        (e = 'left' == o.positionProp ? Math.ceil(i) + 'px' : '0px'),
        (t = 'top' == o.positionProp ? Math.ceil(i) + 'px' : '0px'),
        (s[o.positionProp] = i),
        !1 === o.transformsEnabled
          ? o.$slideTrack.css(s)
          : ((s = {}),
            !1 === o.cssTransitions
              ? ((s[o.animType] = 'translate(' + e + ', ' + t + ')'),
                o.$slideTrack.css(s))
              : ((s[o.animType] = 'translate3d(' + e + ', ' + t + ', 0px)'),
                o.$slideTrack.css(s)));
    }),
    (e.prototype.setDimensions = function () {
      var i = this;
      !1 === i.options.vertical
        ? !0 === i.options.centerMode &&
          i.$list.css({ padding: '0px ' + i.options.centerPadding })
        : (i.$list.height(
            i.$slides.first().outerHeight(!0) * i.options.slidesToShow
          ),
          !0 === i.options.centerMode &&
            i.$list.css({ padding: i.options.centerPadding + ' 0px' })),
        (i.listWidth = i.$list.width()),
        (i.listHeight = i.$list.height()),
        !1 === i.options.vertical && !1 === i.options.variableWidth
          ? ((i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow)),
            i.$slideTrack.width(
              Math.ceil(
                i.slideWidth * i.$slideTrack.children('.slick-slide').length
              )
            ))
          : !0 === i.options.variableWidth
          ? i.$slideTrack.width(5e3 * i.slideCount)
          : ((i.slideWidth = Math.ceil(i.listWidth)),
            i.$slideTrack.height(
              Math.ceil(
                i.$slides.first().outerHeight(!0) *
                  i.$slideTrack.children('.slick-slide').length
              )
            ));
      var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
      !1 === i.options.variableWidth &&
        i.$slideTrack.children('.slick-slide').width(i.slideWidth - e);
    }),
    (e.prototype.setFade = function () {
      var e,
        t = this;
      t.$slides.each(function (o, s) {
        (e = t.slideWidth * o * -1),
          !0 === t.options.rtl
            ? i(s).css({
                position: 'relative',
                right: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0,
              })
            : i(s).css({
                position: 'relative',
                left: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0,
              });
      }),
        t.$slides
          .eq(t.currentSlide)
          .css({ zIndex: t.options.zIndex - 1, opacity: 1 });
    }),
    (e.prototype.setHeight = function () {
      var i = this;
      if (
        1 === i.options.slidesToShow &&
        !0 === i.options.adaptiveHeight &&
        !1 === i.options.vertical
      ) {
        var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
        i.$list.css('height', e);
      }
    }),
    (e.prototype.setOption = e.prototype.slickSetOption =
      function () {
        var e,
          t,
          o,
          s,
          n,
          r = this,
          l = !1;
        if (
          ('object' === i.type(arguments[0])
            ? ((o = arguments[0]), (l = arguments[1]), (n = 'multiple'))
            : 'string' === i.type(arguments[0]) &&
              ((o = arguments[0]),
              (s = arguments[1]),
              (l = arguments[2]),
              'responsive' === arguments[0] && 'array' === i.type(arguments[1])
                ? (n = 'responsive')
                : void 0 !== arguments[1] && (n = 'single')),
          'single' === n)
        )
          r.options[o] = s;
        else if ('multiple' === n)
          i.each(o, function (i, e) {
            r.options[i] = e;
          });
        else if ('responsive' === n)
          for (t in s)
            if ('array' !== i.type(r.options.responsive))
              r.options.responsive = [s[t]];
            else {
              for (e = r.options.responsive.length - 1; e >= 0; )
                r.options.responsive[e].breakpoint === s[t].breakpoint &&
                  r.options.responsive.splice(e, 1),
                  e--;
              r.options.responsive.push(s[t]);
            }
        l && (r.unload(), r.reinit());
      }),
    (e.prototype.setPosition = function () {
      var i = this;
      i.setDimensions(),
        i.setHeight(),
        !1 === i.options.fade
          ? i.setCSS(i.getLeft(i.currentSlide))
          : i.setFade(),
        i.$slider.trigger('setPosition', [i]);
    }),
    (e.prototype.setProps = function () {
      var i = this,
        e = document.body.style;
      (i.positionProp = !0 === i.options.vertical ? 'top' : 'left'),
        'top' === i.positionProp
          ? i.$slider.addClass('slick-vertical')
          : i.$slider.removeClass('slick-vertical'),
        (void 0 === e.WebkitTransition &&
          void 0 === e.MozTransition &&
          void 0 === e.msTransition) ||
          (!0 === i.options.useCSS && (i.cssTransitions = !0)),
        i.options.fade &&
          ('number' == typeof i.options.zIndex
            ? i.options.zIndex < 3 && (i.options.zIndex = 3)
            : (i.options.zIndex = i.defaults.zIndex)),
        void 0 !== e.OTransform &&
          ((i.animType = 'OTransform'),
          (i.transformType = '-o-transform'),
          (i.transitionType = 'OTransition'),
          void 0 === e.perspectiveProperty &&
            void 0 === e.webkitPerspective &&
            (i.animType = !1)),
        void 0 !== e.MozTransform &&
          ((i.animType = 'MozTransform'),
          (i.transformType = '-moz-transform'),
          (i.transitionType = 'MozTransition'),
          void 0 === e.perspectiveProperty &&
            void 0 === e.MozPerspective &&
            (i.animType = !1)),
        void 0 !== e.webkitTransform &&
          ((i.animType = 'webkitTransform'),
          (i.transformType = '-webkit-transform'),
          (i.transitionType = 'webkitTransition'),
          void 0 === e.perspectiveProperty &&
            void 0 === e.webkitPerspective &&
            (i.animType = !1)),
        void 0 !== e.msTransform &&
          ((i.animType = 'msTransform'),
          (i.transformType = '-ms-transform'),
          (i.transitionType = 'msTransition'),
          void 0 === e.msTransform && (i.animType = !1)),
        void 0 !== e.transform &&
          !1 !== i.animType &&
          ((i.animType = 'transform'),
          (i.transformType = 'transform'),
          (i.transitionType = 'transition')),
        (i.transformsEnabled =
          i.options.useTransform && null !== i.animType && !1 !== i.animType);
    }),
    (e.prototype.setSlideClasses = function (i) {
      var e,
        t,
        o,
        s,
        n = this;
      if (
        ((t = n.$slider
          .find('.slick-slide')
          .removeClass('slick-active slick-center slick-current')
          .attr('aria-hidden', 'true')),
        n.$slides.eq(i).addClass('slick-current'),
        !0 === n.options.centerMode)
      ) {
        var r = n.options.slidesToShow % 2 == 0 ? 1 : 0;
        (e = Math.floor(n.options.slidesToShow / 2)),
          !0 === n.options.infinite &&
            (i >= e && i <= n.slideCount - 1 - e
              ? n.$slides
                  .slice(i - e + r, i + e + 1)
                  .addClass('slick-active')
                  .attr('aria-hidden', 'false')
              : ((o = n.options.slidesToShow + i),
                t
                  .slice(o - e + 1 + r, o + e + 2)
                  .addClass('slick-active')
                  .attr('aria-hidden', 'false')),
            0 === i
              ? t
                  .eq(t.length - 1 - n.options.slidesToShow)
                  .addClass('slick-center')
              : i === n.slideCount - 1 &&
                t.eq(n.options.slidesToShow).addClass('slick-center')),
          n.$slides.eq(i).addClass('slick-center');
      } else
        i >= 0 && i <= n.slideCount - n.options.slidesToShow
          ? n.$slides
              .slice(i, i + n.options.slidesToShow)
              .addClass('slick-active')
              .attr('aria-hidden', 'false')
          : t.length <= n.options.slidesToShow
          ? t.addClass('slick-active').attr('aria-hidden', 'false')
          : ((s = n.slideCount % n.options.slidesToShow),
            (o = !0 === n.options.infinite ? n.options.slidesToShow + i : i),
            n.options.slidesToShow == n.options.slidesToScroll &&
            n.slideCount - i < n.options.slidesToShow
              ? t
                  .slice(o - (n.options.slidesToShow - s), o + s)
                  .addClass('slick-active')
                  .attr('aria-hidden', 'false')
              : t
                  .slice(o, o + n.options.slidesToShow)
                  .addClass('slick-active')
                  .attr('aria-hidden', 'false'));
      ('ondemand' !== n.options.lazyLoad &&
        'anticipated' !== n.options.lazyLoad) ||
        n.lazyLoad();
    }),
    (e.prototype.setupInfinite = function () {
      var e,
        t,
        o,
        s = this;
      if (
        (!0 === s.options.fade && (s.options.centerMode = !1),
        !0 === s.options.infinite &&
          !1 === s.options.fade &&
          ((t = null), s.slideCount > s.options.slidesToShow))
      ) {
        for (
          o =
            !0 === s.options.centerMode
              ? s.options.slidesToShow + 1
              : s.options.slidesToShow,
            e = s.slideCount;
          e > s.slideCount - o;
          e -= 1
        )
          (t = e - 1),
            i(s.$slides[t])
              .clone(!0)
              .attr('id', '')
              .attr('data-slick-index', t - s.slideCount)
              .prependTo(s.$slideTrack)
              .addClass('slick-cloned');
        for (e = 0; e < o + s.slideCount; e += 1)
          (t = e),
            i(s.$slides[t])
              .clone(!0)
              .attr('id', '')
              .attr('data-slick-index', t + s.slideCount)
              .appendTo(s.$slideTrack)
              .addClass('slick-cloned');
        s.$slideTrack
          .find('.slick-cloned')
          .find('[id]')
          .each(function () {
            i(this).attr('id', '');
          });
      }
    }),
    (e.prototype.interrupt = function (i) {
      var e = this;
      i || e.autoPlay(), (e.interrupted = i);
    }),
    (e.prototype.selectHandler = function (e) {
      var t = this,
        o = i(e.target).is('.slick-slide')
          ? i(e.target)
          : i(e.target).parents('.slick-slide'),
        s = parseInt(o.attr('data-slick-index'));
      s || (s = 0),
        t.slideCount <= t.options.slidesToShow
          ? t.slideHandler(s, !1, !0)
          : t.slideHandler(s);
    }),
    (e.prototype.slideHandler = function (i, e, t) {
      var o,
        s,
        n,
        r,
        l,
        d = null,
        a = this;
      if (
        ((e = e || !1),
        !(
          (!0 === a.animating && !0 === a.options.waitForAnimate) ||
          (!0 === a.options.fade && a.currentSlide === i)
        ))
      )
        if (
          (!1 === e && a.asNavFor(i),
          (o = i),
          (d = a.getLeft(o)),
          (r = a.getLeft(a.currentSlide)),
          (a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft),
          !1 === a.options.infinite &&
            !1 === a.options.centerMode &&
            (i < 0 || i > a.getDotCount() * a.options.slidesToScroll))
        )
          !1 === a.options.fade &&
            ((o = a.currentSlide),
            !0 !== t
              ? a.animateSlide(r, function () {
                  a.postSlide(o);
                })
              : a.postSlide(o));
        else if (
          !1 === a.options.infinite &&
          !0 === a.options.centerMode &&
          (i < 0 || i > a.slideCount - a.options.slidesToScroll)
        )
          !1 === a.options.fade &&
            ((o = a.currentSlide),
            !0 !== t
              ? a.animateSlide(r, function () {
                  a.postSlide(o);
                })
              : a.postSlide(o));
        else {
          if (
            (a.options.autoplay && clearInterval(a.autoPlayTimer),
            (s =
              o < 0
                ? a.slideCount % a.options.slidesToScroll != 0
                  ? a.slideCount - (a.slideCount % a.options.slidesToScroll)
                  : a.slideCount + o
                : o >= a.slideCount
                ? a.slideCount % a.options.slidesToScroll != 0
                  ? 0
                  : o - a.slideCount
                : o),
            (a.animating = !0),
            a.$slider.trigger('beforeChange', [a, a.currentSlide, s]),
            (n = a.currentSlide),
            (a.currentSlide = s),
            a.setSlideClasses(a.currentSlide),
            a.options.asNavFor &&
              (l = (l = a.getNavTarget()).slick('getSlick')).slideCount <=
                l.options.slidesToShow &&
              l.setSlideClasses(a.currentSlide),
            a.updateDots(),
            a.updateArrows(),
            !0 === a.options.fade)
          )
            return (
              !0 !== t
                ? (a.fadeSlideOut(n),
                  a.fadeSlide(s, function () {
                    a.postSlide(s);
                  }))
                : a.postSlide(s),
              void a.animateHeight()
            );
          !0 !== t
            ? a.animateSlide(d, function () {
                a.postSlide(s);
              })
            : a.postSlide(s);
        }
    }),
    (e.prototype.startLoad = function () {
      var i = this;
      !0 === i.options.arrows &&
        i.slideCount > i.options.slidesToShow &&
        (i.$prevArrow.hide(), i.$nextArrow.hide()),
        !0 === i.options.dots &&
          i.slideCount > i.options.slidesToShow &&
          i.$dots.hide(),
        i.$slider.addClass('slick-loading');
    }),
    (e.prototype.swipeDirection = function () {
      var i,
        e,
        t,
        o,
        s = this;
      return (
        (i = s.touchObject.startX - s.touchObject.curX),
        (e = s.touchObject.startY - s.touchObject.curY),
        (t = Math.atan2(e, i)),
        (o = Math.round((180 * t) / Math.PI)) < 0 && (o = 360 - Math.abs(o)),
        o <= 45 && o >= 0
          ? !1 === s.options.rtl
            ? 'left'
            : 'right'
          : o <= 360 && o >= 315
          ? !1 === s.options.rtl
            ? 'left'
            : 'right'
          : o >= 135 && o <= 225
          ? !1 === s.options.rtl
            ? 'right'
            : 'left'
          : !0 === s.options.verticalSwiping
          ? o >= 35 && o <= 135
            ? 'down'
            : 'up'
          : 'vertical'
      );
    }),
    (e.prototype.swipeEnd = function (i) {
      var e,
        t,
        o = this;
      if (((o.dragging = !1), (o.swiping = !1), o.scrolling))
        return (o.scrolling = !1), !1;
      if (
        ((o.interrupted = !1),
        (o.shouldClick = !(o.touchObject.swipeLength > 10)),
        void 0 === o.touchObject.curX)
      )
        return !1;
      if (
        (!0 === o.touchObject.edgeHit &&
          o.$slider.trigger('edge', [o, o.swipeDirection()]),
        o.touchObject.swipeLength >= o.touchObject.minSwipe)
      ) {
        switch ((t = o.swipeDirection())) {
          case 'left':
          case 'down':
            (e = o.options.swipeToSlide
              ? o.checkNavigable(o.currentSlide + o.getSlideCount())
              : o.currentSlide + o.getSlideCount()),
              (o.currentDirection = 0);
            break;
          case 'right':
          case 'up':
            (e = o.options.swipeToSlide
              ? o.checkNavigable(o.currentSlide - o.getSlideCount())
              : o.currentSlide - o.getSlideCount()),
              (o.currentDirection = 1);
        }
        'vertical' != t &&
          (o.slideHandler(e),
          (o.touchObject = {}),
          o.$slider.trigger('swipe', [o, t]));
      } else
        o.touchObject.startX !== o.touchObject.curX &&
          (o.slideHandler(o.currentSlide), (o.touchObject = {}));
    }),
    (e.prototype.swipeHandler = function (i) {
      var e = this;
      if (
        !(
          !1 === e.options.swipe ||
          ('ontouchend' in document && !1 === e.options.swipe) ||
          (!1 === e.options.draggable && -1 !== i.type.indexOf('mouse'))
        )
      )
        switch (
          ((e.touchObject.fingerCount =
            i.originalEvent && void 0 !== i.originalEvent.touches
              ? i.originalEvent.touches.length
              : 1),
          (e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold),
          !0 === e.options.verticalSwiping &&
            (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold),
          i.data.action)
        ) {
          case 'start':
            e.swipeStart(i);
            break;
          case 'move':
            e.swipeMove(i);
            break;
          case 'end':
            e.swipeEnd(i);
        }
    }),
    (e.prototype.swipeMove = function (i) {
      var e,
        t,
        o,
        s,
        n,
        r,
        l = this;
      return (
        (n = void 0 !== i.originalEvent ? i.originalEvent.touches : null),
        !(!l.dragging || l.scrolling || (n && 1 !== n.length)) &&
          ((e = l.getLeft(l.currentSlide)),
          (l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX),
          (l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY),
          (l.touchObject.swipeLength = Math.round(
            Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))
          )),
          (r = Math.round(
            Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))
          )),
          !l.options.verticalSwiping && !l.swiping && r > 4
            ? ((l.scrolling = !0), !1)
            : (!0 === l.options.verticalSwiping &&
                (l.touchObject.swipeLength = r),
              (t = l.swipeDirection()),
              void 0 !== i.originalEvent &&
                l.touchObject.swipeLength > 4 &&
                ((l.swiping = !0), i.preventDefault()),
              (s =
                (!1 === l.options.rtl ? 1 : -1) *
                (l.touchObject.curX > l.touchObject.startX ? 1 : -1)),
              !0 === l.options.verticalSwiping &&
                (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1),
              (o = l.touchObject.swipeLength),
              (l.touchObject.edgeHit = !1),
              !1 === l.options.infinite &&
                ((0 === l.currentSlide && 'right' === t) ||
                  (l.currentSlide >= l.getDotCount() && 'left' === t)) &&
                ((o = l.touchObject.swipeLength * l.options.edgeFriction),
                (l.touchObject.edgeHit = !0)),
              !1 === l.options.vertical
                ? (l.swipeLeft = e + o * s)
                : (l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s),
              !0 === l.options.verticalSwiping && (l.swipeLeft = e + o * s),
              !0 !== l.options.fade &&
                !1 !== l.options.touchMove &&
                (!0 === l.animating
                  ? ((l.swipeLeft = null), !1)
                  : void l.setCSS(l.swipeLeft))))
      );
    }),
    (e.prototype.swipeStart = function (i) {
      var e,
        t = this;
      if (
        ((t.interrupted = !0),
        1 !== t.touchObject.fingerCount ||
          t.slideCount <= t.options.slidesToShow)
      )
        return (t.touchObject = {}), !1;
      void 0 !== i.originalEvent &&
        void 0 !== i.originalEvent.touches &&
        (e = i.originalEvent.touches[0]),
        (t.touchObject.startX = t.touchObject.curX =
          void 0 !== e ? e.pageX : i.clientX),
        (t.touchObject.startY = t.touchObject.curY =
          void 0 !== e ? e.pageY : i.clientY),
        (t.dragging = !0);
    }),
    (e.prototype.unfilterSlides = e.prototype.slickUnfilter =
      function () {
        var i = this;
        null !== i.$slidesCache &&
          (i.unload(),
          i.$slideTrack.children(this.options.slide).detach(),
          i.$slidesCache.appendTo(i.$slideTrack),
          i.reinit());
      }),
    (e.prototype.unload = function () {
      var e = this;
      i('.slick-cloned', e.$slider).remove(),
        e.$dots && e.$dots.remove(),
        e.$prevArrow &&
          e.htmlExpr.test(e.options.prevArrow) &&
          e.$prevArrow.remove(),
        e.$nextArrow &&
          e.htmlExpr.test(e.options.nextArrow) &&
          e.$nextArrow.remove(),
        e.$slides
          .removeClass('slick-slide slick-active slick-visible slick-current')
          .attr('aria-hidden', 'true')
          .css('width', '');
    }),
    (e.prototype.unslick = function (i) {
      var e = this;
      e.$slider.trigger('unslick', [e, i]), e.destroy();
    }),
    (e.prototype.updateArrows = function () {
      var i = this;
      Math.floor(i.options.slidesToShow / 2),
        !0 === i.options.arrows &&
          i.slideCount > i.options.slidesToShow &&
          !i.options.infinite &&
          (i.$prevArrow
            .removeClass('slick-disabled')
            .attr('aria-disabled', 'false'),
          i.$nextArrow
            .removeClass('slick-disabled')
            .attr('aria-disabled', 'false'),
          0 === i.currentSlide
            ? (i.$prevArrow
                .addClass('slick-disabled')
                .attr('aria-disabled', 'true'),
              i.$nextArrow
                .removeClass('slick-disabled')
                .attr('aria-disabled', 'false'))
            : i.currentSlide >= i.slideCount - i.options.slidesToShow &&
              !1 === i.options.centerMode
            ? (i.$nextArrow
                .addClass('slick-disabled')
                .attr('aria-disabled', 'true'),
              i.$prevArrow
                .removeClass('slick-disabled')
                .attr('aria-disabled', 'false'))
            : i.currentSlide >= i.slideCount - 1 &&
              !0 === i.options.centerMode &&
              (i.$nextArrow
                .addClass('slick-disabled')
                .attr('aria-disabled', 'true'),
              i.$prevArrow
                .removeClass('slick-disabled')
                .attr('aria-disabled', 'false')));
    }),
    (e.prototype.updateDots = function () {
      var i = this;
      null !== i.$dots &&
        (i.$dots.find('li').removeClass('slick-active').end(),
        i.$dots
          .find('li')
          .eq(Math.floor(i.currentSlide / i.options.slidesToScroll))
          .addClass('slick-active'));
    }),
    (e.prototype.visibility = function () {
      var i = this;
      i.options.autoplay &&
        (document[i.hidden] ? (i.interrupted = !0) : (i.interrupted = !1));
    }),
    (i.fn.slick = function () {
      var i,
        t,
        o = this,
        s = arguments[0],
        n = Array.prototype.slice.call(arguments, 1),
        r = o.length;
      for (i = 0; i < r; i++)
        if (
          ('object' == typeof s || void 0 === s
            ? (o[i].slick = new e(o[i], s))
            : (t = o[i].slick[s].apply(o[i].slick, n)),
          void 0 !== t)
        )
          return t;
      return o;
    });
});

!(function (e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define(t)
    : (e.Sweetalert2 = t());
})(this, function () {
  'use strict';
  function q(e) {
    return (q =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              'function' == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? 'symbol'
              : typeof e;
          })(e);
  }
  function s(e, t) {
    if (!(e instanceof t))
      throw new TypeError('Cannot call a class as a function');
  }
  function o(e, t) {
    for (var n = 0; n < t.length; n++) {
      var o = t[n];
      (o.enumerable = o.enumerable || !1),
        (o.configurable = !0),
        'value' in o && (o.writable = !0),
        Object.defineProperty(e, o.key, o);
    }
  }
  function i(e, t, n) {
    return t && o(e.prototype, t), n && o(e, n), e;
  }
  function r() {
    return (r =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var o in n)
            Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
        }
        return e;
      }).apply(this, arguments);
  }
  function a(e, t) {
    if ('function' != typeof t && null !== t)
      throw new TypeError('Super expression must either be null or a function');
    (e.prototype = Object.create(t && t.prototype, {
      constructor: { value: e, writable: !0, configurable: !0 },
    })),
      t && u(e, t);
  }
  function c(e) {
    return (c = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function (e) {
          return e.__proto__ || Object.getPrototypeOf(e);
        })(e);
  }
  function u(e, t) {
    return (u =
      Object.setPrototypeOf ||
      function (e, t) {
        return (e.__proto__ = t), e;
      })(e, t);
  }
  function l(e, t, n) {
    return (l = (function () {
      if ('undefined' == typeof Reflect || !Reflect.construct) return !1;
      if (Reflect.construct.sham) return !1;
      if ('function' == typeof Proxy) return !0;
      try {
        return (
          Date.prototype.toString.call(
            Reflect.construct(Date, [], function () {})
          ),
          !0
        );
      } catch (e) {
        return !1;
      }
    })()
      ? Reflect.construct
      : function (e, t, n) {
          var o = [null];
          o.push.apply(o, t);
          var i = new (Function.bind.apply(e, o))();
          return n && u(i, n.prototype), i;
        }).apply(null, arguments);
  }
  function d(e, t) {
    return !t || ('object' != typeof t && 'function' != typeof t)
      ? (function (e) {
          if (void 0 === e)
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          return e;
        })(e)
      : t;
  }
  function p(e, t, n) {
    return (p =
      'undefined' != typeof Reflect && Reflect.get
        ? Reflect.get
        : function (e, t, n) {
            var o = (function (e, t) {
              for (
                ;
                !Object.prototype.hasOwnProperty.call(e, t) &&
                null !== (e = c(e));

              );
              return e;
            })(e, t);
            if (o) {
              var i = Object.getOwnPropertyDescriptor(o, t);
              return i.get ? i.get.call(n) : i.value;
            }
          })(e, t, n || e);
  }
  var t = 'SweetAlert2:',
    f = function (e) {
      return Array.prototype.slice.call(e);
    },
    R = function (e) {
      console.warn(''.concat(t, ' ').concat(e));
    },
    I = function (e) {
      console.error(''.concat(t, ' ').concat(e));
    },
    n = [],
    m = function (e) {
      -1 === n.indexOf(e) && (n.push(e), R(e));
    },
    H = function (e) {
      return 'function' == typeof e ? e() : e;
    },
    D = function (e) {
      return e && 'object' === q(e) && 'function' == typeof e.then;
    },
    e = Object.freeze({
      cancel: 'cancel',
      backdrop: 'overlay',
      close: 'close',
      esc: 'esc',
      timer: 'timer',
    }),
    h = function (e) {
      var t = {};
      for (var n in e) t[e[n]] = 'swal2-' + e[n];
      return t;
    },
    _ = h([
      'container',
      'shown',
      'height-auto',
      'iosfix',
      'popup',
      'modal',
      'no-backdrop',
      'toast',
      'toast-shown',
      'toast-column',
      'fade',
      'show',
      'hide',
      'noanimation',
      'close',
      'title',
      'header',
      'content',
      'actions',
      'confirm',
      'cancel',
      'footer',
      'icon',
      'icon-text',
      'image',
      'input',
      'file',
      'range',
      'select',
      'radio',
      'checkbox',
      'label',
      'textarea',
      'inputerror',
      'validation-message',
      'progresssteps',
      'activeprogressstep',
      'progresscircle',
      'progressline',
      'loading',
      'styled',
      'top',
      'top-start',
      'top-end',
      'top-left',
      'top-right',
      'center',
      'center-start',
      'center-end',
      'center-left',
      'center-right',
      'bottom',
      'bottom-start',
      'bottom-end',
      'bottom-left',
      'bottom-right',
      'grow-row',
      'grow-column',
      'grow-fullscreen',
      'rtl',
    ]),
    g = h(['success', 'warning', 'info', 'question', 'error']),
    b = { previousBodyPadding: null },
    v = function (e, t) {
      return e.classList.contains(t);
    },
    N = function (e) {
      if ((e.focus(), 'file' !== e.type)) {
        var t = e.value;
        (e.value = ''), (e.value = t);
      }
    },
    y = function (e, t, n) {
      e &&
        t &&
        ('string' == typeof t && (t = t.split(/\s+/).filter(Boolean)),
        t.forEach(function (t) {
          e.forEach
            ? e.forEach(function (e) {
                n ? e.classList.add(t) : e.classList.remove(t);
              })
            : n
            ? e.classList.add(t)
            : e.classList.remove(t);
        }));
    },
    z = function (e, t) {
      y(e, t, !0);
    },
    W = function (e, t) {
      y(e, t, !1);
    },
    U = function (e, t) {
      for (var n = 0; n < e.childNodes.length; n++)
        if (v(e.childNodes[n], t)) return e.childNodes[n];
    },
    K = function (e) {
      (e.style.opacity = ''),
        (e.style.display = e.id === _.content ? 'block' : 'flex');
    },
    F = function (e) {
      (e.style.opacity = ''), (e.style.display = 'none');
    },
    Z = function (e) {
      return (
        e && (e.offsetWidth || e.offsetHeight || e.getClientRects().length)
      );
    },
    w = function () {
      return document.body.querySelector('.' + _.container);
    },
    C = function (e) {
      var t = w();
      return t ? t.querySelector('.' + e) : null;
    },
    k = function () {
      return C(_.popup);
    },
    x = function () {
      var e = k();
      return f(e.querySelectorAll('.' + _.icon));
    },
    A = function () {
      return C(_.title);
    },
    B = function () {
      return C(_.content);
    },
    S = function () {
      return C(_.image);
    },
    P = function () {
      return C(_.progresssteps);
    },
    O = function () {
      return C(_['validation-message']);
    },
    E = function () {
      return C(_.confirm);
    },
    L = function () {
      return C(_.cancel);
    },
    Q = function () {
      return C(_.actions);
    },
    Y = function () {
      return C(_.footer);
    },
    $ = function () {
      return C(_.close);
    },
    J = function () {
      var e = f(
          k().querySelectorAll(
            '[tabindex]:not([tabindex="-1"]):not([tabindex="0"])'
          )
        ).sort(function (e, t) {
          return (
            (e = parseInt(e.getAttribute('tabindex'))),
            (t = parseInt(t.getAttribute('tabindex'))) < e ? 1 : e < t ? -1 : 0
          );
        }),
        t = f(
          k().querySelectorAll(
            'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable], audio[controls], video[controls]'
          )
        ).filter(function (e) {
          return '-1' !== e.getAttribute('tabindex');
        });
      return (function (e) {
        for (var t = [], n = 0; n < e.length; n++)
          -1 === t.indexOf(e[n]) && t.push(e[n]);
        return t;
      })(e.concat(t)).filter(function (e) {
        return Z(e);
      });
    },
    T = function () {
      return !M() && !document.body.classList.contains(_['no-backdrop']);
    },
    M = function () {
      return document.body.classList.contains(_['toast-shown']);
    },
    j = function () {
      return 'undefined' == typeof window || 'undefined' == typeof document;
    },
    V = '\n <div aria-labelledby="'
      .concat(_.title, '" aria-describedby="')
      .concat(_.content, '" class="')
      .concat(_.popup, '" tabindex="-1">\n   <div class="')
      .concat(_.header, '">\n     <ul class="')
      .concat(_.progresssteps, '"></ul>\n     <div class="')
      .concat(_.icon, ' ')
      .concat(
        g.error,
        '">\n       <span class="swal2-x-mark"><span class="swal2-x-mark-line-left"></span><span class="swal2-x-mark-line-right"></span></span>\n     </div>\n     <div class="'
      )
      .concat(_.icon, ' ')
      .concat(g.question, '">\n       <span class="')
      .concat(_['icon-text'], '">?</span>\n      </div>\n     <div class="')
      .concat(_.icon, ' ')
      .concat(g.warning, '">\n       <span class="')
      .concat(_['icon-text'], '">!</span>\n      </div>\n     <div class="')
      .concat(_.icon, ' ')
      .concat(g.info, '">\n       <span class="')
      .concat(_['icon-text'], '">i</span>\n      </div>\n     <div class="')
      .concat(_.icon, ' ')
      .concat(
        g.success,
        '">\n       <div class="swal2-success-circular-line-left"></div>\n       <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>\n       <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>\n       <div class="swal2-success-circular-line-right"></div>\n     </div>\n     <img class="'
      )
      .concat(_.image, '" />\n     <h2 class="')
      .concat(_.title, '" id="')
      .concat(_.title, '"></h2>\n     <button type="button" class="')
      .concat(
        _.close,
        '">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬ ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬ ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â</button>\n   </div>\n   <div class="'
      )
      .concat(_.content, '">\n     <div id="')
      .concat(_.content, '"></div>\n     <input class="')
      .concat(_.input, '" />\n     <input type="file" class="')
      .concat(_.file, '" />\n     <div class="')
      .concat(
        _.range,
        '">\n       <input type="range" />\n       <output></output>\n     </div>\n     <select class="'
      )
      .concat(_.select, '"></select>\n     <div class="')
      .concat(_.radio, '"></div>\n     <label for="')
      .concat(_.checkbox, '" class="')
      .concat(
        _.checkbox,
        '">\n       <input type="checkbox" />\n       <span class="'
      )
      .concat(_.label, '"></span>\n     </label>\n     <textarea class="')
      .concat(_.textarea, '"></textarea>\n     <div class="')
      .concat(_['validation-message'], '" id="')
      .concat(_['validation-message'], '"></div>\n   </div>\n   <div class="')
      .concat(_.actions, '">\n     <button type="button" class="')
      .concat(_.confirm, '">OK</button>\n     <button type="button" class="')
      .concat(_.cancel, '">Cancel</button>\n   </div>\n   <div class="')
      .concat(_.footer, '">\n   </div>\n </div>\n')
      .replace(/(^|\n)\s*/g, ''),
    X = function (e) {
      var t = w();
      if (
        (t &&
          (t.parentNode.removeChild(t),
          W(
            [document.documentElement, document.body],
            [_['no-backdrop'], _['toast-shown'], _['has-column']]
          )),
        !j())
      ) {
        var n = document.createElement('div');
        (n.className = _.container), (n.innerHTML = V);
        var o =
          'string' == typeof e.target
            ? document.querySelector(e.target)
            : e.target;
        o.appendChild(n);
        var i,
          r = k(),
          a = B(),
          s = U(a, _.input),
          c = U(a, _.file),
          u = a.querySelector('.'.concat(_.range, ' input')),
          l = a.querySelector('.'.concat(_.range, ' output')),
          d = U(a, _.select),
          p = a.querySelector('.'.concat(_.checkbox, ' input')),
          f = U(a, _.textarea);
        r.setAttribute('role', e.toast ? 'alert' : 'dialog'),
          r.setAttribute('aria-live', e.toast ? 'polite' : 'assertive'),
          e.toast || r.setAttribute('aria-modal', 'true'),
          'rtl' === window.getComputedStyle(o).direction && z(w(), _.rtl);
        var m = function (e) {
          De.isVisible() && i !== e.target.value && De.resetValidationMessage(),
            (i = e.target.value);
        };
        return (
          (s.oninput = m),
          (c.onchange = m),
          (d.onchange = m),
          (p.onchange = m),
          (f.oninput = m),
          (u.oninput = function (e) {
            m(e), (l.value = u.value);
          }),
          (u.onchange = function (e) {
            m(e), (u.nextSibling.value = u.value);
          }),
          r
        );
      }
      I('SweetAlert2 requires document to initialize');
    },
    G = function (e, t) {
      if (!e) return F(t);
      if ('object' === q(e))
        if (((t.innerHTML = ''), 0 in e))
          for (var n = 0; n in e; n++) t.appendChild(e[n].cloneNode(!0));
        else t.appendChild(e.cloneNode(!0));
      else e && (t.innerHTML = e);
      K(t);
    },
    ee = (function () {
      if (j()) return !1;
      var e = document.createElement('div'),
        t = {
          WebkitAnimation: 'webkitAnimationEnd',
          OAnimation: 'oAnimationEnd oanimationend',
          animation: 'animationend',
        };
      for (var n in t)
        if (t.hasOwnProperty(n) && void 0 !== e.style[n]) return t[n];
      return !1;
    })(),
    te = function (e) {
      var t = Q(),
        n = E(),
        o = L();
      if (
        (e.showConfirmButton || e.showCancelButton ? K(t) : F(t),
        e.showCancelButton ? (o.style.display = 'inline-block') : F(o),
        e.showConfirmButton ? n.style.removeProperty('display') : F(n),
        (n.innerHTML = e.confirmButtonText),
        (o.innerHTML = e.cancelButtonText),
        n.setAttribute('aria-label', e.confirmButtonAriaLabel),
        o.setAttribute('aria-label', e.cancelButtonAriaLabel),
        (n.className = _.confirm),
        z(n, e.confirmButtonClass),
        (o.className = _.cancel),
        z(o, e.cancelButtonClass),
        e.buttonsStyling)
      ) {
        z([n, o], _.styled),
          e.confirmButtonColor &&
            (n.style.backgroundColor = e.confirmButtonColor),
          e.cancelButtonColor &&
            (o.style.backgroundColor = e.cancelButtonColor);
        var i = window.getComputedStyle(n).getPropertyValue('background-color');
        (n.style.borderLeftColor = i), (n.style.borderRightColor = i);
      } else
        W([n, o], _.styled),
          (n.style.backgroundColor =
            n.style.borderLeftColor =
            n.style.borderRightColor =
              ''),
          (o.style.backgroundColor =
            o.style.borderLeftColor =
            o.style.borderRightColor =
              '');
    },
    ne = function (e) {
      var t = B().querySelector('#' + _.content);
      e.html ? G(e.html, t) : e.text ? ((t.textContent = e.text), K(t)) : F(t);
    },
    oe = function (e) {
      for (var t = x(), n = 0; n < t.length; n++) F(t[n]);
      if (e.type)
        if (-1 !== Object.keys(g).indexOf(e.type)) {
          var o = De.getPopup().querySelector(
            '.'.concat(_.icon, '.').concat(g[e.type])
          );
          K(o), e.animation && z(o, 'swal2-animate-'.concat(e.type, '-icon'));
        } else
          I(
            'Unknown type! Expected "success", "error", "warning", "info" or "question", got "'.concat(
              e.type,
              '"'
            )
          );
    },
    ie = function (e) {
      var t = S();
      e.imageUrl
        ? (t.setAttribute('src', e.imageUrl),
          t.setAttribute('alt', e.imageAlt),
          K(t),
          e.imageWidth
            ? t.setAttribute('width', e.imageWidth)
            : t.removeAttribute('width'),
          e.imageHeight
            ? t.setAttribute('height', e.imageHeight)
            : t.removeAttribute('height'),
          (t.className = _.image),
          e.imageClass && z(t, e.imageClass))
        : F(t);
    },
    re = function (i) {
      var r = P(),
        a = parseInt(
          null === i.currentProgressStep
            ? De.getQueueStep()
            : i.currentProgressStep,
          10
        );
      i.progressSteps && i.progressSteps.length
        ? (K(r),
          (r.innerHTML = ''),
          a >= i.progressSteps.length &&
            R(
              'Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)'
            ),
          i.progressSteps.forEach(function (e, t) {
            var n = document.createElement('li');
            if (
              (z(n, _.progresscircle),
              (n.innerHTML = e),
              t === a && z(n, _.activeprogressstep),
              r.appendChild(n),
              t !== i.progressSteps.length - 1)
            ) {
              var o = document.createElement('li');
              z(o, _.progressline),
                i.progressStepsDistance &&
                  (o.style.width = i.progressStepsDistance),
                r.appendChild(o);
            }
          }))
        : F(r);
    },
    ae = function (e) {
      var t = A();
      e.titleText
        ? (t.innerText = e.titleText)
        : e.title &&
          ('string' == typeof e.title &&
            (e.title = e.title.split('\n').join('<br />')),
          G(e.title, t));
    },
    se = function () {
      null === b.previousBodyPadding &&
        document.body.scrollHeight > window.innerHeight &&
        ((b.previousBodyPadding = parseInt(
          window
            .getComputedStyle(document.body)
            .getPropertyValue('padding-right')
        )),
        (document.body.style.paddingRight =
          b.previousBodyPadding +
          (function () {
            if ('ontouchstart' in window || navigator.msMaxTouchPoints)
              return 0;
            var e = document.createElement('div');
            (e.style.width = '50px'),
              (e.style.height = '50px'),
              (e.style.overflow = 'scroll'),
              document.body.appendChild(e);
            var t = e.offsetWidth - e.clientWidth;
            return document.body.removeChild(e), t;
          })() +
          'px'));
    },
    ce = function () {
      return !!window.MSInputMethodContext && !!document.documentMode;
    },
    ue = function () {
      var e = w(),
        t = k();
      e.style.removeProperty('align-items'),
        t.offsetTop < 0 && (e.style.alignItems = 'flex-start');
    },
    le = {},
    de = function (e, t) {
      var n = w(),
        o = k();
      if (o) {
        null !== e && 'function' == typeof e && e(o),
          W(o, _.show),
          z(o, _.hide);
        var i = function () {
          M()
            ? pe(t)
            : (new Promise(function (e) {
                var t = window.scrollX,
                  n = window.scrollY;
                (le.restoreFocusTimeout = setTimeout(function () {
                  le.previousActiveElement && le.previousActiveElement.focus
                    ? (le.previousActiveElement.focus(),
                      (le.previousActiveElement = null))
                    : document.body && document.body.focus(),
                    e();
                }, 100)),
                  void 0 !== t && void 0 !== n && window.scrollTo(t, n);
              }).then(function () {
                return pe(t);
              }),
              le.keydownTarget.removeEventListener(
                'keydown',
                le.keydownHandler,
                { capture: le.keydownListenerCapture }
              ),
              (le.keydownHandlerAdded = !1)),
            n.parentNode && n.parentNode.removeChild(n),
            W(
              [document.documentElement, document.body],
              [
                _.shown,
                _['height-auto'],
                _['no-backdrop'],
                _['toast-shown'],
                _['toast-column'],
              ]
            ),
            T() &&
              (null !== b.previousBodyPadding &&
                ((document.body.style.paddingRight = b.previousBodyPadding),
                (b.previousBodyPadding = null)),
              (function () {
                if (v(document.body, _.iosfix)) {
                  var e = parseInt(document.body.style.top, 10);
                  W(document.body, _.iosfix),
                    (document.body.style.top = ''),
                    (document.body.scrollTop = -1 * e);
                }
              })(),
              'undefined' != typeof window &&
                ce() &&
                window.removeEventListener('resize', ue),
              f(document.body.children).forEach(function (e) {
                e.hasAttribute('data-previous-aria-hidden')
                  ? (e.setAttribute(
                      'aria-hidden',
                      e.getAttribute('data-previous-aria-hidden')
                    ),
                    e.removeAttribute('data-previous-aria-hidden'))
                  : e.removeAttribute('aria-hidden');
              }));
        };
        ee && !v(o, _.noanimation)
          ? o.addEventListener(ee, function e() {
              o.removeEventListener(ee, e), v(o, _.hide) && i();
            })
          : i();
      }
    },
    pe = function (e) {
      null !== e &&
        'function' == typeof e &&
        setTimeout(function () {
          e();
        });
    };
  function fe(e) {
    var t = function e() {
      for (var t = arguments.length, n = new Array(t), o = 0; o < t; o++)
        n[o] = arguments[o];
      if (!(this instanceof e)) return l(e, n);
      Object.getPrototypeOf(e).apply(this, n);
    };
    return (
      (t.prototype = r(Object.create(e.prototype), { constructor: t })),
      'function' == typeof Object.setPrototypeOf
        ? Object.setPrototypeOf(t, e)
        : (t.__proto__ = e),
      t
    );
  }
  var me = {
      title: '',
      titleText: '',
      text: '',
      html: '',
      footer: '',
      type: null,
      toast: !1,
      customClass: '',
      target: 'body',
      backdrop: !0,
      animation: !0,
      heightAuto: !0,
      allowOutsideClick: !0,
      allowEscapeKey: !0,
      allowEnterKey: !0,
      stopKeydownPropagation: !0,
      keydownListenerCapture: !1,
      showConfirmButton: !0,
      showCancelButton: !1,
      preConfirm: null,
      confirmButtonText: 'OK',
      confirmButtonAriaLabel: '',
      confirmButtonColor: null,
      confirmButtonClass: null,
      cancelButtonText: 'Cancel',
      cancelButtonAriaLabel: '',
      cancelButtonColor: null,
      cancelButtonClass: null,
      buttonsStyling: !0,
      reverseButtons: !1,
      focusConfirm: !0,
      focusCancel: !1,
      showCloseButton: !1,
      closeButtonAriaLabel: 'Close this dialog',
      showLoaderOnConfirm: !1,
      imageUrl: null,
      imageWidth: null,
      imageHeight: null,
      imageAlt: '',
      imageClass: null,
      timer: null,
      width: null,
      padding: null,
      background: null,
      input: null,
      inputPlaceholder: '',
      inputValue: '',
      inputOptions: {},
      inputAutoTrim: !0,
      inputClass: null,
      inputAttributes: {},
      inputValidator: null,
      validationMessage: null,
      grow: !1,
      position: 'center',
      progressSteps: [],
      currentProgressStep: null,
      progressStepsDistance: null,
      onBeforeOpen: null,
      onAfterClose: null,
      onOpen: null,
      onClose: null,
      useRejections: !1,
      expectRejections: !1,
    },
    he = ['useRejections', 'expectRejections', 'extraParams'],
    ge = [
      'allowOutsideClick',
      'allowEnterKey',
      'backdrop',
      'focusConfirm',
      'focusCancel',
      'heightAuto',
      'keydownListenerCapture',
    ],
    be = function (e) {
      return me.hasOwnProperty(e) || 'extraParams' === e;
    },
    ve = function (e) {
      return -1 !== he.indexOf(e);
    },
    ye = function (e) {
      for (var t in e)
        be(t) || R('Unknown parameter "'.concat(t, '"')),
          e.toast &&
            -1 !== ge.indexOf(t) &&
            R('The parameter "'.concat(t, '" is incompatible with toasts')),
          ve(t) &&
            m(
              'The parameter "'.concat(
                t,
                '" is deprecated and will be removed in the next major release.'
              )
            );
    },
    we =
      '"setDefaults" & "resetDefaults" methods are deprecated in favor of "mixin" method and will be removed in the next major release. For new projects, use "mixin". For past projects already using "setDefaults", support will be provided through an additional package.',
    Ce = {};
  var ke = [],
    xe = function () {
      var e = k();
      e || De(''), (e = k());
      var t = Q(),
        n = E(),
        o = L();
      K(t),
        K(n),
        z([e, t], _.loading),
        (n.disabled = !0),
        (o.disabled = !0),
        e.setAttribute('data-loading', !0),
        e.setAttribute('aria-busy', !0),
        e.focus();
    },
    Ae = Object.freeze({
      isValidParameter: be,
      isDeprecatedParameter: ve,
      argsToParams: function (n) {
        var o = {};
        switch (q(n[0])) {
          case 'object':
            r(o, n[0]);
            break;
          default:
            ['title', 'html', 'type'].forEach(function (e, t) {
              switch (q(n[t])) {
                case 'string':
                  o[e] = n[t];
                  break;
                case 'undefined':
                  break;
                default:
                  I(
                    'Unexpected type of '
                      .concat(e, '! Expected "string", got ')
                      .concat(q(n[t]))
                  );
              }
            });
        }
        return o;
      },
      adaptInputValidator: function (n) {
        return function (e, t) {
          return n.call(this, e, t).then(
            function () {},
            function (e) {
              return e;
            }
          );
        };
      },
      close: de,
      closePopup: de,
      closeModal: de,
      closeToast: de,
      isVisible: function () {
        return !!k();
      },
      clickConfirm: function () {
        return E().click();
      },
      clickCancel: function () {
        return L().click();
      },
      getContainer: w,
      getPopup: k,
      getTitle: A,
      getContent: B,
      getImage: S,
      getIcons: x,
      getCloseButton: $,
      getButtonsWrapper: function () {
        return (
          m(
            'swal.getButtonsWrapper() is deprecated and will be removed in the next major release, use swal.getActions() instead'
          ),
          C(_.actions)
        );
      },
      getActions: Q,
      getConfirmButton: E,
      getCancelButton: L,
      getFooter: Y,
      getFocusableElements: J,
      getValidationMessage: O,
      isLoading: function () {
        return k().hasAttribute('data-loading');
      },
      fire: function () {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        return l(this, t);
      },
      mixin: function (n) {
        return fe(
          (function (e) {
            function t() {
              return s(this, t), d(this, c(t).apply(this, arguments));
            }
            return (
              a(t, e),
              i(t, [
                {
                  key: '_main',
                  value: function (e) {
                    return p(c(t.prototype), '_main', this).call(
                      this,
                      r({}, n, e)
                    );
                  },
                },
              ]),
              t
            );
          })(this)
        );
      },
      queue: function (e) {
        var r = this;
        ke = e;
        var a = function () {
            (ke = []), document.body.removeAttribute('data-swal2-queue-step');
          },
          s = [];
        return new Promise(function (i) {
          !(function t(n, o) {
            n < ke.length
              ? (document.body.setAttribute('data-swal2-queue-step', n),
                r(ke[n]).then(function (e) {
                  void 0 !== e.value
                    ? (s.push(e.value), t(n + 1, o))
                    : (a(), i({ dismiss: e.dismiss }));
                }))
              : (a(), i({ value: s }));
          })(0);
        });
      },
      getQueueStep: function () {
        return document.body.getAttribute('data-swal2-queue-step');
      },
      insertQueueStep: function (e, t) {
        return t && t < ke.length ? ke.splice(t, 0, e) : ke.push(e);
      },
      deleteQueueStep: function (e) {
        void 0 !== ke[e] && ke.splice(e, 1);
      },
      showLoading: xe,
      enableLoading: xe,
      getTimerLeft: function () {
        return le.timeout && le.timeout.getTimerLeft();
      },
    }),
    Be =
      'function' == typeof Symbol
        ? Symbol
        : (function () {
            var t = 0;
            function e(e) {
              return (
                '__' +
                e +
                '_' +
                Math.floor(1e9 * Math.random()) +
                '_' +
                ++t +
                '__'
              );
            }
            return (e.iterator = e('Symbol.iterator')), e;
          })(),
    Se =
      'function' == typeof WeakMap
        ? WeakMap
        : (function (n, o, t) {
            function e() {
              o(this, n, { value: Be('WeakMap') });
            }
            return (
              (e.prototype = {
                delete: function (e) {
                  delete e[this[n]];
                },
                get: function (e) {
                  return e[this[n]];
                },
                has: function (e) {
                  return t.call(e, this[n]);
                },
                set: function (e, t) {
                  o(e, this[n], { configurable: !0, value: t });
                },
              }),
              e
            );
          })(Be('WeakMap'), Object.defineProperty, {}.hasOwnProperty),
    Pe = { promise: new Se(), innerParams: new Se(), domCache: new Se() };
  function Oe() {
    var e = Pe.innerParams.get(this),
      t = Pe.domCache.get(this);
    e.showConfirmButton ||
      (F(t.confirmButton), e.showCancelButton || F(t.actions)),
      W([t.popup, t.actions], _.loading),
      t.popup.removeAttribute('aria-busy'),
      t.popup.removeAttribute('data-loading'),
      (t.confirmButton.disabled = !1),
      (t.cancelButton.disabled = !1);
  }
  function Ee(e) {
    var t = Pe.domCache.get(this);
    t.validationMessage.innerHTML = e;
    var n = window.getComputedStyle(t.popup);
    (t.validationMessage.style.marginLeft = '-'.concat(
      n.getPropertyValue('padding-left')
    )),
      (t.validationMessage.style.marginRight = '-'.concat(
        n.getPropertyValue('padding-right')
      )),
      K(t.validationMessage);
    var o = this.getInput();
    o &&
      (o.setAttribute('aria-invalid', !0),
      o.setAttribute('aria-describedBy', _['validation-message']),
      N(o),
      z(o, _.inputerror));
  }
  function Le() {
    var e = Pe.domCache.get(this);
    e.validationMessage && F(e.validationMessage);
    var t = this.getInput();
    t &&
      (t.removeAttribute('aria-invalid'),
      t.removeAttribute('aria-describedBy'),
      W(t, _.inputerror));
  }
  var Te = function e(t, n) {
      var o, i, r;
      s(this, e);
      var a = n;
      (this.start = function () {
        (r = !0), (i = new Date()), (o = setTimeout(t, a));
      }),
        (this.stop = function () {
          (r = !1), clearTimeout(o), (a -= new Date() - i);
        }),
        (this.getTimerLeft = function () {
          return r && (this.stop(), this.start()), a;
        }),
        this.start();
    },
    Me = {
      email: function (e, t) {
        return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(e)
          ? Promise.resolve()
          : Promise.reject(
              t && t.validationMessage
                ? t.validationMessage
                : 'Invalid email address'
            );
      },
      url: function (e, t) {
        return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(
          e
        )
          ? Promise.resolve()
          : Promise.reject(
              t && t.validationMessage ? t.validationMessage : 'Invalid URL'
            );
      },
    };
  var je = function (e) {
    var t = w(),
      n = k();
    null !== e.onBeforeOpen &&
      'function' == typeof e.onBeforeOpen &&
      e.onBeforeOpen(n),
      e.animation ? (z(n, _.show), z(t, _.fade), W(n, _.hide)) : W(n, _.fade),
      K(n),
      (t.style.overflowY = 'hidden'),
      ee && !v(n, _.noanimation)
        ? n.addEventListener(ee, function e() {
            n.removeEventListener(ee, e), (t.style.overflowY = 'auto');
          })
        : (t.style.overflowY = 'auto'),
      z([document.documentElement, document.body, t], _.shown),
      e.heightAuto &&
        e.backdrop &&
        !e.toast &&
        z([document.documentElement, document.body], _['height-auto']),
      T() &&
        (se(),
        (function () {
          if (
            /iPad|iPhone|iPod/.test(navigator.userAgent) &&
            !window.MSStream &&
            !v(document.body, _.iosfix)
          ) {
            var e = document.body.scrollTop;
            (document.body.style.top = -1 * e + 'px'),
              z(document.body, _.iosfix);
          }
        })(),
        'undefined' != typeof window &&
          ce() &&
          (ue(), window.addEventListener('resize', ue)),
        f(document.body.children).forEach(function (e) {
          e === w() ||
            e.contains(w()) ||
            (e.hasAttribute('aria-hidden') &&
              e.setAttribute(
                'data-previous-aria-hidden',
                e.getAttribute('aria-hidden')
              ),
            e.setAttribute('aria-hidden', 'true'));
        }),
        setTimeout(function () {
          t.scrollTop = 0;
        })),
      M() ||
        le.previousActiveElement ||
        (le.previousActiveElement = document.activeElement),
      null !== e.onOpen &&
        'function' == typeof e.onOpen &&
        setTimeout(function () {
          e.onOpen(n);
        });
  };
  var Ve,
    qe = Object.freeze({
      hideLoading: Oe,
      disableLoading: Oe,
      getInput: function (e) {
        var t = Pe.innerParams.get(this),
          n = Pe.domCache.get(this);
        if (!(e = e || t.input)) return null;
        switch (e) {
          case 'select':
          case 'textarea':
          case 'file':
            return U(n.content, _[e]);
          case 'checkbox':
            return n.popup.querySelector('.'.concat(_.checkbox, ' input'));
          case 'radio':
            return (
              n.popup.querySelector('.'.concat(_.radio, ' input:checked')) ||
              n.popup.querySelector('.'.concat(_.radio, ' input:first-child'))
            );
          case 'range':
            return n.popup.querySelector('.'.concat(_.range, ' input'));
          default:
            return U(n.content, _.input);
        }
      },
      enableButtons: function () {
        var e = Pe.domCache.get(this);
        (e.confirmButton.disabled = !1), (e.cancelButton.disabled = !1);
      },
      disableButtons: function () {
        var e = Pe.domCache.get(this);
        (e.confirmButton.disabled = !0), (e.cancelButton.disabled = !0);
      },
      enableConfirmButton: function () {
        Pe.domCache.get(this).confirmButton.disabled = !1;
      },
      disableConfirmButton: function () {
        Pe.domCache.get(this).confirmButton.disabled = !0;
      },
      enableInput: function () {
        var e = this.getInput();
        if (!e) return !1;
        if ('radio' === e.type)
          for (
            var t = e.parentNode.parentNode.querySelectorAll('input'), n = 0;
            n < t.length;
            n++
          )
            t[n].disabled = !1;
        else e.disabled = !1;
      },
      disableInput: function () {
        var e = this.getInput();
        if (!e) return !1;
        if (e && 'radio' === e.type)
          for (
            var t = e.parentNode.parentNode.querySelectorAll('input'), n = 0;
            n < t.length;
            n++
          )
            t[n].disabled = !0;
        else e.disabled = !0;
      },
      showValidationMessage: Ee,
      resetValidationMessage: Le,
      resetValidationError: function () {
        m(
          'Swal.resetValidationError() is deprecated and will be removed in the next major release, use Swal.resetValidationMessage() instead'
        ),
          Le.bind(this)();
      },
      showValidationError: function (e) {
        m(
          'Swal.showValidationError() is deprecated and will be removed in the next major release, use Swal.showValidationMessage() instead'
        ),
          Ee.bind(this)(e);
      },
      getProgressSteps: function () {
        return Pe.innerParams.get(this).progressSteps;
      },
      setProgressSteps: function (e) {
        var t = r({}, Pe.innerParams.get(this), { progressSteps: e });
        Pe.innerParams.set(this, t), re(t);
      },
      showProgressSteps: function () {
        var e = Pe.domCache.get(this);
        K(e.progressSteps);
      },
      hideProgressSteps: function () {
        var e = Pe.domCache.get(this);
        F(e.progressSteps);
      },
      _main: function (e) {
        var T = this;
        ye(e);
        var M = r({}, me, e);
        !(function (t) {
          var e;
          t.inputValidator ||
            Object.keys(Me).forEach(function (e) {
              t.input === e &&
                (t.inputValidator = t.expectRejections
                  ? Me[e]
                  : De.adaptInputValidator(Me[e]));
            }),
            t.validationMessage &&
              ('object' !== q(t.extraParams) && (t.extraParams = {}),
              (t.extraParams.validationMessage = t.validationMessage)),
            (!t.target ||
              ('string' == typeof t.target &&
                !document.querySelector(t.target)) ||
              ('string' != typeof t.target && !t.target.appendChild)) &&
              (R('Target parameter is not valid, defaulting to "body"'),
              (t.target = 'body')),
            'function' == typeof t.animation &&
              (t.animation = t.animation.call());
          var n = k(),
            o =
              'string' == typeof t.target
                ? document.querySelector(t.target)
                : t.target;
          (e = n && o && n.parentNode !== o.parentNode ? X(t) : n || X(t)),
            t.width &&
              (e.style.width =
                'number' == typeof t.width ? t.width + 'px' : t.width),
            t.padding &&
              (e.style.padding =
                'number' == typeof t.padding ? t.padding + 'px' : t.padding),
            t.background && (e.style.background = t.background);
          for (
            var i = window
                .getComputedStyle(e)
                .getPropertyValue('background-color'),
              r = e.querySelectorAll(
                '[class^=swal2-success-circular-line], .swal2-success-fix'
              ),
              a = 0;
            a < r.length;
            a++
          )
            r[a].style.backgroundColor = i;
          var s = w(),
            c = $(),
            u = Y();
          if (
            (ae(t),
            ne(t),
            'string' == typeof t.backdrop
              ? (w().style.background = t.backdrop)
              : t.backdrop ||
                z([document.documentElement, document.body], _['no-backdrop']),
            !t.backdrop &&
              t.allowOutsideClick &&
              R(
                '"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`'
              ),
            t.position in _
              ? z(s, _[t.position])
              : (R(
                  'The "position" parameter is not valid, defaulting to "center"'
                ),
                z(s, _.center)),
            t.grow && 'string' == typeof t.grow)
          ) {
            var l = 'grow-' + t.grow;
            l in _ && z(s, _[l]);
          }
          t.showCloseButton
            ? (c.setAttribute('aria-label', t.closeButtonAriaLabel), K(c))
            : F(c),
            (e.className = _.popup),
            t.toast
              ? (z([document.documentElement, document.body], _['toast-shown']),
                z(e, _.toast))
              : z(e, _.modal),
            t.customClass && z(e, t.customClass),
            re(t),
            oe(t),
            ie(t),
            te(t),
            G(t.footer, u),
            !0 === t.animation ? W(e, _.noanimation) : z(e, _.noanimation),
            t.showLoaderOnConfirm &&
              !t.preConfirm &&
              R(
                'showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request'
              );
        })(M),
          Object.freeze(M),
          Pe.innerParams.set(this, M),
          le.timeout && (le.timeout.stop(), delete le.timeout),
          clearTimeout(le.restoreFocusTimeout);
        var j = {
          popup: k(),
          container: w(),
          content: B(),
          actions: Q(),
          confirmButton: E(),
          cancelButton: L(),
          closeButton: $(),
          validationMessage: O(),
          progressSteps: P(),
        };
        Pe.domCache.set(this, j);
        var V = this.constructor;
        return new Promise(function (t, n) {
          var o = function (e) {
              V.closePopup(M.onClose, M.onAfterClose),
                M.useRejections ? t(e) : t({ value: e });
            },
            c = function (e) {
              V.closePopup(M.onClose, M.onAfterClose),
                M.useRejections ? n(e) : t({ dismiss: e });
            },
            u = function (e) {
              V.closePopup(M.onClose, M.onAfterClose), n(e);
            };
          M.timer &&
            (le.timeout = new Te(function () {
              c('timer'), delete le.timeout;
            }, M.timer)),
            M.input &&
              setTimeout(function () {
                var e = T.getInput();
                e && N(e);
              }, 0);
          for (
            var l = function (t) {
                if ((M.showLoaderOnConfirm && V.showLoading(), M.preConfirm)) {
                  T.resetValidationMessage();
                  var e = Promise.resolve().then(function () {
                    return M.preConfirm(t, M.extraParams);
                  });
                  M.expectRejections
                    ? e.then(
                        function (e) {
                          return o(e || t);
                        },
                        function (e) {
                          T.hideLoading(), e && T.showValidationMessage(e);
                        }
                      )
                    : e.then(
                        function (e) {
                          Z(j.validationMessage) || !1 === e
                            ? T.hideLoading()
                            : o(e || t);
                        },
                        function (e) {
                          return u(e);
                        }
                      );
                } else o(t);
              },
              e = function (e) {
                var t = e.target,
                  n = j.confirmButton,
                  o = j.cancelButton,
                  i = n && (n === t || n.contains(t)),
                  r = o && (o === t || o.contains(t));
                switch (e.type) {
                  case 'click':
                    if (i && V.isVisible())
                      if ((T.disableButtons(), M.input)) {
                        var a = (function () {
                          var e = T.getInput();
                          if (!e) return null;
                          switch (M.input) {
                            case 'checkbox':
                              return e.checked ? 1 : 0;
                            case 'radio':
                              return e.checked ? e.value : null;
                            case 'file':
                              return e.files.length ? e.files[0] : null;
                            default:
                              return M.inputAutoTrim ? e.value.trim() : e.value;
                          }
                        })();
                        if (M.inputValidator) {
                          T.disableInput();
                          var s = Promise.resolve().then(function () {
                            return M.inputValidator(a, M.extraParams);
                          });
                          M.expectRejections
                            ? s.then(
                                function () {
                                  T.enableButtons(), T.enableInput(), l(a);
                                },
                                function (e) {
                                  T.enableButtons(),
                                    T.enableInput(),
                                    e && T.showValidationMessage(e);
                                }
                              )
                            : s.then(
                                function (e) {
                                  T.enableButtons(),
                                    T.enableInput(),
                                    e ? T.showValidationMessage(e) : l(a);
                                },
                                function (e) {
                                  return u(e);
                                }
                              );
                        } else
                          T.getInput().checkValidity()
                            ? l(a)
                            : (T.enableButtons(),
                              T.showValidationMessage(M.validationMessage));
                      } else l(!0);
                    else
                      r &&
                        V.isVisible() &&
                        (T.disableButtons(), c(V.DismissReason.cancel));
                }
              },
              i = j.popup.querySelectorAll('button'),
              r = 0;
            r < i.length;
            r++
          )
            (i[r].onclick = e),
              (i[r].onmouseover = e),
              (i[r].onmouseout = e),
              (i[r].onmousedown = e);
          if (
            ((j.closeButton.onclick = function () {
              c(V.DismissReason.close);
            }),
            M.toast)
          )
            j.popup.onclick = function () {
              M.showConfirmButton ||
                M.showCancelButton ||
                M.showCloseButton ||
                M.input ||
                c(V.DismissReason.close);
            };
          else {
            var a = !1;
            (j.popup.onmousedown = function () {
              j.container.onmouseup = function (e) {
                (j.container.onmouseup = void 0),
                  e.target === j.container && (a = !0);
              };
            }),
              (j.container.onmousedown = function () {
                j.popup.onmouseup = function (e) {
                  (j.popup.onmouseup = void 0),
                    (e.target === j.popup || j.popup.contains(e.target)) &&
                      (a = !0);
                };
              }),
              (j.container.onclick = function (e) {
                a
                  ? (a = !1)
                  : e.target === j.container &&
                    H(M.allowOutsideClick) &&
                    c(V.DismissReason.backdrop);
              });
          }
          M.reverseButtons
            ? j.confirmButton.parentNode.insertBefore(
                j.cancelButton,
                j.confirmButton
              )
            : j.confirmButton.parentNode.insertBefore(
                j.confirmButton,
                j.cancelButton
              );
          var s = function (e, t) {
            for (var n = J(M.focusCancel), o = 0; o < n.length; o++)
              return (
                (e += t) === n.length
                  ? (e = 0)
                  : -1 === e && (e = n.length - 1),
                n[e].focus()
              );
            j.popup.focus();
          };
          le.keydownHandlerAdded &&
            (le.keydownTarget.removeEventListener(
              'keydown',
              le.keydownHandler,
              { capture: le.keydownListenerCapture }
            ),
            (le.keydownHandlerAdded = !1)),
            M.toast ||
              ((le.keydownHandler = function (e) {
                return (function (e, t) {
                  if (
                    (t.stopKeydownPropagation && e.stopPropagation(),
                    'Enter' !== e.key || e.isComposing)
                  )
                    if ('Tab' === e.key) {
                      for (
                        var n = e.target, o = J(t.focusCancel), i = -1, r = 0;
                        r < o.length;
                        r++
                      )
                        if (n === o[r]) {
                          i = r;
                          break;
                        }
                      e.shiftKey ? s(i, -1) : s(i, 1),
                        e.stopPropagation(),
                        e.preventDefault();
                    } else
                      -1 !==
                      [
                        'ArrowLeft',
                        'ArrowRight',
                        'ArrowUp',
                        'ArrowDown',
                        'Left',
                        'Right',
                        'Up',
                        'Down',
                      ].indexOf(e.key)
                        ? document.activeElement === j.confirmButton &&
                          Z(j.cancelButton)
                          ? j.cancelButton.focus()
                          : document.activeElement === j.cancelButton &&
                            Z(j.confirmButton) &&
                            j.confirmButton.focus()
                        : ('Escape' !== e.key && 'Esc' !== e.key) ||
                          !0 !== H(t.allowEscapeKey) ||
                          (e.preventDefault(), c(V.DismissReason.esc));
                  else if (
                    e.target &&
                    T.getInput() &&
                    e.target.outerHTML === T.getInput().outerHTML
                  ) {
                    if (-1 !== ['textarea', 'file'].indexOf(t.input)) return;
                    V.clickConfirm(), e.preventDefault();
                  }
                })(e, M);
              }),
              (le.keydownTarget = M.keydownListenerCapture ? window : j.popup),
              (le.keydownListenerCapture = M.keydownListenerCapture),
              le.keydownTarget.addEventListener('keydown', le.keydownHandler, {
                capture: le.keydownListenerCapture,
              }),
              (le.keydownHandlerAdded = !0)),
            T.enableButtons(),
            T.hideLoading(),
            T.resetValidationMessage(),
            M.toast && (M.input || M.footer || M.showCloseButton)
              ? z(document.body, _['toast-column'])
              : W(document.body, _['toast-column']);
          for (
            var d,
              p,
              f = [
                'input',
                'file',
                'range',
                'select',
                'radio',
                'checkbox',
                'textarea',
              ],
              m = function (e) {
                (e.placeholder && !M.inputPlaceholder) ||
                  (e.placeholder = M.inputPlaceholder);
              },
              h = 0;
            h < f.length;
            h++
          ) {
            var g = _[f[h]],
              b = U(j.content, g);
            if ((d = T.getInput(f[h]))) {
              for (var v in d.attributes)
                if (d.attributes.hasOwnProperty(v)) {
                  var y = d.attributes[v].name;
                  'type' !== y && 'value' !== y && d.removeAttribute(y);
                }
              for (var w in M.inputAttributes)
                d.setAttribute(w, M.inputAttributes[w]);
            }
            (b.className = g), M.inputClass && z(b, M.inputClass), F(b);
          }
          switch (M.input) {
            case 'text':
            case 'email':
            case 'password':
            case 'number':
            case 'tel':
            case 'url':
              (d = U(j.content, _.input)),
                'string' == typeof M.inputValue ||
                'number' == typeof M.inputValue
                  ? (d.value = M.inputValue)
                  : R(
                      'Unexpected type of inputValue! Expected "string" or "number", got "'.concat(
                        q(M.inputValue),
                        '"'
                      )
                    ),
                m(d),
                (d.type = M.input),
                K(d);
              break;
            case 'file':
              m((d = U(j.content, _.file))), (d.type = M.input), K(d);
              break;
            case 'range':
              var C = U(j.content, _.range),
                k = C.querySelector('input'),
                x = C.querySelector('output');
              (k.value = M.inputValue),
                (k.type = M.input),
                (x.value = M.inputValue),
                K(C);
              break;
            case 'select':
              var A = U(j.content, _.select);
              if (((A.innerHTML = ''), M.inputPlaceholder)) {
                var B = document.createElement('option');
                (B.innerHTML = M.inputPlaceholder),
                  (B.value = ''),
                  (B.disabled = !0),
                  (B.selected = !0),
                  A.appendChild(B);
              }
              p = function (e) {
                e.forEach(function (e) {
                  var t = e[0],
                    n = e[1],
                    o = document.createElement('option');
                  (o.value = t),
                    (o.innerHTML = n),
                    M.inputValue.toString() === t.toString() &&
                      (o.selected = !0),
                    A.appendChild(o);
                }),
                  K(A),
                  A.focus();
              };
              break;
            case 'radio':
              var S = U(j.content, _.radio);
              (S.innerHTML = ''),
                (p = function (e) {
                  e.forEach(function (e) {
                    var t = e[0],
                      n = e[1],
                      o = document.createElement('input'),
                      i = document.createElement('label');
                    (o.type = 'radio'),
                      (o.name = _.radio),
                      (o.value = t),
                      M.inputValue.toString() === t.toString() &&
                        (o.checked = !0);
                    var r = document.createElement('span');
                    (r.innerHTML = n),
                      (r.className = _.label),
                      i.appendChild(o),
                      i.appendChild(r),
                      S.appendChild(i);
                  }),
                    K(S);
                  var t = S.querySelectorAll('input');
                  t.length && t[0].focus();
                });
              break;
            case 'checkbox':
              var P = U(j.content, _.checkbox),
                O = T.getInput('checkbox');
              (O.type = 'checkbox'),
                (O.value = 1),
                (O.id = _.checkbox),
                (O.checked = Boolean(M.inputValue)),
                (P.querySelector('span').innerHTML = M.inputPlaceholder),
                K(P);
              break;
            case 'textarea':
              var E = U(j.content, _.textarea);
              (E.value = M.inputValue), m(E), K(E);
              break;
            case null:
              break;
            default:
              I(
                'Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "'.concat(
                  M.input,
                  '"'
                )
              );
          }
          if ('select' === M.input || 'radio' === M.input) {
            var L = function (e) {
              return p(
                ((t = e),
                (n = []),
                'undefined' != typeof Map && t instanceof Map
                  ? t.forEach(function (e, t) {
                      n.push([t, e]);
                    })
                  : Object.keys(t).forEach(function (e) {
                      n.push([e, t[e]]);
                    }),
                n)
              );
              var t, n;
            };
            D(M.inputOptions)
              ? (V.showLoading(),
                M.inputOptions.then(function (e) {
                  T.hideLoading(), L(e);
                }))
              : 'object' === q(M.inputOptions)
              ? L(M.inputOptions)
              : I(
                  'Unexpected type of inputOptions! Expected object, Map or Promise, got '.concat(
                    q(M.inputOptions)
                  )
                );
          } else
            -1 !==
              ['text', 'email', 'number', 'tel', 'textarea'].indexOf(M.input) &&
              D(M.inputValue) &&
              (V.showLoading(),
              F(d),
              M.inputValue
                .then(function (e) {
                  (d.value =
                    'number' === M.input ? parseFloat(e) || 0 : e + ''),
                    K(d),
                    d.focus(),
                    T.hideLoading();
                })
                .catch(function (e) {
                  I('Error in inputValue promise: ' + e),
                    (d.value = ''),
                    K(d),
                    d.focus(),
                    T.hideLoading();
                }));
          je(M),
            M.toast ||
              (H(M.allowEnterKey)
                ? M.focusCancel && Z(j.cancelButton)
                  ? j.cancelButton.focus()
                  : M.focusConfirm && Z(j.confirmButton)
                  ? j.confirmButton.focus()
                  : s(-1, 1)
                : document.activeElement && document.activeElement.blur()),
            (j.container.scrollTop = 0);
        });
      },
    });
  function Re() {
    if ('undefined' != typeof window) {
      'undefined' == typeof Promise &&
        I(
          'This package requires a Promise library, please include a shim to enable it in this browser (See: https://github.com/sweetalert2/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2#1-ie-support)'
        );
      for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
        t[n] = arguments[n];
      if (0 === t.length) return I('At least 1 argument is expected!'), !1;
      Ve = this;
      var o = Object.freeze(this.constructor.argsToParams(t));
      Object.defineProperties(this, {
        params: { value: o, writable: !1, enumerable: !0 },
      });
      var i = this._main(this.params);
      Pe.promise.set(this, i);
    }
  }
  (Re.prototype.then = function (e, t) {
    return Pe.promise.get(this).then(e, t);
  }),
    (Re.prototype.catch = function (e) {
      return Pe.promise.get(this).catch(e);
    }),
    (Re.prototype.finally = function (e) {
      return Pe.promise.get(this).finally(e);
    }),
    r(Re.prototype, qe),
    r(Re, Ae),
    Object.keys(qe).forEach(function (t) {
      Re[t] = function () {
        var e;
        if (Ve) return (e = Ve)[t].apply(e, arguments);
      };
    }),
    (Re.DismissReason = e),
    (Re.noop = function () {});
  var Ie,
    He,
    De = fe(
      ((Ie = Re),
      (He = (function (e) {
        function t() {
          return s(this, t), d(this, c(t).apply(this, arguments));
        }
        return (
          a(t, Ie),
          i(
            t,
            [
              {
                key: '_main',
                value: function (e) {
                  return p(c(t.prototype), '_main', this).call(
                    this,
                    r({}, Ce, e)
                  );
                },
              },
            ],
            [
              {
                key: 'setDefaults',
                value: function (t) {
                  if ((m(we), !t || 'object' !== q(t)))
                    throw new TypeError(
                      'SweetAlert2: The argument for setDefaults() is required and has to be a object'
                    );
                  ye(t),
                    Object.keys(t).forEach(function (e) {
                      Ie.isValidParameter(e) && (Ce[e] = t[e]);
                    });
                },
              },
              {
                key: 'resetDefaults',
                value: function () {
                  m(we), (Ce = {});
                },
              },
            ]
          ),
          t
        );
      })()),
      'undefined' != typeof window &&
        'object' === q(window._swalDefaults) &&
        He.setDefaults(window._swalDefaults),
      He)
    );
  return (De.default = De);
}),
  'undefined' != typeof window &&
    window.Sweetalert2 &&
    ((window.Sweetalert2.version = '7.29.0'),
    (window.swal =
      window.sweetAlert =
      window.Swal =
      window.SweetAlert =
        window.Sweetalert2));
('use strict');

$(function () {
  const LI = {
    methods: {},
  };

  const isLogged = $('#cabecalho .btn-group').length ? true : false;

  LI.methods.account = function () {
    if (isLogged) {
      $('.account').append(
        $(
          '<ul class="account-list"> <li> <a href="/conta/index"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.59 16.967"> <path d="M.693,16.964a.762.762,0,0,1-.69-.83,12.675,12.675,0,0,1,1.519-5.355A5.28,5.28,0,0,1,6.3,8.045a5.279,5.279,0,0,1,4.773,2.734,12.557,12.557,0,0,1,1.519,5.355.76.76,0,0,1-.69.823.267.267,0,0,1-.07.006.762.762,0,0,1-.753-.69C10.663,11.818,9.055,9.558,6.3,9.558s-4.368,2.26-4.779,6.716a.76.76,0,0,1-.754.693C.74,16.967.717,16.966.693,16.964ZM2.808,3.488A3.488,3.488,0,1,1,6.3,6.975,3.49,3.49,0,0,1,2.808,3.488Zm1.519,0A1.969,1.969,0,1,0,6.3,1.519,1.975,1.975,0,0,0,4.327,3.488Z" /></svg> Minha Conta </a> </li> <li> <a href="/conta/pedido/listar"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17.588"> <g transform="translate(0 -5.301)"> <g transform="translate(0 5.301)"> <path d="M17.537,6.743a.468.468,0,0,0-.466.466v12.38A2.373,2.373,0,0,1,14.7,21.96H3.3A2.373,2.373,0,0,1,.933,19.589V6.234H14.587v12.01a.466.466,0,1,0,.933,0V5.767a.468.468,0,0,0-.466-.466H.466A.468.468,0,0,0,0,5.767V19.585a3.306,3.306,0,0,0,3.3,3.3H14.7a3.306,3.306,0,0,0,3.3-3.3V7.209A.462.462,0,0,0,17.537,6.743Z" transform="translate(0 -5.301)" /> <path d="M66.334,75.434a.466.466,0,1,0,0-.933H56.166a.466.466,0,1,0,0,.933Z" transform="translate(-53.535 -71.811)" /> <path d="M66.334,319.1H56.166a.466.466,0,1,0,0,.933H66.33a.466.466,0,0,0,0-.933Z" transform="translate(-53.535 -306.904)" /> <path d="M106.221,380.6H97.666a.466.466,0,1,0,0,.933h8.555a.466.466,0,1,0,0-.933Z" transform="translate(-93.422 -366.014)" /> <path d="M51.7,128.867v5.045a.468.468,0,0,0,.466.466h5.065a.468.468,0,0,0,.466-.466v-5.045a.468.468,0,0,0-.466-.466H52.166A.468.468,0,0,0,51.7,128.867Zm.933.466h4.132v4.112H52.633Z" transform="translate(-49.691 -123.616)" /> <path d="M241.221,140.4h-3.354a.466.466,0,0,0,0,.933h3.354a.466.466,0,1,0,0-.933Z" transform="translate(-228.173 -135.15)" /> <path d="M241.221,194.6h-3.354a.466.466,0,0,0,0,.933h3.354a.466.466,0,1,0,0-.933Z" transform="translate(-228.173 -187.243)" /> <path d="M241.687,252.667a.468.468,0,0,0-.466-.466h-3.354a.466.466,0,0,0,0,.933h3.354A.465.465,0,0,0,241.687,252.667Z" transform="translate(-228.173 -242.604)" /> </g> </g> </svg> Meus Pedidos </a> </li> <li> <a href="/conta/favorito/listar"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.311 16.548"> <path class="a" d="M15.768,1.393a4.6,4.6,0,0,0-6.544,0l-.644.644-.644-.644A4.627,4.627,0,0,0,1.393,7.937L8.58,15.124l7.188-7.188a4.6,4.6,0,0,0,0-6.544" transform="translate(0.575 0.575)" /></svg> Favoritos </a> </li> <li> <a href="/conta/logout"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.277 18"> <path d="M-7539.275-4612a.688.688,0,0,1-.686-.688.685.685,0,0,1,.686-.684h6.475a1.706,1.706,0,0,0,1.707-1.7v-11.849a1.706,1.706,0,0,0-1.7-1.705h-6.479a.685.685,0,0,1-.686-.684.689.689,0,0,1,.686-.688h6.479a3.08,3.08,0,0,1,3.074,3.077V-4621h0v5.925A3.078,3.078,0,0,1-7532.8-4612Zm-.07-5.95a.686.686,0,0,1,0-.972l1.544-1.546h-9.513a.686.686,0,0,1-.686-.686.688.688,0,0,1,.686-.686h9.513l-1.555-1.574a.686.686,0,0,1,0-.972.686.686,0,0,1,.972,0l2.724,2.722.006.006a.507.507,0,0,1,.04.047c.006.011.011.017.017.028a.1.1,0,0,1,.022.028.114.114,0,0,1,.017.028c.006.012.012.017.017.029l.017.034c0,.012.006.017.012.029s.005.022.011.034a.351.351,0,0,0,.011.034c0,.011.006.025.006.036s.005.022.005.034.006.022.006.034a.211.211,0,0,1,.006.028.29.29,0,0,1,.005.068c0,.023-.005.046-.005.068s-.006.019-.006.028-.006.025-.006.036-.005.023-.005.034a.071.071,0,0,1-.006.034c-.006.011-.006.022-.011.034s-.006.023-.011.034-.006.017-.012.029l-.017.034c-.005.012-.011.017-.017.029a.108.108,0,0,0-.017.03.1.1,0,0,0-.022.028.131.131,0,0,1-.017.028.357.357,0,0,1-.045.051l-2.713,2.716a.685.685,0,0,1-.486.2A.687.687,0,0,1-7539.345-4617.951Zm3.685-2.716h0Z" transform="translate(7548 4630)" /></svg> Sair </a> </li><div class="tracking"></div></ul>'
        )
      );
    } else {
      $('.account').append(
        $(
          '<ul class="account-list"> <li> <a href="/conta/login"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.59 16.967"> <path d="M.693,16.964a.762.762,0,0,1-.69-.83,12.675,12.675,0,0,1,1.519-5.355A5.28,5.28,0,0,1,6.3,8.045a5.279,5.279,0,0,1,4.773,2.734,12.557,12.557,0,0,1,1.519,5.355.76.76,0,0,1-.69.823.267.267,0,0,1-.07.006.762.762,0,0,1-.753-.69C10.663,11.818,9.055,9.558,6.3,9.558s-4.368,2.26-4.779,6.716a.76.76,0,0,1-.754.693C.74,16.967.717,16.966.693,16.964ZM2.808,3.488A3.488,3.488,0,1,1,6.3,6.975,3.49,3.49,0,0,1,2.808,3.488Zm1.519,0A1.969,1.969,0,1,0,6.3,1.519,1.975,1.975,0,0,0,4.327,3.488Z" /></svg> Cadastrar </a> </li> <li> <a href="/conta/login"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.277 18"> <path d="M-7539.275-4612a.688.688,0,0,1-.686-.688.685.685,0,0,1,.686-.684h6.475a1.706,1.706,0,0,0,1.707-1.7v-11.849a1.706,1.706,0,0,0-1.7-1.705h-6.479a.685.685,0,0,1-.686-.684.689.689,0,0,1,.686-.688h6.479a3.08,3.08,0,0,1,3.074,3.077V-4621h0v5.925A3.078,3.078,0,0,1-7532.8-4612Zm-.07-5.95a.686.686,0,0,1,0-.972l1.544-1.546h-9.513a.686.686,0,0,1-.686-.686.688.688,0,0,1,.686-.686h9.513l-1.555-1.574a.686.686,0,0,1,0-.972.686.686,0,0,1,.972,0l2.724,2.722.006.006a.507.507,0,0,1,.04.047c.006.011.011.017.017.028a.1.1,0,0,1,.022.028.114.114,0,0,1,.017.028c.006.012.012.017.017.029l.017.034c0,.012.006.017.012.029s.005.022.011.034a.351.351,0,0,0,.011.034c0,.011.006.025.006.036s.005.022.005.034.006.022.006.034a.211.211,0,0,1,.006.028.29.29,0,0,1,.005.068c0,.023-.005.046-.005.068s-.006.019-.006.028-.006.025-.006.036-.005.023-.005.034a.071.071,0,0,1-.006.034c-.006.011-.006.022-.011.034s-.006.023-.011.034-.006.017-.012.029l-.017.034c-.005.012-.011.017-.017.029a.108.108,0,0,0-.017.03.1.1,0,0,0-.022.028.131.131,0,0,1-.017.028.357.357,0,0,1-.045.051l-2.713,2.716a.685.685,0,0,1-.486.2A.687.687,0,0,1-7539.345-4617.951Zm3.685-2.716h0Z" transform="translate(7548 4630)" /></svg> Entrar </a> </li><div class="tracking"></div></ul>'
        )
      );
    }
  };

  LI.methods.support = function () {
    var $contact = $('#rodape .visible-phone ul').html();
    var $support =
      '<div class="support-items"><ul class="contact">' +
      $contact +
      '</ul></div>';
    $('.support').append($support);
    $('.support .contact .fa-whatsapp').replaceWith(
      '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.371 16.372"><path d="M3.96,15.2a8.126,8.126,0,0,0,4.2,1.162,8.228,8.228,0,0,0,8.215-8.183,8.183,8.183,0,1,0-15.2,4.229L0,16.371ZM.965,8.183a7.189,7.189,0,1,1,3.323,6.1L4.1,14.161l-2.686.792.792-2.686-.118-.184A7.223,7.223,0,0,1,.965,8.183Zm0,0"/><path d="M121.239,96.377a7.229,7.229,0,0,0,5.8,5.8c.953.181,2.35.209,3.033-.474l.381-.381a1.018,1.018,0,0,0,0-1.44l-1.523-1.523a1.018,1.018,0,0,0-1.44,0l-.381.381a.677.677,0,0,1-.906,0l-1.519-1.583-.007-.007a.6.6,0,0,1,0-.845l.381-.381a1.017,1.017,0,0,0,0-1.44l-1.523-1.523a1.019,1.019,0,0,0-1.44,0l-.381.381h0A3.55,3.55,0,0,0,121.239,96.377Zm1.152-2.355c.4-.391.378-.4.422-.4a.059.059,0,0,1,.042.017c1.6,1.613,1.54,1.519,1.54,1.565a.058.058,0,0,1-.017.042l-.381.381a1.556,1.556,0,0,0,0,2.2l1.52,1.584.007.007a1.636,1.636,0,0,0,2.265,0l.381-.381a.059.059,0,0,1,.083,0c1.6,1.613,1.54,1.518,1.54,1.565a.057.057,0,0,1-.017.042l-.381.381a2.837,2.837,0,0,1-2.176.211,6.27,6.27,0,0,1-5.035-5.035A2.836,2.836,0,0,1,122.392,94.022Zm0,0" transform="translate(-117.254 -89.702)"/></svg>'
    );
    $('.support .contact .fa-envelope').replaceWith(
      '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.227 11.039"><g transform="translate(0 -38.529)"><path d="M41.35,68.654,36.1,73.285l-5.256-4.63a.5.5,0,1,0-.667.758l5.59,4.925a.5.5,0,0,0,.668,0l5.588-4.925a.5.5,0,1,0-.668-.757Z" transform="translate(-27.981 -27.98)"/><path d="M14.712,38.529H1.515A1.516,1.516,0,0,0,0,40.044v8.01a1.516,1.516,0,0,0,1.515,1.515h13.2a1.516,1.516,0,0,0,1.515-1.515v-8.01A1.516,1.516,0,0,0,14.712,38.529Zm.5,9.525a.505.505,0,0,1-.5.5H1.515a.505.505,0,0,1-.5-.5v-8.01a.505.505,0,0,1,.5-.5h13.2a.505.505,0,0,1,.5.5Z" transform="translate(0 0)"/></g></svg>'
    );
    $('.support .contact .icon-phone').replaceWith(
      '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.258 16.725"><g transform="translate(-2.95)"><path d="M112.4,2.191A7.431,7.431,0,0,0,107.11,0a.593.593,0,1,0,0,1.185,6.295,6.295,0,0,1,6.3,6.3.593.593,0,0,0,1.185,0A7.431,7.431,0,0,0,112.4,2.191Z" transform="translate(-95.383)"/><path d="M109.961,47.615a.593.593,0,0,0,1.185,0,4.042,4.042,0,0,0-4.037-4.037h0a.593.593,0,0,0,0,1.185A2.855,2.855,0,0,1,109.961,47.615Z" transform="translate(-95.383 -40.134)"/><path d="M13.267,39.823a1.789,1.789,0,0,0-1.584.948.593.593,0,1,0,.978.669c.261-.381.379-.441.539-.434a7.635,7.635,0,0,1,2.736,2,.613.613,0,0,1-.006.433,2.046,2.046,0,0,1-1.016,1.279,1.9,1.9,0,0,1-1.523-.051,16.752,16.752,0,0,1-5.5-3.578l0,0A16.749,16.749,0,0,1,4.323,35.6a1.9,1.9,0,0,1-.052-1.524A2.045,2.045,0,0,1,5.55,33.064a.612.612,0,0,1,.432-.006,7.649,7.649,0,0,1,2,2.731c.009.166-.052.284-.433.545a.593.593,0,0,0,.669.979,1.788,1.788,0,0,0,.948-1.586A7.256,7.256,0,0,0,6.4,31.947a1.792,1.792,0,0,0-1.224-.007,3.19,3.19,0,0,0-1.979,1.645,3.051,3.051,0,0,0,.031,2.465,17.928,17.928,0,0,0,3.832,5.881l.012.012a17.933,17.933,0,0,0,5.874,3.826,3.517,3.517,0,0,0,1.323.276,2.717,2.717,0,0,0,1.141-.245,3.19,3.19,0,0,0,1.645-1.979,1.793,1.793,0,0,0-.006-1.221A7.254,7.254,0,0,0,13.267,39.823Z" transform="translate(0 -29.32)"/></g></svg>'
    );
    $('.support .contact .fa-skype').replaceWith(
      '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.487 16.695"><g transform="translate(-1.33)"><path d="M10.788,15.06A6.736,6.736,0,0,1,3.037,7.176a.587.587,0,0,0-.063-.392,3.784,3.784,0,0,1,3.315-5.61A.587.587,0,0,0,6.289,0,4.958,4.958,0,0,0,1.848,7.163a7.909,7.909,0,0,0,9.138,9.055.587.587,0,0,0-.2-1.158Z" transform="translate(0)"/><path d="M95.121,15.959a8,8,0,0,0,.123-1.4,7.914,7.914,0,0,0-7.9-7.9,8,8,0,0,0-1.228.095.587.587,0,1,0,.181,1.16,6.819,6.819,0,0,1,1.047-.081,6.738,6.738,0,0,1,6.73,6.731,6.833,6.833,0,0,1-.135,1.35.587.587,0,0,0,.043.364,3.75,3.75,0,0,1,.353,1.6,3.789,3.789,0,0,1-3.785,3.784.587.587,0,0,0,0,1.174,4.964,4.964,0,0,0,4.959-4.958A4.914,4.914,0,0,0,95.121,15.959Z" transform="translate(-77.688 -6.137)"/><path d="M74.829,65.947a1.8,1.8,0,0,0-.2-.891,1.727,1.727,0,0,0-.569-.6,3.709,3.709,0,0,0-.885-.4c-.341-.11-.733-.212-1.162-.3-.34-.079-.589-.139-.737-.181a2.4,2.4,0,0,1-.441-.171,1.044,1.044,0,0,1-.343-.262.552.552,0,0,1-.124-.362.683.683,0,0,1,.366-.578,1.739,1.739,0,0,1,.963-.24,1.547,1.547,0,0,1,.935.221,1.831,1.831,0,0,1,.5.616,1.613,1.613,0,0,0,.3.4.614.614,0,0,0,.4.121.674.674,0,0,0,.676-.654,1.191,1.191,0,0,0-.156-.564,1.812,1.812,0,0,0-.492-.552A2.66,2.66,0,0,0,73,61.116a4.146,4.146,0,0,0-1.21-.158,4.4,4.4,0,0,0-1.524.24,2.153,2.153,0,0,0-.99.685,1.64,1.64,0,0,0-.342,1.02,1.572,1.572,0,0,0,.324,1.008,2.2,2.2,0,0,0,.877.64,7.673,7.673,0,0,0,1.372.411c.4.084.732.166.979.242a1.527,1.527,0,0,1,.6.33.741.741,0,0,1,.231.564.857.857,0,0,1-.429.731,1.95,1.95,0,0,1-1.114.292,1.9,1.9,0,0,1-.8-.145,1.26,1.26,0,0,1-.475-.369,2.766,2.766,0,0,1-.314-.556,1.119,1.119,0,0,0-.287-.422.619.619,0,0,0-.412-.143.685.685,0,0,0-.494.183.582.582,0,0,0-.194.438,1.607,1.607,0,0,0,.323.908,2.4,2.4,0,0,0,.843.747,3.954,3.954,0,0,0,1.855.387,4.236,4.236,0,0,0,1.622-.284,2.332,2.332,0,0,0,1.039-.787A1.924,1.924,0,0,0,74.829,65.947Z" transform="translate(-62.182 -56.186)"/></g></svg>'
    );

    if (typeof $horario != 'undefined') {
      var $office_hours =
        '<div class="office-hours"><p class="title"><svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.143 16.143"><g transform="translate(-1143.5 -1316.804)"><g class="a" transform="translate(1143.5 1316.804)"><path class="b" d="M 8.071533203125 15.64306354522705 C 3.896573305130005 15.64306354522705 0.5000032186508179 12.24649333953857 0.5000032186508179 8.071533203125 C 0.5000032186508179 3.896573305130005 3.896573305130005 0.5000032186508179 8.071533203125 0.5000032186508179 C 12.24649333953857 0.5000032186508179 15.64306354522705 3.896573305130005 15.64306354522705 8.071533203125 C 15.64306354522705 12.24649333953857 12.24649333953857 15.64306354522705 8.071533203125 15.64306354522705 Z"/><path class="c" d="M 8.071533203125 1.000002861022949 C 4.172283172607422 1.000002861022949 1.000002861022949 4.172283172607422 1.000002861022949 8.071533203125 C 1.000002861022949 11.97078323364258 4.172283172607422 15.14306354522705 8.071533203125 15.14306354522705 C 11.97078323364258 15.14306354522705 15.14306354522705 11.97078323364258 15.14306354522705 8.071533203125 C 15.14306354522705 4.172283172607422 11.97078323364258 1.000002861022949 8.071533203125 1.000002861022949 M 8.071533203125 3.814697265625e-06 C 12.52931308746338 3.814697265625e-06 16.14306259155273 3.613753318786621 16.14306259155273 8.071533203125 C 16.14306259155273 12.52931308746338 12.52931308746338 16.14306259155273 8.071533203125 16.14306259155273 C 3.613753318786621 16.14306259155273 3.814697265625e-06 12.52931308746338 3.814697265625e-06 8.071533203125 C 3.814697265625e-06 3.613753318786621 3.613753318786621 3.814697265625e-06 8.071533203125 3.814697265625e-06 Z"/></g><rect width="0.897" height="4.933" rx="0.448" transform="translate(1151.123 1320.391)"/><rect width="0.897" height="4.933" rx="0.448" transform="translate(1156.28 1324.651) rotate(90)"/></g></svg>atendimento:</p><p>' +
        $horario +
        '</p></div>';
    }
    $('#cabecalho .contact').append($('#rodape .redes-sociais').clone());
    $('.support .contact').append($office_hours);

    $.ajax({
      url: '../',
      type: 'GET',
      success: function (res) {
        var headline = $(res).find('#rodape .visible-phone ul').html();
        var headlinesocial = $(res).find('#rodape .span3').html();
        $(
          'body.pagina-carrinho #cabecalho .support .support-items .contact'
        ).empty();
        $(
          'body.pagina-carrinho #cabecalho .support .support-items .contact'
        ).append(headline);
        $('.support .contact .fa-whatsapp').replaceWith(
          '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.371 16.372"><path d="M3.96,15.2a8.126,8.126,0,0,0,4.2,1.162,8.228,8.228,0,0,0,8.215-8.183,8.183,8.183,0,1,0-15.2,4.229L0,16.371ZM.965,8.183a7.189,7.189,0,1,1,3.323,6.1L4.1,14.161l-2.686.792.792-2.686-.118-.184A7.223,7.223,0,0,1,.965,8.183Zm0,0"/><path d="M121.239,96.377a7.229,7.229,0,0,0,5.8,5.8c.953.181,2.35.209,3.033-.474l.381-.381a1.018,1.018,0,0,0,0-1.44l-1.523-1.523a1.018,1.018,0,0,0-1.44,0l-.381.381a.677.677,0,0,1-.906,0l-1.519-1.583-.007-.007a.6.6,0,0,1,0-.845l.381-.381a1.017,1.017,0,0,0,0-1.44l-1.523-1.523a1.019,1.019,0,0,0-1.44,0l-.381.381h0A3.55,3.55,0,0,0,121.239,96.377Zm1.152-2.355c.4-.391.378-.4.422-.4a.059.059,0,0,1,.042.017c1.6,1.613,1.54,1.519,1.54,1.565a.058.058,0,0,1-.017.042l-.381.381a1.556,1.556,0,0,0,0,2.2l1.52,1.584.007.007a1.636,1.636,0,0,0,2.265,0l.381-.381a.059.059,0,0,1,.083,0c1.6,1.613,1.54,1.518,1.54,1.565a.057.057,0,0,1-.017.042l-.381.381a2.837,2.837,0,0,1-2.176.211,6.27,6.27,0,0,1-5.035-5.035A2.836,2.836,0,0,1,122.392,94.022Zm0,0" transform="translate(-117.254 -89.702)"/></svg>'
        );
        $('.support .contact .fa-envelope').replaceWith(
          '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.227 11.039"><g transform="translate(0 -38.529)"><path d="M41.35,68.654,36.1,73.285l-5.256-4.63a.5.5,0,1,0-.667.758l5.59,4.925a.5.5,0,0,0,.668,0l5.588-4.925a.5.5,0,1,0-.668-.757Z" transform="translate(-27.981 -27.98)"/><path d="M14.712,38.529H1.515A1.516,1.516,0,0,0,0,40.044v8.01a1.516,1.516,0,0,0,1.515,1.515h13.2a1.516,1.516,0,0,0,1.515-1.515v-8.01A1.516,1.516,0,0,0,14.712,38.529Zm.5,9.525a.505.505,0,0,1-.5.5H1.515a.505.505,0,0,1-.5-.5v-8.01a.505.505,0,0,1,.5-.5h13.2a.505.505,0,0,1,.5.5Z" transform="translate(0 0)"/></g></svg>'
        );
        $('.support .contact .icon-phone').replaceWith(
          '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.258 16.725"><g transform="translate(-2.95)"><path d="M112.4,2.191A7.431,7.431,0,0,0,107.11,0a.593.593,0,1,0,0,1.185,6.295,6.295,0,0,1,6.3,6.3.593.593,0,0,0,1.185,0A7.431,7.431,0,0,0,112.4,2.191Z" transform="translate(-95.383)"/><path d="M109.961,47.615a.593.593,0,0,0,1.185,0,4.042,4.042,0,0,0-4.037-4.037h0a.593.593,0,0,0,0,1.185A2.855,2.855,0,0,1,109.961,47.615Z" transform="translate(-95.383 -40.134)"/><path d="M13.267,39.823a1.789,1.789,0,0,0-1.584.948.593.593,0,1,0,.978.669c.261-.381.379-.441.539-.434a7.635,7.635,0,0,1,2.736,2,.613.613,0,0,1-.006.433,2.046,2.046,0,0,1-1.016,1.279,1.9,1.9,0,0,1-1.523-.051,16.752,16.752,0,0,1-5.5-3.578l0,0A16.749,16.749,0,0,1,4.323,35.6a1.9,1.9,0,0,1-.052-1.524A2.045,2.045,0,0,1,5.55,33.064a.612.612,0,0,1,.432-.006,7.649,7.649,0,0,1,2,2.731c.009.166-.052.284-.433.545a.593.593,0,0,0,.669.979,1.788,1.788,0,0,0,.948-1.586A7.256,7.256,0,0,0,6.4,31.947a1.792,1.792,0,0,0-1.224-.007,3.19,3.19,0,0,0-1.979,1.645,3.051,3.051,0,0,0,.031,2.465,17.928,17.928,0,0,0,3.832,5.881l.012.012a17.933,17.933,0,0,0,5.874,3.826,3.517,3.517,0,0,0,1.323.276,2.717,2.717,0,0,0,1.141-.245,3.19,3.19,0,0,0,1.645-1.979,1.793,1.793,0,0,0-.006-1.221A7.254,7.254,0,0,0,13.267,39.823Z" transform="translate(0 -29.32)"/></g></svg>'
        );
        $('.support .contact .fa-skype').replaceWith(
          '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.487 16.695"><g transform="translate(-1.33)"><path d="M10.788,15.06A6.736,6.736,0,0,1,3.037,7.176a.587.587,0,0,0-.063-.392,3.784,3.784,0,0,1,3.315-5.61A.587.587,0,0,0,6.289,0,4.958,4.958,0,0,0,1.848,7.163a7.909,7.909,0,0,0,9.138,9.055.587.587,0,0,0-.2-1.158Z" transform="translate(0)"/><path d="M95.121,15.959a8,8,0,0,0,.123-1.4,7.914,7.914,0,0,0-7.9-7.9,8,8,0,0,0-1.228.095.587.587,0,1,0,.181,1.16,6.819,6.819,0,0,1,1.047-.081,6.738,6.738,0,0,1,6.73,6.731,6.833,6.833,0,0,1-.135,1.35.587.587,0,0,0,.043.364,3.75,3.75,0,0,1,.353,1.6,3.789,3.789,0,0,1-3.785,3.784.587.587,0,0,0,0,1.174,4.964,4.964,0,0,0,4.959-4.958A4.914,4.914,0,0,0,95.121,15.959Z" transform="translate(-77.688 -6.137)"/><path d="M74.829,65.947a1.8,1.8,0,0,0-.2-.891,1.727,1.727,0,0,0-.569-.6,3.709,3.709,0,0,0-.885-.4c-.341-.11-.733-.212-1.162-.3-.34-.079-.589-.139-.737-.181a2.4,2.4,0,0,1-.441-.171,1.044,1.044,0,0,1-.343-.262.552.552,0,0,1-.124-.362.683.683,0,0,1,.366-.578,1.739,1.739,0,0,1,.963-.24,1.547,1.547,0,0,1,.935.221,1.831,1.831,0,0,1,.5.616,1.613,1.613,0,0,0,.3.4.614.614,0,0,0,.4.121.674.674,0,0,0,.676-.654,1.191,1.191,0,0,0-.156-.564,1.812,1.812,0,0,0-.492-.552A2.66,2.66,0,0,0,73,61.116a4.146,4.146,0,0,0-1.21-.158,4.4,4.4,0,0,0-1.524.24,2.153,2.153,0,0,0-.99.685,1.64,1.64,0,0,0-.342,1.02,1.572,1.572,0,0,0,.324,1.008,2.2,2.2,0,0,0,.877.64,7.673,7.673,0,0,0,1.372.411c.4.084.732.166.979.242a1.527,1.527,0,0,1,.6.33.741.741,0,0,1,.231.564.857.857,0,0,1-.429.731,1.95,1.95,0,0,1-1.114.292,1.9,1.9,0,0,1-.8-.145,1.26,1.26,0,0,1-.475-.369,2.766,2.766,0,0,1-.314-.556,1.119,1.119,0,0,0-.287-.422.619.619,0,0,0-.412-.143.685.685,0,0,0-.494.183.582.582,0,0,0-.194.438,1.607,1.607,0,0,0,.323.908,2.4,2.4,0,0,0,.843.747,3.954,3.954,0,0,0,1.855.387,4.236,4.236,0,0,0,1.622-.284,2.332,2.332,0,0,0,1.039-.787A1.924,1.924,0,0,0,74.829,65.947Z" transform="translate(-62.182 -56.186)"/></g></svg>'
        );

        $(
          'body.pagina-carrinho #cabecalho .support .support-items .contact'
        ).append(headlinesocial);
        $('body.pagina-carrinho .support .contact').append($office_hours);
      },
    });
  };

  LI.methods.addWishList = function () {
    $('<a class="adic-favo" href="#"></a>').prependTo('.listagem-item');
    $(
      '<div class="addwishlist"><a class="adic-favo" href="#"><span>adicionar &agrave wishlist</span></a></div>'
    ).insertAfter('.pagina-produto .acoes-produto .comprar');

    $('.listagem-item').each(function () {
      var codProd = $(this)
        .find('.info-produto .hide.trustvox-stars')
        .attr('data-trustvox-product-code');
      $(this)
        .find('.adic-favo')
        .attr('href', '/conta/favorito/' + codProd + '/adicionar');
    });

    $('.pagina-produto .produto').each(function () {
      var codProd = $(this)
        .find('.info-principal-produto .codigo-produto .trustvox-stars div')
        .attr('data-trustvox-product-code-js');
      $(this)
        .find('.adic-favo')
        .attr('href', '/conta/favorito/' + codProd + '/adicionar');
    });

    $(document).on('click', '.adic-favo', function (e) {
      e.preventDefault();

      var self = $('.adic-favo');
      var url = self.attr('href');

      $.post(url).done(function (data) {
        var res = JSON.parse(data);

        if (res.status === 'erro') {
          swal('Erro!', res.mensagem, 'error');
        } else {
          swal(
            'Produto adicionado!',
            'Produto adicionado com sucesso na sua lista de desejos!',
            'success'
          );
          self.addClass('added');
        }
      });
    });
  };

  LI.methods.buyOfShowcase = function () {
    function changeQuantity() {
      $(document).on('click', '.bt-qty', function () {
        var self = $(this);
        var initial = self.parent().siblings('input').val();
        var btn = self.parent().parent().siblings('.botao-comprar-ajax');
        var final = 1;

        if (self.hasClass('bt-plus') || self.hasClass('prod-bt-plus')) {
          final = parseFloat(initial) + 1;
        } else if (
          self.hasClass('bt-minus') ||
          self.hasClass('prod-bt-minus')
        ) {
          final = parseFloat(initial) - 1;
        }

        if (final < 1) {
          final = 1;
        }

        self.parent().siblings('input').val(final);
        self.parent().siblings('input').change();
        btn.attr(
          'href',
          btn.attr('href').replace(/adicionar.*/g, 'adicionar/' + final)
        );
      });
    }

    $('.listagem .acoes-produto').each(function () {
      if ($(this).find('.botao-comprar-ajax').length) {
        $(this).prepend(
          $(
            '<div class="prod-counter"><input type="number" min="1" value="01" class="qtd-prod"><div class="qtd-nav"><span class="bt-qty bt-plus"><i class="fas fa-plus"></i></span><span class="bt-qty bt-minus"><i class="fas fa-window-minimize"></i></span></div></div>'
          )
        );
      }
    });

    changeQuantity();
  };

  LI.methods.cartWithPrice = function () {
    $('.carrinho.span2').appendTo('.actions .cart');
    $('.actions .cart .carrinho').removeClass('span2');

    $('#cabecalho .actions .cart .carrinho').addClass('carrinho-manipula');
    $('#cabecalho .actions .cart .carrinho>a i').append(
      $(
        '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24.864" height="28.919" viewBox="0 0 24.864 28.919"><path id="Sacola" d="M42.364,37.291,40.452,20.46a.549.549,0,0,0-.574-.5H36.626V18.356a6.694,6.694,0,0,0-13.388,0v1.607H19.986a.579.579,0,0,0-.574.5L17.5,37.291v.076a3.249,3.249,0,0,0,3.251,3.251H39.113a3.249,3.249,0,0,0,3.251-3.251ZM25.151,18.356a4.782,4.782,0,0,1,9.563,0v1.607H25.151Zm-.956,8.76A1.913,1.913,0,1,1,26.107,25.2,1.894,1.894,0,0,1,24.194,27.116Zm11.476,0A1.913,1.913,0,1,1,37.583,25.2,1.894,1.894,0,0,1,35.67,27.116Z" transform="translate(-17.5 -11.7)" fill="#000000" /></svg> '
      )
    );

    // Modifica textos do carrinho vazio
    $('.titulo.vazio-text').html(
      '<span class="carrinho-vazio-titulo">minha sacola</span><span class="carrinho-vazio-preco">R$ 0,00</span>'
    );

    // Adiciona classe ao carrinho cheio
    $('.carrinho-manipula>a b').parent().addClass('carrinho-cheio');

    // Modifica texto carrinho cheio
    $('.carrinho-manipula .carrinho-cheio .titulo span').text('minha sacola');

    //Mover Quantida Carrinho Vazio
    $('.titulo.vazio-text').append($('<div></div>'));
    $('.carrinho-vazio-preco').appendTo('.titulo.vazio-text div');
    $('.carrinho-cheio').append($('<div></div>'));
    $('.carrinho-cheio span.cor-secundaria').appendTo('.carrinho-cheio div');
    $('.carrinho-manipula .qtd-carrinho').appendTo('.titulo.vazio-text div');

    //Mover Quantida Carrinho Cheio
    $('.carrinho-manipula .qtd-carrinho')
      .clone()
      .appendTo('.carrinho-cheio div');

    // Limpa o preço antigo
    $('.carrinho-manipula .carrinho-cheio div span').html('');

    // Clona o total
    $(
      '.carrinho-manipula .carrinho-rodape .carrinho-info .carrino-total strong'
    )
      .clone()
      .appendTo('.carrinho-manipula .carrinho-cheio div span');

    // Remove o strong clonado
    $strong = $('.carrinho-manipula .carrinho-cheio div span strong');
    $strong.replaceWith($strong.html());

    // Remove span2 carrinho interno
    $('#cabecalho .carrinho .carrinho-interno').removeClass('span2');

    // Atualiza preço carrinho
    $(document).click(function () {
      setTimeout(function () {
        // Limpa o preço antigo
        $('.carrinho-manipula .carrinho-cheio div span').html('');

        // Clona o total
        $(
          '.carrinho-manipula .carrinho-rodape .carrinho-info .carrino-total strong'
        )
          .clone()
          .appendTo('.carrinho-manipula .carrinho-cheio div span');

        // Remove o strong clonado
        $strong = $('.carrinho-manipula .carrinho-cheio div span strong');
        $strong.replaceWith($strong.html());
      }, 2250);
    });
  };

  LI.methods.showcase = function () {
    if (!$('.listagem').length) {
      return;
    }

    $('.listagem-linha').each(function () {
      if ($(this).hasClass('flexslider')) {
        var html = $(this).find('ul').html();
        $(this).find('.flex-viewport').remove();
        $(this).find('.flex-direction-nav').remove();
        $(this).append("<ul class='slick-product'>" + html + '</ul>');
      } else {
        $(this).find('li').unwrap().unwrap();
      }
    });

    function hasZoom() {
      $('.slick-product .has-zoom').each(function () {
        var urlIMage = $(this)
          .find('.imagem-principal')
          .attr('data-imagem-caminho');
        $(this).append(
          '<img src="' + urlIMage + '" class="imagem-zoom" alt="zoom">'
        );
      });
    }

    var prev =
      '<div class="slick-prev"><svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.446 20.079"><g transform="translate(108.584 20.079) rotate(180)"><path d="M108.173,11.033l-8.634,8.633a1.406,1.406,0,0,1-1.989-1.988l7.639-7.639L97.55,2.4A1.406,1.406,0,1,1,99.539.412l8.634,8.634a1.406,1.406,0,0,1,0,1.988Z" transform="translate(0 0)"/></g></svg></div>';
    var next =
      '<div class="slick-next"><svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.446 20.079"><g transform="translate(-97.138 0)"><path d="M108.173,11.033l-8.634,8.633a1.406,1.406,0,0,1-1.989-1.988l7.639-7.639L97.55,2.4A1.406,1.406,0,1,1,99.539.412l8.634,8.634a1.406,1.406,0,0,1,0,1.988Z" transform="translate(0 0)"/></g></svg></div>';

    $('.listagem-linha .slick-product').slick({
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 4,
      speed: 250,
      dots: false,
      afterChange: hasZoom(),
      prevArrow: prev,
      nextArrow: next,

      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  };

  LI.methods.fullMenu = function () {
    $('#cabecalho .conteiner').after($('.menu.superior').clone());
    $('#cabecalho .conteiner .menu.superior').attr(
      'class',
      'menu superior visible-phone'
    );
    $('#cabecalho > .menu.superior').attr('class', 'full menu hidden-phone');
    $('.full.menu .nivel-um').wrap("<div class='conteiner'></div>");
    $('.full.menu .nivel-um').removeClass('row-fluid');
  };

  LI.methods.widthMenu = function () {
    var lm = $('.full.menu').find('ul.nivel-um').find('>li');
    var l = lm.length;
    var r = 100 / l;
    lm.css('width', r + '%');
  };

  LI.methods.toggleMenu = function () {
    $(
      '<button class="open-menu"><svg class="icon1" xmlns="http://www.w3.org/2000/svg" width="25.199" height="21" viewBox="0 0 25.199 21"><path id="menu-flut" d="M1.4,21A1.4,1.4,0,0,1,0,19.6V18.2a1.4,1.4,0,0,1,1.4-1.4H12.6A1.4,1.4,0,0,1,14,18.2v1.4A1.4,1.4,0,0,1,12.6,21Zm0-8.4A1.4,1.4,0,0,1,0,11.2V9.8A1.4,1.4,0,0,1,1.4,8.4H23.8a1.4,1.4,0,0,1,1.4,1.4v1.4a1.4,1.4,0,0,1-1.4,1.4Zm0-8.4A1.4,1.4,0,0,1,0,2.8V1.4A1.4,1.4,0,0,1,1.4,0H23.8a1.4,1.4,0,0,1,1.4,1.4V2.8a1.4,1.4,0,0,1-1.4,1.4Z" fill="#3b3b3b"/></svg><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="icon2 svg-inline--fa fa-times fa-w-11" role="img" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>menu</button>'
    ).insertBefore($('#cabecalho .busca'));

    $('.open-menu').on({
      click: function () {
        $(this).toggleClass('active');
        $('.full.menu').toggleClass('active');
      },
    });
  };

  LI.methods.mobileMenu = function () {
    $('#cabecalho .menu.superior.visible-phone').append(
      $("<button class='menu-close'></button>")
    );
    $('.atalho-menu').click(function () {
      $('#cabecalho .menu.superior.visible-phone').addClass('menu-active');
    });

    $('#cabecalho .menu.superior.visible-phone > ul.nivel-um').wrap(
      "<div class='wrap'></div>"
    );
    $('#cabecalho .menu.superior.visible-phone .wrap').append(
      $(
        "<ul class='action-links'><li><a href='/conta/index'>Minha Conta<a></li><li><a href='/carrinho/index'>Meu Carrinho<a></li></ul>"
      )
    );

    $('.menu-close').click(function () {
      $('#cabecalho .menu.superior.visible-phone').removeClass('menu-active');
      $('#cabecalho .menu.superior.visible-phone ul.nivel-um').removeClass(
        'active'
      );
    });

    $('.menu.superior.visible-phone .nivel-um > li.com-filho > a > i').click(
      function (e) {
        e.preventDefault();
        $(this).parent().next().toggleClass('active');
      }
    );

    $('.menu.superior.visible-phone .nivel-dois > li.com-filho > a > i').click(
      function (e) {
        e.preventDefault();
        $(this).parent().next().toggleClass('active');
      }
    );
  };

  LI.methods.otherCategories = function () {
    var limiter = 9;
    var countLI = $('.full.menu .nivel-um > li').length;
    $('.full.menu .nivel-um > li').length > 1 &&
      ($('.full.menu .conteiner .nivel-um>li:nth-child(1)').before(
        '<li class="all-categories com-filho"><a href="#"><strong class="titulo"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="15" viewBox="0 0 18 15"><path d="M1,15a1,1,0,0,1-1-1V13a1,1,0,0,1,1-1H9a1,1,0,0,1,1,1v1a1,1,0,0,1-1,1ZM1,9A1,1,0,0,1,0,8V7A1,1,0,0,1,1,6H17a1,1,0,0,1,1,1V8a1,1,0,0,1-1,1ZM1,3A1,1,0,0,1,0,2V1A1,1,0,0,1,1,0H17a1,1,0,0,1,1,1V2a1,1,0,0,1-1,1Z" fill="#505050"/></svg> Todas as Categorias<strong></strong></strong></a><ul class="nivel-dois"></ul></li>'
      ),
      $(
        '.full.menu .conteiner .nivel-um>li.all-categories.com-filho>ul.nivel-dois'
      ).append($('.menu.superior .nivel-um>li').clone()));

    if (countLI > limiter) {
      var li = $('.full.menu .nivel-um > li').slice(limiter).detach();
      $('.full.menu .nivel-um').append(
        $(
          "<li class='other-categories com-filho'><a href='#'><strong class='titulo'>Outros<strong></a><ul class='nivel-dois'></ul></li>"
        )
      );
      $('.full.menu .nivel-um > li.other-categories > .nivel-dois').append(
        $(li)
      );
    }
  };

  LI.methods.fixedHeader = function () {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 20 && !$('body').hasClass('pagina-carrinho')) {
        $('#cabecalho').addClass('fixed');
      } else {
        $('#cabecalho').removeClass('fixed');
      }
    });
  };

  LI.methods.fixedSearch = function () {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 20 && !$('body').hasClass('pagina-carrinho')) {
        $('.busca-mobile').addClass('fixed');
      } else {
        $('.busca-mobile').removeClass('fixed');
      }
    });
  };

  LI.methods.sizeTable = function () {
    if (typeof $tabela_medidas !== 'undefined') {
      var table =
        '<div class="size-table"><button class="open-table"><svg class="icon" xmlns="http://www.w3.org/2000/svg" width="18.575" height="18.575" viewBox="0 0 18.575 18.575"><path id="medidas-table" d="M-2040.441-62.425a.557.557,0,0,1-.558-.558V-77.417a.558.558,0,0,1,.344-.516.559.559,0,0,1,.608.121l14.435,14.435a.557.557,0,0,1,.121.608.558.558,0,0,1-.516.345Zm2.489-8.983a.559.559,0,0,0-.345.516v5.207a.558.558,0,0,0,.558.558h5.207a.558.558,0,0,0,.516-.344.557.557,0,0,0-.121-.608l-5.207-5.207a.557.557,0,0,0-.395-.163A.559.559,0,0,0-2037.953-71.408Zm12.281,6.277-12.622-12.622a.558.558,0,0,1,0-.789l2.3-2.294a.558.558,0,0,1,.789,0l1.008,1.007-1.542,1.543a.557.557,0,0,0,0,.789.555.555,0,0,0,.394.163.554.554,0,0,0,.394-.163l1.543-1.543.613.614-1.071,1.07a.56.56,0,0,0,0,.79.557.557,0,0,0,.4.163.56.56,0,0,0,.394-.163l1.071-1.072.614.614-1.543,1.542a.558.558,0,0,0,0,.789.558.558,0,0,0,.4.164.557.557,0,0,0,.394-.164l1.543-1.542.613.613-1.071,1.071a.558.558,0,0,0,0,.789.556.556,0,0,0,.394.163.556.556,0,0,0,.4-.163l1.071-1.071.613.613-1.542,1.543a.556.556,0,0,0,0,.788.552.552,0,0,0,.394.164.552.552,0,0,0,.394-.164l1.543-1.542.613.613-1.071,1.071a.558.558,0,0,0,0,.789.557.557,0,0,0,.4.164.557.557,0,0,0,.394-.164l1.071-1.071.613.614-1.542,1.542a.558.558,0,0,0,0,.789.557.557,0,0,0,.394.164.558.558,0,0,0,.4-.164l1.542-1.543.613.614-1.071,1.071a.558.558,0,0,0,0,.789.556.556,0,0,0,.4.163.555.555,0,0,0,.394-.163l1.071-1.071,1.008,1.007a.558.558,0,0,1,0,.789l-2.3,2.295a.557.557,0,0,1-.394.164A.559.559,0,0,1-2025.672-65.131Z" transform="translate(2041 81)" fill="#000000"/></svg>GUIA DE MEDIDAS</button></div>';
      $(table).insertAfter($('.pagina-produto .comprar'));

      $(document).on('click', '.open-table', function () {
        $.fancybox({
          autoScale: true,
          transitionIn: 'fade',
          transitionOut: 'fade',
          type: 'image',
          href: $tabela_medidas,
        });
      });
    }
  };

  LI.methods.video = function () {
    if (typeof $video !== 'undefined') {
      var id = $video.split('v=')[1].toString();
      var iframe =
        '<div id="video"><div class="video-container"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/' +
        id +
        '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div></div>';
      $(iframe).insertBefore($('.listagem .titulo-categoria.vitrine-destaque'));
    }
  };

  LI.methods.instagram = function () {
    if (
      $('.pagina-inicial, .pagina-categoria, .pagina-produto, .pagina-busca')
        .length
    ) {
      if ($('#rodape .icon-instagram').length) {
        var instafooter = $('#rodape .lista-redes .icon-instagram')
          .parent()
          .attr('href');
        var instagalery = instafooter.split('/').pop();

        var t =
          "<div id='instagram'><div class='conteiner'><h2><span><svg class='icon' xmlns='http://www.w3.org/2000/svg' viewBox='-8700.68 2378.321 32.422 32.421'><path id='Union_72' data-name='Union 72' class='cls-1' d='M7835.447-3201.945a8.957,8.957,0,0,1-8.947-8.947v-14.528a8.957,8.957,0,0,1,8.947-8.946h14.526a8.957,8.957,0,0,1,8.949,8.946v14.528a8.957,8.957,0,0,1-8.949,8.947Zm-6.071-23.475v14.528a6.077,6.077,0,0,0,6.071,6.069h14.528a6.075,6.075,0,0,0,6.069-6.069v-14.528a6.079,6.079,0,0,0-6.071-6.071h-14.526A6.078,6.078,0,0,0,7829.376-3225.42Zm4.98,7.264a8.364,8.364,0,0,1,8.355-8.355,8.363,8.363,0,0,1,8.353,8.355,8.361,8.361,0,0,1-8.353,8.353A8.362,8.362,0,0,1,7834.356-3218.156Zm2.877,0a5.483,5.483,0,0,0,5.478,5.477,5.484,5.484,0,0,0,5.477-5.477,5.484,5.484,0,0,0-5.477-5.477A5.483,5.483,0,0,0,7837.233-3218.156Zm12.692-7.191a2.128,2.128,0,0,1-.622-1.493,2.114,2.114,0,0,1,.622-1.491,2.116,2.116,0,0,1,1.489-.617,2.127,2.127,0,0,1,1.493.617,2.118,2.118,0,0,1,.617,1.491,2.132,2.132,0,0,1-.617,1.493,2.138,2.138,0,0,1-1.493.617A2.123,2.123,0,0,1,7849.926-3225.347Z' transform='translate(-16527.18 5612.687)' /></svg>siga-nos no instagram</span><a href='https://instagram.com/" +
          instagalery +
          "' target='blank'>@" +
          instagalery +
          "</a></h2><div class='galeria'></div></div></div>";

        $('.pagina-inicial .sobre-loja-rodape').length
          ? $(t).insertAfter($('#testimonials'))
          : $(t).insertAfter($('#corpo .secao-secundaria'));

        $(window).on('load', function () {
          $.instagramFeed({
            username: instagalery,
            container: '#instagram .galeria',
            display_profile: false,
            display_biography: false,
            display_igtv: false,
            items: 6,
          });

          $('#instagram .instagram_gallery ul').slick({
            infinite: true,
            slidesToShow: 6,
            slidesToScroll: 6,
            dots: false,
            arrows: false,

            responsive: [
              {
                breakpoint: 767,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                },
              },
            ],
          });
        });
      }
    }
  };

  LI.methods.share = function () {
    var share = "<div class='sharethis-inline-share-buttons'></div>";
    var src =
      '//platform-api.sharethis.com/js/sharethis.js#property=5991eb27770096001434ea7d&product=inline-share-buttons';
    $('body.pagina-produto div.principal').after($(share));
    $('.sharethis-inline-share-buttons').append(
      $('<script>', {
        src: src,
      })
    );
  };

  LI.methods.tabs = function () {
    $('ul.tabs li').click(function () {
      var tab_id = $(this).attr('data-tab');

      $('ul.tabs li').removeClass('current');
      $('.tab-content').removeClass('current');

      $(this).addClass('current');
      $('#' + tab_id).addClass('current');
    });
  };

  LI.methods.tracking = function () {
    $('.tracking').append(
      $(
        '<form class="form-tracking"> <span> <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.5 14"><path d="M65.9,0a5.25,5.25,0,0,0-4.2,8.4L65.9,14l4.2-5.6A5.25,5.25,0,0,0,65.9,0Zm0,8.75a3.5,3.5,0,1,1,3.5-3.5A3.5,3.5,0,0,1,65.9,8.75Z" transform="translate(-60.651)"/></svg> Rastreie seu pedido: </span> <div class="wrapp"><input type="text" placeholder="Digite seu codigo" required><button class="btn-tracking"><svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2,7A4.951,4.951,0,0,1,7,2a4.951,4.951,0,0,1,5,5,4.951,4.951,0,0,1-5,5A4.951,4.951,0,0,1,2,7Zm12.3,8.7a.99.99,0,0,0,1.4-1.4l-3.1-3.1A6.847,6.847,0,0,0,14,7,6.957,6.957,0,0,0,7,0,6.957,6.957,0,0,0,0,7a6.957,6.957,0,0,0,7,7,6.847,6.847,0,0,0,4.2-1.4Z"/></svg></button></div></form>'
      )
    );

    $('.btn-tracking').click(function (e) {
      e.preventDefault();
      var trackingCod = $('.form-tracking input').val();
      var url =
        'https://rastreamentocorreios.info/consulta/' + trackingCod + '';

      window.open(url, 'blank');
    });
  };

  LI.methods.scrollToTop = function () {
    var scroll =
      "<a href='#' class='scrollToTop'><i class='fa fa-angle-up' aria-hidden='true'></i><span>Topo</span></a>";
    $('body').append(scroll);
    $(window).scroll(function () {
      $(this).scrollTop() > 100
        ? $('.scrollToTop').fadeIn()
        : $('.scrollToTop').fadeOut();
    });

    $('.scrollToTop').click(function () {
      $('html, body').animate(
        {
          scrollTop: 0,
        },
        800
      );
      return false;
    });
  };

  LI.methods.freeShipping = function () {
    if (typeof $frete_gratis !== 'undefined') {
      function calculateShipping(total, minimumPrice) {
        total = total.replace('R$', '').replace(',', '.');
        return minimumPrice - Number(total);
      }

      function formatResult(result) {
        return 'R$ ' + result.toFixed(2).replace('.', ',').toString();
      }

      function messageResult(result) {
        return (
          '<span class="free-shipping warning"><svg version="1.1" class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g><path d="M119.467,337.067c-28.237,0-51.2,22.963-51.2,51.2c0,28.237,22.963,51.2,51.2,51.2s51.2-22.963,51.2-51.2C170.667,360.03,147.703,337.067,119.467,337.067z M119.467,422.4c-18.825,0-34.133-15.309-34.133-34.133c0-18.825,15.309-34.133,34.133-34.133s34.133,15.309,34.133,34.133C153.6,407.091,138.291,422.4,119.467,422.4z"/></g></g><g><g><path d="M409.6,337.067c-28.237,0-51.2,22.963-51.2,51.2c0,28.237,22.963,51.2,51.2,51.2c28.237,0,51.2-22.963,51.2-51.2C460.8,360.03,437.837,337.067,409.6,337.067z M409.6,422.4c-18.825,0-34.133-15.309-34.133-34.133c0-18.825,15.309-34.133,34.133-34.133c18.825,0,34.133,15.309,34.133,34.133C443.733,407.091,428.425,422.4,409.6,422.4z"/></g></g><g><g><path d="M510.643,289.784l-76.8-119.467c-1.57-2.441-4.275-3.917-7.177-3.917H332.8c-4.719,0-8.533,3.823-8.533,8.533v213.333c0,4.719,3.814,8.533,8.533,8.533h34.133v-17.067h-25.6V183.467h80.674l72.926,113.442v82.825h-42.667V396.8h51.2c4.719,0,8.533-3.814,8.533-8.533V294.4C512,292.77,511.531,291.157,510.643,289.784z"/></g></g><g><g><path d="M375.467,277.333V217.6h68.267v-17.067h-76.8c-4.719,0-8.533,3.823-8.533,8.533v76.8c0,4.719,3.814,8.533,8.533,8.533h128v-17.067H375.467z"/></g></g><g><g><path d="M332.8,106.667H8.533C3.823,106.667,0,110.49,0,115.2v273.067c0,4.719,3.823,8.533,8.533,8.533H76.8v-17.067H17.067v-256h307.2v256H162.133V396.8H332.8c4.719,0,8.533-3.814,8.533-8.533V115.2C341.333,110.49,337.519,106.667,332.8,106.667z"/></g></g><g><g><rect x="8.533" y="345.6" width="51.2" height="17.067"/></g></g><g><g><rect x="179.2" y="345.6" width="145.067" height="17.067"/></g></g><g><g><rect x="469.333" y="345.6" width="34.133" height="17.067"/></g></g><g><g><rect x="34.133" y="140.8" width="298.667" height="17.067"/></g></g><g><g><rect x="110.933" y="379.733" width="17.067" height="17.067"/></g></g><g><g><rect x="401.067" y="379.733" width="17.067" height="17.067"/></g></g><g><g><rect x="34.133" y="72.533" width="119.467" height="17.067"/></g></g><g><g><rect y="72.533" width="17.067" height="17.067"/></g></g><g></svg>Ol&aacute, faltam apenas <em>' +
          result +
          '</em> de compras para voc&ecirc aproveitar o frete gr&aacutetis!</span>'
        );
      }

      function messageFreeShipping() {
        return '<span class="free-shipping success"><svg version="1.1" class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g><path d="M119.467,337.067c-28.237,0-51.2,22.963-51.2,51.2c0,28.237,22.963,51.2,51.2,51.2s51.2-22.963,51.2-51.2C170.667,360.03,147.703,337.067,119.467,337.067z M119.467,422.4c-18.825,0-34.133-15.309-34.133-34.133c0-18.825,15.309-34.133,34.133-34.133s34.133,15.309,34.133,34.133C153.6,407.091,138.291,422.4,119.467,422.4z"/></g></g><g><g><path d="M409.6,337.067c-28.237,0-51.2,22.963-51.2,51.2c0,28.237,22.963,51.2,51.2,51.2c28.237,0,51.2-22.963,51.2-51.2C460.8,360.03,437.837,337.067,409.6,337.067z M409.6,422.4c-18.825,0-34.133-15.309-34.133-34.133c0-18.825,15.309-34.133,34.133-34.133c18.825,0,34.133,15.309,34.133,34.133C443.733,407.091,428.425,422.4,409.6,422.4z"/></g></g><g><g><path d="M510.643,289.784l-76.8-119.467c-1.57-2.441-4.275-3.917-7.177-3.917H332.8c-4.719,0-8.533,3.823-8.533,8.533v213.333c0,4.719,3.814,8.533,8.533,8.533h34.133v-17.067h-25.6V183.467h80.674l72.926,113.442v82.825h-42.667V396.8h51.2c4.719,0,8.533-3.814,8.533-8.533V294.4C512,292.77,511.531,291.157,510.643,289.784z"/></g></g><g><g><path d="M375.467,277.333V217.6h68.267v-17.067h-76.8c-4.719,0-8.533,3.823-8.533,8.533v76.8c0,4.719,3.814,8.533,8.533,8.533h128v-17.067H375.467z"/></g></g><g><g><path d="M332.8,106.667H8.533C3.823,106.667,0,110.49,0,115.2v273.067c0,4.719,3.823,8.533,8.533,8.533H76.8v-17.067H17.067v-256h307.2v256H162.133V396.8H332.8c4.719,0,8.533-3.814,8.533-8.533V115.2C341.333,110.49,337.519,106.667,332.8,106.667z"/></g></g><g><g><rect x="8.533" y="345.6" width="51.2" height="17.067"/></g></g><g><g><rect x="179.2" y="345.6" width="145.067" height="17.067"/></g></g><g><g><rect x="469.333" y="345.6" width="34.133" height="17.067"/></g></g><g><g><rect x="34.133" y="140.8" width="298.667" height="17.067"/></g></g><g><g><rect x="110.933" y="379.733" width="17.067" height="17.067"/></g></g><g><g><rect x="401.067" y="379.733" width="17.067" height="17.067"/></g></g><g><g><rect x="34.133" y="72.533" width="119.467" height="17.067"/></g></g><g><g><rect y="72.533" width="17.067" height="17.067"/></g></g><g></svg>Parab&eacutens! Sua compra ser&aacute realizada com frete gr&aacutetis!</span>';
      }

      function writeMessage(el, message) {
        $(message).insertBefore(el);
      }

      var minimumPrice = $frete_gratis;
      var total = $('.pagina-carrinho .subtotal strong').text();
      var result = calculateShipping(total, minimumPrice);
      var message = '';
      var el = $('.pagina-carrinho .tabela-carrinho');

      if (result < minimumPrice && result > 0) {
        message = messageResult(formatResult(result));
      } else {
        message = messageFreeShipping();
      }

      writeMessage(el, message);
    }
  };

  LI.methods.copyright = function () {
    $(
      '#rodape div:last-child .span9.span12 + div,#rodape div:last-child .span9.span12 + div + div '
    ).remove('');
    $('#rodape div:last-child > .conteiner > .row-fluid').append(
      '<div class="cr conteiner" style="opacity:1!important;display:block!important;visibility:visible!important;margin:0 auto!important;margin-top:20px!important;position:static!important;text-align:center!important;overflow:visible!important;padding:7px 0px!important;"><div>'
    );
    $('.cr.conteiner').append(
      '<div id="cr-chicle-theme" style="opacity:1!important;display:inline-block!important;visibility:visible!important;margin:0!important;position:static!important;overflow:visible!important;padding:0 10px 2px 0px!important;"><a href="https://globecommerce.com.br/" rel="nofollow" title="Globe Theme Templates Loja Virtual" target="_blank" style="opacity:1!important;display:inline-block!important;visibility:visible!important;margin:0!important;position:static!important;overflow:visible!important;float:right!important;"><img src="https://cdn.awsli.com.br/947/947207/arquivos/globe-logo2.png" alt="Globe Theme Templates Loja Virtual" style="opacity:1!important;display:inline-block!important;visibility:visible!important;margin:0!important;position:static!important;overflow:visible!important;max-width: 150px;"></a></div></div>'
    );
    $('.cr.conteiner').append(
      '<div id="cr-li" style="opacity:1!important;display:inline-block!important;visibility:visible!important;margin:0!important;position:static!important;overflow:visible!important;padding:0 15px 5px 0px!important;"><a href="https://lojaintegrada.com.br/" target="_blank" title="Loja Integrada" style="opacity:1!important;display:inline-block!important;visibility:visible!important;margin:0!important;position:static!important;overflow:visible!important;float:right!important;"><img src="https://cdn.awsli.com.br/947/947207/arquivos/loja-integrada.png" title="Loja Integrada" alt="Loja Integrada" style="opacity:1!important;display:inline-block!important;visibility:visible!important;margin:0!important;position:static!important;overflow:visible!important;max-width: 140px;"></a></div>'
    );
    $('head').append(
      $(
        '<style>@media screen and (max-width:767px){.span9.span12 p{margin-bottom:-25px!important}}.span9.span12 p{padding:5px 0 15px 0}</style>'
      )
    );
  };

  LI.methods.fullbannerMobile = function () {
    var render = function (params, el) {
      var output =
        '<div><a href="' +
        params.href +
        '"><img src="' +
        params.src +
        '" alt="' +
        params.alt +
        '" title="' +
        params.title +
        '"></a></div>';
      $(el).append(output);
    };

    if (typeof $banners_mobile !== 'undefined') {
      $('<div id="fullbanner-mob" class="fullbanner-mob"></div>').insertBefore(
        '.pagina-inicial .secao-banners'
      );

      $banners_mobile.forEach(function (banner) {
        render(banner, $('#fullbanner-mob'));
      });

      $('#fullbanner-mob').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 250,
        dots: true,
        arrows: false,
      });
    }
  };

  LI.methods.floatIcons = function () {
    if (!$('body').hasClass('pagina-carrinho')) {
      $whats = $('.contact .tel-whatsapp a').length
        ? $('.contact .tel-whatsapp a').attr('href')
        : undefined;
      $skype = $('.contact .tel-skype a').length
        ? $('.contact .tel-skype a').attr('href')
        : undefined;
      $messenger = $('.lista-redes .icon-facebook').length
        ? $('.lista-redes .icon-facebook')
            .closest('a')
            .attr('href')
            .replace(window.location.protocol + '//facebook.com/', '')
        : undefined;

      var $icons =
        '<div class="float-contact"> <ul class="float-items"> <li class="float-modal"> <a href="#modalContato" data-toggle="modal" data-target="#modalContato"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.101 29.151"> <g transform="translate(0 0)"> <path class="a" d="M3.313,29.151a3.187,3.187,0,0,1-2.339-.973A3.186,3.186,0,0,1,0,25.838V9.4a11,11,0,0,0,2.091,1.8q7.5,5.094,10.291,7.143,1.179.869,1.914,1.356a11.8,11.8,0,0,0,1.957.994,5.968,5.968,0,0,0,2.277.507h.042a5.961,5.961,0,0,0,2.277-.507,11.785,11.785,0,0,0,1.957-.994q.735-.486,1.915-1.356Q28.24,15.8,35.031,11.2A11.4,11.4,0,0,0,37.1,9.4V25.838a3.321,3.321,0,0,1-3.312,3.312Zm15.238-10.6H18.53a3.29,3.29,0,0,1-1.035-.186,6.273,6.273,0,0,1-1.19-.558q-.632-.372-1.077-.673t-1.118-.786q-.674-.487-.88-.632-1.885-1.325-5.424-3.778T3.561,8.986A10.266,10.266,0,0,1,1.139,6.594,4.836,4.836,0,0,1,0,3.768,4.177,4.177,0,0,1,.859,1.077,2.957,2.957,0,0,1,3.313,0H33.789a3.2,3.2,0,0,1,2.329.973A3.173,3.173,0,0,1,37.1,3.312a5.47,5.47,0,0,1-1.014,3.126,9.828,9.828,0,0,1-2.526,2.546q-7.783,5.4-9.689,6.729-.207.145-.88.632t-1.118.786q-.446.3-1.077.673a6.245,6.245,0,0,1-1.19.558,3.285,3.285,0,0,1-1.035.186Z" /> </g> </svg> </a> </li> <li class="float-skype"> <a href="' +
        $skype +
        '" title="skype" target="_blank"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.102 37.101"> <g transform="translate(0 0)"> <path class="a" d="M26.841,37.1a10.277,10.277,0,0,1-4.853-1.2,18.317,18.317,0,0,1-3.242.292,17.706,17.706,0,0,1-12.512-5.11A17.279,17.279,0,0,1,1.409,15.237a10.013,10.013,0,0,1,1.6-12.274A10.373,10.373,0,0,1,15.722,1.552,18.114,18.114,0,0,1,18.748,1.3,17.707,17.707,0,0,1,31.261,6.407a17.3,17.3,0,0,1,4.774,16.084A9.9,9.9,0,0,1,37.1,26.985,10.2,10.2,0,0,1,26.841,37.1ZM10.9,21.394a2.614,2.614,0,0,0-1.848.677,2.169,2.169,0,0,0-.737,1.644,5.489,5.489,0,0,0,1.132,3.154,8.234,8.234,0,0,0,2.912,2.55A13.655,13.655,0,0,0,18.7,30.731a14.608,14.608,0,0,0,5.528-.962,8.03,8.03,0,0,0,3.6-2.687,6.567,6.567,0,0,0,1.241-3.892,6.174,6.174,0,0,0-.718-3.075,6.023,6.023,0,0,0-1.994-2.075,12.576,12.576,0,0,0-3.032-1.362c-1.169-.37-2.485-.71-3.911-1.01-1.052-.239-1.921-.449-2.449-.593a7.965,7.965,0,0,1-1.424-.545,3.162,3.162,0,0,1-1.056-.791,1.517,1.517,0,0,1-.355-1.014,1.989,1.989,0,0,1,1.1-1.672,5.592,5.592,0,0,1,3.065-.747,5.044,5.044,0,0,1,2.957.67,5.814,5.814,0,0,1,1.589,1.939A5.665,5.665,0,0,0,23.891,14.3a2.255,2.255,0,0,0,1.523.468,2.456,2.456,0,0,0,1.819-.747,2.354,2.354,0,0,0,.726-1.683,4.157,4.157,0,0,0-.555-1.989,6.258,6.258,0,0,0-1.72-1.908,9.154,9.154,0,0,0-2.921-1.436,14.178,14.178,0,0,0-4.13-.538,15.209,15.209,0,0,0-5.192.8A7.438,7.438,0,0,0,10,9.628a5.617,5.617,0,0,0-1.2,3.529,5.414,5.414,0,0,0,1.146,3.5,7.656,7.656,0,0,0,3.039,2.191,25.8,25.8,0,0,0,4.638,1.368c1.322.273,2.414.539,3.246.792a4.878,4.878,0,0,1,1.888,1.03,2.134,2.134,0,0,1,.681,1.653,2.546,2.546,0,0,1-1.31,2.178,6.3,6.3,0,0,1-3.564.916A6.205,6.205,0,0,1,16,26.333,3.944,3.944,0,0,1,14.511,25.2,8.567,8.567,0,0,1,13.5,23.423a4.032,4.032,0,0,0-1.037-1.5A2.369,2.369,0,0,0,10.9,21.394Z" transform="translate(0)" /> </g> </svg> </a> </li> <li class="float-whats"> <a href="' +
        $whats +
        '" title="Whatsapp" target="_blank"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.1 37.101"> <g transform="translate(0)"> <path class="a" d="M18.554,37.1a18.427,18.427,0,0,1-10.2-3.066l-7.13,2.279,2.312-6.892A18.349,18.349,0,0,1,0,18.551,18.569,18.569,0,0,1,18.545,0h.009a18.551,18.551,0,0,1,0,37.1ZM11.565,8.485a2.689,2.689,0,0,0-1.9.665L9.62,9.2a5.93,5.93,0,0,0-1.848,4.465,9.615,9.615,0,0,0,2.177,5.561l.026.035c.021.027.059.083.117.167a22.02,22.02,0,0,0,9.118,7.991,15.781,15.781,0,0,0,5.433,1.519,4.811,4.811,0,0,0,1.065-.124c1.445-.311,3.2-1.376,3.641-2.617a4.645,4.645,0,0,0,.318-2.574c-.106-.183-.352-.3-.726-.481-.1-.046-.2-.1-.311-.152-.031-.016-3.148-1.564-3.7-1.756a1.342,1.342,0,0,0-.471-.094,1.035,1.035,0,0,0-.86.5l-.216.3a17.839,17.839,0,0,1-1.234,1.618,1.046,1.046,0,0,1-.775.314,1.4,1.4,0,0,1-.532-.108l-.167-.068a13.66,13.66,0,0,1-4.184-2.615,16.3,16.3,0,0,1-3.009-3.741.856.856,0,0,1,.2-1.138l.015-.017c.158-.2.314-.362.465-.522l0,0,0,0c.109-.116.221-.235.335-.366l.05-.057a3,3,0,0,0,.551-.794,1.1,1.1,0,0,0-.079-1c-.09-.19-.638-1.519-1.122-2.692l-.025-.06c-.2-.49-.389-.944-.521-1.261-.354-.847-.617-.893-1.178-.916l-.063,0C11.958,8.494,11.77,8.485,11.565,8.485Z" transform="translate(0 0)" /> </g> </svg> </a> </li> <li class="float-messenger"> <a href="https://m.me/' +
        $messenger +
        '" title="Messenger" target="_blank"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.099 37.101"> <g transform="translate(0 0)"> <path class="a" d="M6.957,37.1a.774.774,0,0,1-.774-.772V31.011A17.418,17.418,0,0,1,0,17.78,18.2,18.2,0,0,1,18.184,0c.12,0,.243,0,.366,0s.246,0,.366,0A18.2,18.2,0,0,1,37.1,17.78,18.2,18.2,0,0,1,18.915,35.559c-.119,0-.242,0-.366,0H18.5a19.052,19.052,0,0,1-6.831-1.262L7.366,36.984A.772.772,0,0,1,6.957,37.1Zm8.407-18.388h0l5,4.289a.771.771,0,0,0,1.049-.04l9.275-9.275a.775.775,0,0,0-.921-1.225l-8.038,4.382-5-4.288a.774.774,0,0,0-1.05.041L6.41,21.871A.773.773,0,0,0,7.325,23.1l8.038-4.382Z" transform="translate(0 0)" /> </g> </svg> </a> </li> </ul> <div class="float-open"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.099 30.106"> <path class="a" d="M3.4,29.529v-2.24H1.8A1.784,1.784,0,0,1,0,25.422V15.036a1.811,1.811,0,0,1,1.8-1.8H4.583v5.4a4.317,4.317,0,0,0,4.311,4.311H20.332v2.579a1.81,1.81,0,0,1-1.8,1.8H6.993L4.379,29.936a.563.563,0,0,1-.407.17A.6.6,0,0,1,3.4,29.529Zm27.017-4.208-3.97-4.005H8.894a2.759,2.759,0,0,1-2.749-2.749V2.75A2.76,2.76,0,0,1,8.894,0H34.35A2.759,2.759,0,0,1,37.1,2.75V18.566a2.759,2.759,0,0,1-2.749,2.749H31.906V24.71a.877.877,0,0,1-.883.882A.853.853,0,0,1,30.412,25.321ZM28.071,11.065A2.546,2.546,0,1,0,30.616,8.52,2.564,2.564,0,0,0,28.071,11.065Zm-8.893,0A2.546,2.546,0,1,0,21.724,8.52,2.564,2.564,0,0,0,19.178,11.065Zm-8.927,0A2.546,2.546,0,1,0,12.8,8.52,2.564,2.564,0,0,0,10.251,11.065Z" transform="translate(0 0)" /></svg> </div></div>';
      $('body').append($icons);

      if (typeof $skype == 'undefined') {
        $('.float-skype').remove();
      }

      if (typeof $whats == 'undefined') {
        $('.float-whats').remove();
      }

      if (typeof $messenger == 'undefined') {
        $('.float-messenger').remove();
      }
    }
  };

  LI.methods.menuWithOffers = function () {
    $('.full.menu li:not(.other-categories) .nivel-dois').wrapInner(
      '<div class="mega-categorias span6"></div>'
    );
    $('.full.menu li:not(.other-categories) .nivel-dois').append(
      '<div class="mega-recebe span6"></div>'
    );
    $('.full.menu .nivel-um>li .mega-recebe').append(
      '<div class="mega-recebe-prod"><div id="listagemProdutos" class="listagem"><ul><li class="listagem-linha"><ul></ul></li></ul></div></div>'
    );
    $('.full.menu .nivel-um>li').each(function () {
      var self = $(this);
      var href = self.find('a').attr('href');
      self
        .find('.mega-recebe-prod .listagem ul li ul')
        .load(
          href + ' .listagem .listagem-linha:first-child ul li:first-child'
        );
    });
  };

  LI.methods.offers = function () {
    $('.full.menu a[title="Ofertas Especiais"]')
      .closest('li')
      .addClass('ofertas-especiais');
    $('.menu.superior a[title="Ofertas Especiais"]')
      .closest('li')
      .addClass('ofertas-especiais');
    $('.menu.lateral .nivel-um li > a[title="Ofertas Especiais"]')
      .closest('li')
      .addClass('ofertas-especiais');
    $('.links-rodape-categorias ul li a:contains("Ofertas Especiais")')
      .closest('li')
      .addClass('ofertas-especiais');

    $('.full.menu .ofertas-especiais').remove();
    $('.menu.superior .ofertas-especiais').remove();
    $('.menu.lateral .ofertas-especiais').remove();
    $('.links-rodape-categorias .ofertas-especiais').remove();

    $('.full.menu .nivel-um').append(
      '<li class="offers com-filho"><a title="Ofertas"><svg class="icon" xmlns="http://www.w3.org/2000/svg" id="ofertas" width="24.927" height="18.367" viewBox="0 0 24.927 18.367"><path id="Caminho_11" data-name="Caminho 11" d="M19.154,64.8a2.383,2.383,0,0,0-2.1-1.05H2.624A2.632,2.632,0,0,0,0,66.374V79.493a2.632,2.632,0,0,0,2.624,2.624H17.055a2.383,2.383,0,0,0,2.1-1.05l5.773-8.134Z" transform="translate(0 -63.75)" fill="#000000"/></svg><strong class="titulo">Ofertas</strong></a><ul class="nivel-dois"></ul></li>'
    );
    $('.full.menu .nivel-um .offers .nivel-dois').append(
      '<div class="mega-recebe-prod"><div id="listagemProdutos" class="listagem"><ul></ul></div></div>'
    );

    $('#listagemProdutos .titulo-categoria').each(function (index) {
      var nomeCategoria = $(this).find('strong').html();
      $(this).find('+ ul').addClass(nomeCategoria);
      $(this).addClass(nomeCategoria);
    });

    $('#listagemProdutos .titulo-categoria.Ofertas').remove();

    //remover esse comentário
    /*$.ajax({
            url: "../premium",
            type: 'GET',
            success: function (data) {
                var elements = $(data).find(".listagem>ul .span3:nth-child(1), .listagem>ul .span3:nth-child(2)");
                console.log("aqui", $(data));
                console.log("elements", elements);
                $(".full.menu .mega-recebe-prod .listagem ul").empty();
                $(".full.menu .mega-recebe-prod .listagem ul").append(elements);
            }
        });*/
  };

  LI.methods.counterOffer = function () {
    if (typeof $data_oferta !== 'undefined') {
      if (typeof $data_oferta !== 'object') {
        $data_oferta = $data_oferta.split('/');
        $data_oferta = new Date($data_oferta.reverse());
        $data_oferta = $data_oferta.setDate($data_oferta.getDate() + 1);
      } else {
        $data_oferta = $data_oferta.setDate($data_oferta.getDate() + 4);
      }

      if ($data_oferta > new Date()) {
        $('.offers .nivel-dois').append(
          '<div class="counter-offer"><div class="promo"><span class="title">APROVEITE NOSSAS SUPER OFERTAS COM</span><p>' +
            $texto_oferta +
            '</p></div><div class="counter"><span class="title">OFERTAS POR TEMPO LIMITADO</span><div class="counter-wrap"><svg class="icon-offer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53.916 53.916"><g transform="translate(-1187.5 -1284)"><g class="a" transform="translate(1187.5 1284)"><circle class="b" cx="26.958" cy="26.958" r="26.958"/><circle class="c" cx="26.958" cy="26.958" r="25.458"/></g><rect width="2.995" height="16.474" rx="1.498" transform="translate(1212.96 1295.981)"/><rect width="2.995" height="16.474" rx="1.498" transform="translate(1230.183 1310.209) rotate(90)"/></g></svg><div class="item days" data-value=""><span class="description">Dias</span></div><div class="item hours" data-value=""><span class="description">Horas</span></div><div class="item minutes" data-value=""><span class="description">Min</span></div><div class="item seconds" data-value=""><span class="description">Seg</span></div></div></div></div>'
        );
        counter($data_oferta);
      }
    }

    function counter(date) {
      var target_date = new Date(date).getTime();
      var days, hours, minutes, seconds;

      setInterval(function () {
        var current_date = new Date().getTime();
        var seconds_f = (target_date - current_date) / 1000;

        days = parseInt(seconds_f / 86400);
        seconds_f = seconds_f % 86400;

        hours = parseInt(seconds_f / 3600);
        seconds_f = seconds_f % 3600;

        minutes = parseInt(seconds_f / 60);
        seconds = parseInt(seconds_f % 60);

        if (target_date >= current_date) {
          $('.days').attr('date-value', days < 10 ? '0' + days : days);
          $('.hours').attr('date-value', hours < 10 ? '0' + hours : hours);
          $('.minutes').attr(
            'date-value',
            minutes < 10 ? '0' + minutes : minutes
          );
          $('.seconds').attr(
            'date-value',
            seconds < 10 ? '0' + seconds : seconds
          );
        }

        if (days == 0 && hours == 0 && minutes == 0 && seconds == 00) {
          $('.offers').remove();
        }
      }, 1000);
    }
  };

  LI.methods.arrumarbanner = function () {
    if ('undefined' != typeof $banners_conteudo) {
      $('#listagemProdutos > ul:nth-child(2)').after(
        '<div id="banner-center-um" class="banner-center" ><a class="modulo span6" href="' +
          $banners_conteudo.banner1.link +
          '"><img src="' +
          $banners_conteudo.banner1.imageUrl +
          '" /></a><a class="modulo span6" href="' +
          $banners_conteudo.banner2.link +
          '"><img src="' +
          $banners_conteudo.banner2.imageUrl +
          '" /></a></div>'
      ),
        $('#listagemProdutos > ul:nth-child(5)').after(
          '<div id="banner-center-dois" class="banner-center" ><a class="modulo span6" href="' +
            $banners_conteudo.banner3.link +
            '"><img src="' +
            $banners_conteudo.banner3.imageUrl +
            '" /></a><a class="modulo span6" href="' +
            $banners_conteudo.banner4.link +
            '"><img src="' +
            $banners_conteudo.banner4.imageUrl +
            '" /></a></div>'
        ),
        $('#listagemProdutos > ul:nth-child(9)').after(
          '<div id="banner-center-tres" class="banner-center" ><a class="modulo span6" href="' +
            $banners_conteudo.banner5.link +
            '"><img src="' +
            $banners_conteudo.banner5.imageUrl +
            '" /></a><a class="modulo span6" href="' +
            $banners_conteudo.banner6.link +
            '"><img src="' +
            $banners_conteudo.banner6.imageUrl +
            '" /></a></div>'
        );
    }
  };

  LI.methods.infoBanner = function () {
    $('.flexslider .slides li').each(function () {
      var i =
        "<h3 class='title-banner'>" + $(this).find('img').attr('alt') + '</h3>';
      $(this).find('.info-banner').wrap('<div class="wrap"></div>'),
        $(this).find('.wrap').prepend($(i));
    });
  };

  LI.methods.buscaMobile = function () {
    $('.atalhos-mobile ul').append(
      $(
        '<li class="search"><svg class="icon" xmlns="http://www.w3.org/2000/svg" width="21.88" height="22.663" viewBox="0 0 21.88 22.663"><path id="search" d="M22.531,20.642l-5.394-5.61a9.147,9.147,0,1,0-7,3.268,9.052,9.052,0,0,0,5.242-1.656L20.811,22.3a1.193,1.193,0,1,0,1.72-1.655ZM10.134,2.387A6.763,6.763,0,1,1,3.371,9.15,6.771,6.771,0,0,1,10.134,2.387Z" transform="translate(-0.984)" fill="#3b3b3b"/></svg></li><div class="buscafloat"><form id="form-buscar" action="/buscar" method="get"><span role="status" aria-live="polite" class="ui-helper-hidden-accessible"></span><input id="auto-complete" type="text" name="q" placeholder="Digite o que voce procura" value="" autocomplete="off" class="ui-autocomplete-input"><button class="botao botao-busca icon-search fundo-secundario"></button></form></div>'
      )
    );

    $('.atalhos-mobile .search').click(function () {
      $('.atalhos-mobile .buscafloat').toggleClass('active');
    });
  };

  LI.methods.whatsAppFixed = function () {
    if ('undefined' != typeof WHATSAPP) {
      var i = WHATSAPP;
      $('body').append(
        '<a href="https://api.whatsapp.com/send?phone=' +
          i +
          '&text=Ola" target="_blank" class="whats-btn-fixed"><svg style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><style type="text/css">.st0{display:none;fill:#FEFEFE;}.st1{fill:#25D366;}.st2{fill:#FFFFFF;}</style><g id="Layer_1"/><g id="Layer_2"><g><path class="st0" d="M512.4,512.4c-170.7,0-341.3,0-512,0c0-170.7,0-341.3,0-512c170.7,0,341.3,0,512,0    C512.4,171.1,512.4,341.8,512.4,512.4z"/><path class="st1" d="M127.8,388.2c0.7-2.6,1.5-5,2.3-7.3c3.6-10.6,7.1-21.3,10.7-31.9c1.3-3.8,2.7-7.6,3.9-11.5    c0.4-1.1,0.3-1.9-0.4-2.9c-3.7-5.3-7.1-10.8-10.1-16.5c-4.8-9.3-8.6-19-11.3-29.1c-1.9-6.9-3-14-3.8-21.1    c-1.2-9.8-1.2-19.7-0.2-29.6c0.9-9,2.6-17.9,5.3-26.7c2.8-9.1,6.4-17.9,10.9-26.3c3.9-7.4,8.5-14.3,13.6-20.8    c5.2-6.5,10.8-12.6,17.1-18.1c5.6-5,11.6-9.6,17.9-13.7c5.3-3.4,10.9-6.5,16.6-9.1c5.5-2.5,11.1-4.8,16.8-6.6    c8.4-2.6,16.9-4.7,25.7-5.6c6.7-0.7,13.4-1.3,20.2-1.1c6.8,0.2,13.6,0.8,20.3,1.9c12.5,2,24.6,5.7,36.1,11    c14.9,6.8,28.1,16,39.9,27.3c10.3,10,18.8,21.2,25.8,33.8c5.1,9.3,9.1,19.1,12,29.3c4,14.1,5.7,28.5,5.3,43.1    c-0.3,10.7-1.7,21.2-4.5,31.5c-3.4,13-8.5,25.3-15.4,36.8c-7,11.8-15.6,22.3-25.6,31.7c-6.9,6.5-14.4,12.2-22.5,17.1    c-8.7,5.3-18,9.7-27.7,13.1c-8.7,3-17.7,5.1-26.8,6.5c-4.1,0.6-8.2,0.9-12.3,1c-2.1,0-4.1,0.3-6.2,0.3c-11.7,0-23.2-1.2-34.6-4    c-13.2-3.2-25.7-8.2-37.4-15c-2.1-1.2-4.2-2.4-6.2-3.8c-1-0.7-1.9-0.7-3-0.3c-6.5,2.2-13.1,4.3-19.6,6.4    c-10.7,3.4-21.4,6.8-32,10.2C128.4,388.2,128.2,388.2,127.8,388.2z"/><path class="st2" d="M206.4,168.4c2.5,0.1,5,0.1,7.4,0.5c1.9,0.3,3.5,1.2,4.7,2.7c1.3,1.6,2.2,3.3,2.9,5.2    c3.6,9.8,7.3,19.7,11,29.5c0.6,1.7,1.3,3.3,1.8,5c0.6,1.9,0.7,3.7-0.2,5.6c-1.2,2.7-2.6,5.2-4.5,7.4c-2.5,2.8-4.9,5.7-7.6,8.3    c-0.4,0.4-0.8,0.8-1.2,1.2c-1.7,1.9-2.1,3.9-1,6.2c1,1.9,1.9,3.8,3,5.6c4.3,7,8.9,13.7,14.3,19.8c5,5.7,10.5,10.8,16.5,15.4    c4.9,3.8,10.1,7.1,15.6,9.9c3.2,1.7,6.4,3.3,9.7,4.8c2.8,1.3,5.4,1.1,7.7-1.5c4.9-5.4,9.9-10.6,14.3-16.4c0.6-0.9,1.4-1.6,2.2-2.3    c1.4-1.1,2.9-1.5,4.6-1c3.4,0.9,6.5,2.5,9.6,4.1c9,4.7,17.9,9.5,26.9,14.3c0.3,0.2,0.6,0.3,0.9,0.5c3.1,1.5,4.6,3.8,4.3,7.5    c-0.4,4.8-1.6,9.3-3,13.9c-1.2,4-3.5,7.3-6.5,10.1c-2.1,2-4.3,3.7-6.7,5.2c-6.5,4.1-13.5,6.8-21.2,8c-5.4,0.8-10.6,0.3-15.8-1.1    c-8.2-2.4-16.2-5.3-24-8.6c-4-1.7-8-3.4-11.9-5.2c-6.3-2.9-12.2-6.4-17.8-10.4c-7.7-5.4-14.8-11.5-21.4-18.2    c-5-5-9.7-10.4-14.2-15.9c-6.9-8.5-12.7-17.6-18.6-26.8c-5.1-7.9-9.1-16.4-11.6-25.5c-1.6-5.8-2.5-11.7-2.1-17.7    c0.7-11.6,4.4-22,12.4-30.8c2.3-2.5,4.5-4.9,7.2-6.9c2.8-1.9,5.8-2.9,9.2-2.8C204.4,168.4,205.4,168.4,206.4,168.4z"/></g></g></svg></a>'
      );
    }
  };

  LI.methods.discountOff = function () {
    $('.bandeiras-produto .bandeira-promocao').each(function () {
      var txt;
      txt = $(this).text().replace('Desconto', 'Off');
      $(this).text(txt);
    });
  };

  LI.methods.tarjaTop = function () {
    if ('undefined' != typeof $tarja_top) {
      $('#cabecalho').before(
        '<div id="tarja-top"><a href="' +
          $tarja_top.tarja.link +
          '"><img src="' +
          $tarja_top.tarja.imageUrl +
          '" /></a></div>'
      );
    }
  };

  //newsletter popup
  $('#modalNewsletter .componente .interno').append(
    '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="61.906" height="49.069" viewBox="0 0 61.906 49.069"><path id="Caminho_12" data-name="Caminho 12" d="M5.349,47.069A5.15,5.15,0,0,1,1.571,45.5,5.15,5.15,0,0,1,0,41.719V15.177a17.7,17.7,0,0,0,3.377,2.908q12.1,8.223,16.615,11.534,1.905,1.4,3.092,2.19a19.1,19.1,0,0,0,3.159,1.6,9.622,9.622,0,0,0,3.677.819h.068a9.619,9.619,0,0,0,3.677-.819,19.1,19.1,0,0,0,3.159-1.6q1.187-.785,3.092-2.19Q45.6,25.506,56.563,18.085a18.42,18.42,0,0,0,3.343-2.908V41.719a5.365,5.365,0,0,1-5.348,5.35Zm24.6-17.117H29.92a5.3,5.3,0,0,1-1.672-.3,10.069,10.069,0,0,1-1.922-.9q-1.02-.6-1.739-1.086t-1.805-1.271q-1.086-.786-.42-.02-.042-.139-.759-.1T5.75,14.508a16.589,16.589,0,0,1-.911-.861A7.809,7.809,0,0,1,0,6.084,6.749,6.749,0,0,1,1.387,1.738,4.774,4.774,0,0,1,5.349,0H54.557a5.167,5.167,0,0,1,3.761,1.571,5.124,5.124,0,0,1,1.588,3.778A8.828,8.828,0,0,1,58.268,10.4a15.88,15.88,0,0,1-4.078,4.112Q41.621,23.233,38.545,25.373q-.334.234-1.421,1.02t-1.805,1.271q-.719.484-1.738,1.086a10.082,10.082,0,0,1-1.922.9,5.3,5.3,0,0,1-1.672.3Z" transform="translate(1 1)" fill="none" stroke="#f7b0a8" stroke-width="2"/></svg>'
  );

  //Topbar
  var $top_actions =
    '<ul class="top-actions"> <li class="top-action-item"> <a href="#modalContato" data-toggle="modal" data-target="#modalContato"> <svg class="icon "xmlns="http://www.w3.org/2000/svg" viewBox="-1281.001 13.021 14.704 11.553"><path class="a" d="M6884.314,22.553A1.318,1.318,0,0,1,6883,21.241V14.725a4.339,4.339,0,0,0,.829.715q2.971,2.018,4.079,2.83.467.345.758.537a4.617,4.617,0,0,0,.776.395,2.371,2.371,0,0,0,.9.2h.017a2.371,2.371,0,0,0,.9-.2,4.617,4.617,0,0,0,.776-.395q.291-.192.758-.537,1.395-1.01,4.087-2.83a4.573,4.573,0,0,0,.82-.715v6.516a1.318,1.318,0,0,1-1.314,1.312Zm6.038-4.2h-.009a1.288,1.288,0,0,1-.41-.074,2.511,2.511,0,0,1-.471-.22c-.168-.1-.31-.189-.427-.267s-.265-.183-.443-.313-.294-.211-.348-.249q-.748-.525-2.15-1.5t-1.683-1.17a4.055,4.055,0,0,1-.959-.947,1.913,1.913,0,0,1-.452-1.12,1.658,1.658,0,0,1,.341-1.066,1.174,1.174,0,0,1,.973-.428h12.076a1.277,1.277,0,0,1,.925.386,1.261,1.261,0,0,1,.389.928,2.152,2.152,0,0,1-.4,1.238,3.851,3.851,0,0,1-1,1.009l-3.839,2.668c-.054.038-.171.121-.348.249s-.325.234-.443.313-.259.168-.427.267a2.511,2.511,0,0,1-.471.22,1.288,1.288,0,0,1-.41.074Z" transform="translate(-8164.001 2.021)"/></svg> Fale Conosco </a> </li><li class="top-action-item"> <a href="/conta/favorito/listar"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="-1145 13.105 15.865 14"><path class="a" d="M14.622,1.293a4.263,4.263,0,0,0-6.067,0l-.6.6-.6-.6A4.29,4.29,0,0,0,1.293,7.361l6.664,6.664,6.664-6.664a4.263,4.263,0,0,0,0-6.067" transform="translate(-1145.025 13.08)"/></svg> Meus favoritos </a> </li><li class="top-action-item rastreio"> <a href="#"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="5648 56.875 9.554 13.868"><path class="a" d="M76.233,3.452a4.32,4.32,0,0,0-.224-.555A4.751,4.751,0,0,0,66.9,4.3v.592c0,.025.009.247.021.358C67.1,6.632,68.188,8.1,69,9.48c.875,1.479,1.783,2.934,2.683,4.388.555-.949,1.108-1.911,1.65-2.835.148-.271.319-.542.467-.8.1-.172.287-.345.373-.505.875-1.6,2.284-3.217,2.284-4.808V4.265A4.921,4.921,0,0,0,76.233,3.452ZM71.656,6.423a1.7,1.7,0,0,1-1.623-1.159,1.607,1.607,0,0,1-.046-.432V4.45a1.605,1.605,0,0,1,1.722-1.578,1.746,1.746,0,0,1,1.749,1.775A1.791,1.791,0,0,1,71.656,6.423Z" transform="translate(5581.095 56.875)"/></svg> Rastreie seu pedido </a> </li></ul>';
  $('#barraTopo').remove();
  $('.barra-inicial .row-fluid').append($top_actions);

  //Header
  var $actions =
    '<ul class="actions"> <li class="action-item support"> <a href="#modalContato" data-toggle="modal" data-target="#modalContato"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32.022" height="25.273" viewBox="0 0 32.022 25.273"> <path id="Caminho_6064" data-name="Caminho 6064" d="M25.289,22.321H12.166a3.092,3.092,0,0,1-3.059-2.667V19.2H26.272A2.61,2.61,0,0,0,28.9,16.338V6.7h.877a2.066,2.066,0,0,1,2.248,2.289V19.654c0,1.33-.7,2.667-2.248,2.667h-.192l.728,2.952ZM3.351,17.679C1.71,17.525,0,16.526,0,15.143V3.06C0,1.558,2.019,0,3.773,0H23.709a3.443,3.443,0,0,1,3.373,3.06V15.143c0,1.5-1.619,2.564-3.373,2.564H9.125L2.283,21.732ZM18.467,8.4a1.8,1.8,0,1,0,1.8-1.8A1.8,1.8,0,0,0,18.467,8.4Zm-6.727,0a1.8,1.8,0,1,0,1.8-1.8A1.8,1.8,0,0,0,11.74,8.4Zm-6.727,0a1.8,1.8,0,1,0,1.8-1.8A1.8,1.8,0,0,0,5.013,8.4Z" fill="#3b3b3b"/></svg> <span class="titulo">fale conosco<strong>email, whatsapp...</strong></span> </a> </li> <li class="action-item account"> <a href="/conta/index"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="29.219" height="29.219" viewBox="0 0 29.219 29.219"><g id="Login" transform="translate(0 -0.001)"><g id="Grupo_2" data-name="Grupo 2" transform="translate(0 0.001)"><path id="Caminho_8" data-name="Caminho 8" d="M678.427,200.222,673.648,205a2.211,2.211,0,0,0,0,2.422l4.779,4.776c.478.482,2.122.482,2.122-.517V200.74C680.549,199.745,678.905,199.745,678.427,200.222Z" transform="translate(-651.331 -193.392)" fill="#3b3b3b"/><path id="Caminho_9" data-name="Caminho 9" d="M14.609,0H0V21.915l10.957,7.3V25.567h3.652a3.655,3.655,0,0,0,3.652-3.652V3.653A3.653,3.653,0,0,0,14.609,0Zm0,21.914H10.956V7.306L5.477,3.653h9.131Z" transform="translate(0 -0.001)" fill="#3b3b3b"/></g></g></svg> <span class="titulo">fa&ccedila login<strong>ou cadastre-se</strong></span> </a> </li><li class="action-item cart carrinho"></li></ul>';

  if (isLogged) {
    $actions =
      '<ul class="actions"> <li class="action-item support"> <a href="#modalContato" data-toggle="modal" data-target="#modalContato"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32.022" height="25.273" viewBox="0 0 32.022 25.273"> <path id="Caminho_6064" data-name="Caminho 6064" d="M25.289,22.321H12.166a3.092,3.092,0,0,1-3.059-2.667V19.2H26.272A2.61,2.61,0,0,0,28.9,16.338V6.7h.877a2.066,2.066,0,0,1,2.248,2.289V19.654c0,1.33-.7,2.667-2.248,2.667h-.192l.728,2.952ZM3.351,17.679C1.71,17.525,0,16.526,0,15.143V3.06C0,1.558,2.019,0,3.773,0H23.709a3.443,3.443,0,0,1,3.373,3.06V15.143c0,1.5-1.619,2.564-3.373,2.564H9.125L2.283,21.732ZM18.467,8.4a1.8,1.8,0,1,0,1.8-1.8A1.8,1.8,0,0,0,18.467,8.4Zm-6.727,0a1.8,1.8,0,1,0,1.8-1.8A1.8,1.8,0,0,0,11.74,8.4Zm-6.727,0a1.8,1.8,0,1,0,1.8-1.8A1.8,1.8,0,0,0,5.013,8.4Z" fill="#3b3b3b"/></svg> <span class="titulo">fale conosco<strong>email, whatsapp...</strong></span> </a> </li> <li class="action-item account"> <a href="/conta/index"> <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="29.219" height="29.219" viewBox="0 0 29.219 29.219"><g id="Login" transform="translate(0 -0.001)"><g id="Grupo_2" data-name="Grupo 2" transform="translate(0 0.001)"><path id="Caminho_8" data-name="Caminho 8" d="M678.427,200.222,673.648,205a2.211,2.211,0,0,0,0,2.422l4.779,4.776c.478.482,2.122.482,2.122-.517V200.74C680.549,199.745,678.905,199.745,678.427,200.222Z" transform="translate(-651.331 -193.392)" fill="#3b3b3b"/><path id="Caminho_9" data-name="Caminho 9" d="M14.609,0H0V21.915l10.957,7.3V25.567h3.652a3.655,3.655,0,0,0,3.652-3.652V3.653A3.653,3.653,0,0,0,14.609,0Zm0,21.914H10.956V7.306L5.477,3.653h9.131Z" transform="translate(0 -0.001)" fill="#3b3b3b"/></g></g></svg> <span class="titulo">seja bem<strong>vindo(a)</strong></span> </a> </li><li class="action-item cart carrinho"> </li></ul>';
  }

  if ($('.logo-centro').length) {
    $('#cabecalho .inferior .span12').last().append($actions);
  } else {
    $('#cabecalho .inferior .span4').append($actions);
  }

  //menu mobile
  $('.conteudo-topo .menu.superior.visible-phone').prepend(
    $('<div class"tracking"></div>')
  );

  //Estrutura Cabeçalho
  $('#cabecalho .row-fluid .span3').removeClass('span3');
  $('#cabecalho .row-fluid div:nth-child(1)').addClass('span2');
  $('#cabecalho .row-fluid .conteudo-topo').removeClass('span9');
  $('#cabecalho .row-fluid .conteudo-topo').addClass('span10');
  $('#cabecalho .row-fluid .conteudo-topo .inferior').removeClass('span2');

  //Banners
  $('.banner.cheio+.row-fluid').addClass('conteiner');
  $('.mini-banner').removeClass('hidden-phone');
  $('.flex-prev').append(
    $(
      '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.446 20.079"><g transform="translate(108.584 20.079) rotate(180)"><path d="M108.173,11.033l-8.634,8.633a1.406,1.406,0,0,1-1.989-1.988l7.639-7.639L97.55,2.4A1.406,1.406,0,1,1,99.539.412l8.634,8.634a1.406,1.406,0,0,1,0,1.988Z" transform="translate(0 0)"/></g></svg>'
    )
  );
  $('.flex-next').append(
    $(
      '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.446 20.079"><g transform="translate(-97.138 0)"><path d="M108.173,11.033l-8.634,8.633a1.406,1.406,0,0,1-1.989-1.988l7.639-7.639L97.55,2.4A1.406,1.406,0,1,1,99.539.412l8.634,8.634a1.406,1.406,0,0,1,0,1.988Z" transform="translate(0 0)"/></g></svg>'
    )
  );

  //Brands
  $('.marcas').prepend($('<strong>Alambiques</strong>'));

  //About us
  const aboutUsWrapper = $(/*html*/ `
      <div id="about-us-section" class="about-us">
        <div class="grid-item info">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
          deserunt rem ratione error, perspiciatis ducimus exercitationem eos
          cum quaerat incidunt laborum consectetur! Voluptates nesciunt dicta
          dolore fuga eum quo corporis at accusamus cupiditate! Nobis
          necessitatibus dignissimos illum! Ab sint delectus quisquam quis optio
          iure quibusdam voluptatibus repellat amet temporibus! Ab, at. Illo
          modi odio, quae nobis, id dolores voluptas iure corrupti impedit neque
          perferendis perspiciatis sequi distinctio deserunt ducimus dolorem.
          Illum excepturi neque perspiciatis. Temporibus earum, atque animi
          architecto minima ratione molestias unde perspiciatis nemo molestiae,
          nulla quo ex neque optio, voluptas eveniet adipisci soluta aliquid qui
          sed facilis aspernatur. Dolores dicta eligendi provident, nulla nihil
          maiores, quidem alias expedita et sed sequi tenetur labore facere
          voluptate obcaecati error sit inventore laboriosam, debitis ullam enim
          non. Asperiores architecto in, non deleniti odio cumque corporis
          molestiae, praesentium, voluptates quisquam sequi consequuntur dolor
          provident adipisci reprehenderit ad odit mollitia doloribus nulla
          temporibus? Repudiandae ad delectus minus sit pariatur eaque fugit
          saepe nihil quidem at aliquid, reiciendis recusandae. Fugit error ad,
          excepturi assumenda, exercitationem quasi inventore sint nesciunt
          architecto rerum ratione quos? Molestiae impedit saepe reprehenderit
          cupiditate quidem, labore repellendus minima doloribus ducimus laborum
          ullam excepturi molestias nemo temporibus nobis iusto aperiam mollitia
          quaerat beatae cum quo quam praesentium. Dolor est id commodi fugit
          quae? Veritatis nulla accusantium consequuntur eveniet dignissimos
          veniam, voluptatem adipisci quisquam voluptatibus. Culpa, officiis
          vitae, ex sequi obcaecati iusto, repellat tempore sint praesentium
          architecto voluptates et harum! Aut ea exercitationem quidem veniam,
          fugiat veritatis dolorem voluptatibus itaque molestiae sapiente.
          Voluptas labore architecto ratione, cumque earum dolorem eum numquam
          incidunt, repellat explicabo doloremque quasi excepturi corporis
          aspernatur atque repudiandae laboriosam! Odit maiores necessitatibus
          asperiores reiciendis at repellendus. Aliquid in quaerat suscipit.
          Saepe, cum? Voluptates minima, adipisci fugit obcaecati culpa,
          assumenda iure, ipsum atque exercitationem accusamus eos saepe harum
          ea dolorem.
        </div>
        <div class="grid-item picture">
          <div class="image-wrapper">
            <img src="https://via.placeholder.com/1000" />
          </div>
        </div>
      </div>
    `);

  $('.secao-banners').append(
    $("<strong id='quem-somos-title' >Quem Somos</strong>")
  );

  $('.secao-banners').append(aboutUsWrapper);

  //Product
  $('.pagina-produto .comprar .icon-shopping-cart').append(
    $(
      '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16.949" height="22.052" viewBox="0 0 16.949 22.052"><path id="cadeado" d="M72.06,8.905h-.43V6.894A6.856,6.856,0,0,0,64.989,0c-.1,0-.3,0-.4,0a6.856,6.856,0,0,0-6.641,6.893V8.905h-.43a1.4,1.4,0,0,0-1.2,1.527V20.519a1.4,1.4,0,0,0,1.2,1.533H72.06a1.4,1.4,0,0,0,1.2-1.533V10.433A1.4,1.4,0,0,0,72.06,8.905Zm-5.91,6.56v3.048a.651.651,0,0,1-.641.644H64.067a.651.651,0,0,1-.641-.644V15.466a1.846,1.846,0,0,1,1.161-3.14c.1,0,.3,0,.4,0a1.846,1.846,0,0,1,1.161,3.14ZM68.8,8.905H60.777V6.894a4.011,4.011,0,1,1,8.021,0V8.905Z" transform="translate(-56.313)" fill="#fff"/></svg>'
    )
  );
  setTimeout(function () {
    $('#carouselImagem .elastislide-carousel ul li a span')
      .find('img')
      .each(function () {
        var src = $(this)
          .attr('src')
          .replace(/\/64x50/, '');
        $(this).attr('src', src);
      });
  }, 500);

  //Newsletter footer
  $('#barraNewsletter.posicao-rodape').removeClass('hidden-phone');
  $('#barraNewsletter.posicao-rodape .componente .texto-newsletter').append(
    '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="61.906" height="49.069" viewBox="0 0 61.906 49.069"> <path id="Caminho_12" data-name="Caminho 12" d="M5.349,47.069A5.15,5.15,0,0,1,1.571,45.5,5.15,5.15,0,0,1,0,41.719V15.177a17.7,17.7,0,0,0,3.377,2.908q12.1,8.223,16.615,11.534,1.905,1.4,3.092,2.19a19.1,19.1,0,0,0,3.159,1.6,9.622,9.622,0,0,0,3.677.819h.068a9.619,9.619,0,0,0,3.677-.819,19.1,19.1,0,0,0,3.159-1.6q1.187-.785,3.092-2.19Q45.6,25.506,56.563,18.085a18.42,18.42,0,0,0,3.343-2.908V41.719a5.365,5.365,0,0,1-5.348,5.35Zm24.6-17.117H29.92a5.3,5.3,0,0,1-1.672-.3,10.069,10.069,0,0,1-1.922-.9q-1.02-.6-1.739-1.086t-1.805-1.271q-1.086-.786-1.42-1.02-3.042-2.139-8.759-6.1T5.75,14.508a16.589,16.589,0,0,1-3.911-3.861A7.809,7.809,0,0,1,0,6.084,6.749,6.749,0,0,1,1.387,1.738,4.774,4.774,0,0,1,5.349,0H54.557a5.167,5.167,0,0,1,3.761,1.571,5.124,5.124,0,0,1,1.588,3.778A8.828,8.828,0,0,1,58.268,10.4a15.88,15.88,0,0,1-4.078,4.112Q41.621,23.233,38.545,25.373q-.334.234-1.421,1.02t-1.805,1.271q-.719.484-1.738,1.086a10.082,10.082,0,0,1-1.922.9,5.3,5.3,0,0,1-1.672.3Z" transform="translate(1 1)" fill="none" stroke="#000000" stroke-width="2"/> </svg>'
  );
  $('.coluna div.componente.newsletter .titulo').append(
    '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="61.906" height="49.069" viewBox="0 0 61.906 49.069"> <path id="Caminho_12" data-name="Caminho 12" d="M5.349,47.069A5.15,5.15,0,0,1,1.571,45.5,5.15,5.15,0,0,1,0,41.719V15.177a17.7,17.7,0,0,0,3.377,2.908q12.1,8.223,16.615,11.534,1.905,1.4,3.092,2.19a19.1,19.1,0,0,0,3.159,1.6,9.622,9.622,0,0,0,3.677.819h.068a9.619,9.619,0,0,0,3.677-.819,19.1,19.1,0,0,0,3.159-1.6q1.187-.785,3.092-2.19Q45.6,25.506,56.563,18.085a18.42,18.42,0,0,0,3.343-2.908V41.719a5.365,5.365,0,0,1-5.348,5.35Zm24.6-17.117H29.92a5.3,5.3,0,0,1-1.672-.3,10.069,10.069,0,0,1-1.922-.9q-1.02-.6-1.739-1.086t-1.805-1.271q-1.086-.786-1.42-1.02-3.042-2.139-8.759-6.1T5.75,14.508a16.589,16.589,0,0,1-3.911-3.861A7.809,7.809,0,0,1,0,6.084,6.749,6.749,0,0,1,1.387,1.738,4.774,4.774,0,0,1,5.349,0H54.557a5.167,5.167,0,0,1,3.761,1.571,5.124,5.124,0,0,1,1.588,3.778A8.828,8.828,0,0,1,58.268,10.4a15.88,15.88,0,0,1-4.078,4.112Q41.621,23.233,38.545,25.373q-.334.234-1.421,1.02t-1.805,1.271q-.719.484-1.738,1.086a10.082,10.082,0,0,1-1.922.9,5.3,5.3,0,0,1-1.672.3Z" transform="translate(1 1)" fill="none" stroke="#000000" stroke-width="2"/> </svg>'
  );

  //Footer
  $('.sobre-loja-rodape').prepend($('#cabecalho .logo').clone());
  $('.sobre-loja-rodape').append(
    $("<a href='/pagina/sobre-nos.html' class='more'>Sobre</a>")
  );
  $('#rodape .institucional .conteiner .span9 .row-fluid').prepend(
    $('.sobre-loja-rodape')
  );

  var $contact = $('#rodape .visible-phone ul').html();
  // $('#rodape .span9 .row-fluid .links-rodape-paginas').after('<div class="span4 links-rodape links-rodape-atendimento"><span class="titulo">atendimento</span><ul class="contact">' + $contact + '</ul></div>');

  $('#rodape .institucional .titulo').click(function () {
    $(this).siblings('ul, .office-hours').toggleClass('active');
  });

  if (typeof $horario != 'undefined') {
    var $office_hours =
      '<div class="office-hours"><p class="title"><svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.143 16.143"><g transform="translate(-1143.5 -1316.804)"><g class="a" transform="translate(1143.5 1316.804)"><path class="b" d="M 8.071533203125 15.64306354522705 C 3.896573305130005 15.64306354522705 0.5000032186508179 12.24649333953857 0.5000032186508179 8.071533203125 C 0.5000032186508179 3.896573305130005 3.896573305130005 0.5000032186508179 8.071533203125 0.5000032186508179 C 12.24649333953857 0.5000032186508179 15.64306354522705 3.896573305130005 15.64306354522705 8.071533203125 C 15.64306354522705 12.24649333953857 12.24649333953857 15.64306354522705 8.071533203125 15.64306354522705 Z"/><path class="c" d="M 8.071533203125 1.000002861022949 C 4.172283172607422 1.000002861022949 1.000002861022949 4.172283172607422 1.000002861022949 8.071533203125 C 1.000002861022949 11.97078323364258 4.172283172607422 15.14306354522705 8.071533203125 15.14306354522705 C 11.97078323364258 15.14306354522705 15.14306354522705 11.97078323364258 15.14306354522705 8.071533203125 C 15.14306354522705 4.172283172607422 11.97078323364258 1.000002861022949 8.071533203125 1.000002861022949 M 8.071533203125 3.814697265625e-06 C 12.52931308746338 3.814697265625e-06 16.14306259155273 3.613753318786621 16.14306259155273 8.071533203125 C 16.14306259155273 12.52931308746338 12.52931308746338 16.14306259155273 8.071533203125 16.14306259155273 C 3.613753318786621 16.14306259155273 3.814697265625e-06 12.52931308746338 3.814697265625e-06 8.071533203125 C 3.814697265625e-06 3.613753318786621 3.613753318786621 3.814697265625e-06 8.071533203125 3.814697265625e-06 Z"/></g><rect width="0.897" height="4.933" rx="0.448" transform="translate(1151.123 1320.391)"/><rect width="0.897" height="4.933" rx="0.448" transform="translate(1156.28 1324.651) rotate(90)"/></g></svg>atendimento:</p><p>' +
      $horario +
      '</p></div>';
    $('#rodape .links-rodape-atendimento').append($office_hours);
  }

  //icons
  $('.listagem .acoes-produto .botao-comprar i').replaceWith(
    '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="15.545" height="18.08" viewBox="0 0 15.545 18.08"><path id="sacola_botao" d="M33.045,27.7l-1.2-10.523a.343.343,0,0,0-.359-.311H29.457v-1a4.185,4.185,0,0,0-8.37,0v1H19.054a.362.362,0,0,0-.359.311L17.5,27.7v.048a2.031,2.031,0,0,0,2.033,2.033H31.012a2.031,2.031,0,0,0,2.033-2.033ZM22.283,15.861a2.989,2.989,0,0,1,5.979,0v1H22.283Zm-.6,5.477a1.2,1.2,0,1,1,1.2-1.2A1.184,1.184,0,0,1,21.685,21.338Zm7.174,0a1.2,1.2,0,1,1,1.2-1.2A1.184,1.184,0,0,1,28.86,21.338Z" transform="translate(-17.5 -11.7)" fill="#fff"/></svg>'
  );

  $('#rodape .contact .fa-whatsapp').replaceWith(
    '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.371 16.372"><path d="M3.96,15.2a8.126,8.126,0,0,0,4.2,1.162,8.228,8.228,0,0,0,8.215-8.183,8.183,8.183,0,1,0-15.2,4.229L0,16.371ZM.965,8.183a7.189,7.189,0,1,1,3.323,6.1L4.1,14.161l-2.686.792.792-2.686-.118-.184A7.223,7.223,0,0,1,.965,8.183Zm0,0"/><path d="M121.239,96.377a7.229,7.229,0,0,0,5.8,5.8c.953.181,2.35.209,3.033-.474l.381-.381a1.018,1.018,0,0,0,0-1.44l-1.523-1.523a1.018,1.018,0,0,0-1.44,0l-.381.381a.677.677,0,0,1-.906,0l-1.519-1.583-.007-.007a.6.6,0,0,1,0-.845l.381-.381a1.017,1.017,0,0,0,0-1.44l-1.523-1.523a1.019,1.019,0,0,0-1.44,0l-.381.381h0A3.55,3.55,0,0,0,121.239,96.377Zm1.152-2.355c.4-.391.378-.4.422-.4a.059.059,0,0,1,.042.017c1.6,1.613,1.54,1.519,1.54,1.565a.058.058,0,0,1-.017.042l-.381.381a1.556,1.556,0,0,0,0,2.2l1.52,1.584.007.007a1.636,1.636,0,0,0,2.265,0l.381-.381a.059.059,0,0,1,.083,0c1.6,1.613,1.54,1.518,1.54,1.565a.057.057,0,0,1-.017.042l-.381.381a2.837,2.837,0,0,1-2.176.211,6.27,6.27,0,0,1-5.035-5.035A2.836,2.836,0,0,1,122.392,94.022Zm0,0" transform="translate(-117.254 -89.702)"/></svg>'
  );
  $('#rodape .contact .fa-envelope').replaceWith(
    '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.227 11.039"><g transform="translate(0 -38.529)"><path d="M41.35,68.654,36.1,73.285l-5.256-4.63a.5.5,0,1,0-.667.758l5.59,4.925a.5.5,0,0,0,.668,0l5.588-4.925a.5.5,0,1,0-.668-.757Z" transform="translate(-27.981 -27.98)"/><path d="M14.712,38.529H1.515A1.516,1.516,0,0,0,0,40.044v8.01a1.516,1.516,0,0,0,1.515,1.515h13.2a1.516,1.516,0,0,0,1.515-1.515v-8.01A1.516,1.516,0,0,0,14.712,38.529Zm.5,9.525a.505.505,0,0,1-.5.5H1.515a.505.505,0,0,1-.5-.5v-8.01a.505.505,0,0,1,.5-.5h13.2a.505.505,0,0,1,.5.5Z" transform="translate(0 0)"/></g></svg>'
  );
  $('#rodape .contact .icon-phone').replaceWith(
    '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.258 16.725"><g transform="translate(-2.95)"><path d="M112.4,2.191A7.431,7.431,0,0,0,107.11,0a.593.593,0,1,0,0,1.185,6.295,6.295,0,0,1,6.3,6.3.593.593,0,0,0,1.185,0A7.431,7.431,0,0,0,112.4,2.191Z" transform="translate(-95.383)"/><path d="M109.961,47.615a.593.593,0,0,0,1.185,0,4.042,4.042,0,0,0-4.037-4.037h0a.593.593,0,0,0,0,1.185A2.855,2.855,0,0,1,109.961,47.615Z" transform="translate(-95.383 -40.134)"/><path d="M13.267,39.823a1.789,1.789,0,0,0-1.584.948.593.593,0,1,0,.978.669c.261-.381.379-.441.539-.434a7.635,7.635,0,0,1,2.736,2,.613.613,0,0,1-.006.433,2.046,2.046,0,0,1-1.016,1.279,1.9,1.9,0,0,1-1.523-.051,16.752,16.752,0,0,1-5.5-3.578l0,0A16.749,16.749,0,0,1,4.323,35.6a1.9,1.9,0,0,1-.052-1.524A2.045,2.045,0,0,1,5.55,33.064a.612.612,0,0,1,.432-.006,7.649,7.649,0,0,1,2,2.731c.009.166-.052.284-.433.545a.593.593,0,0,0,.669.979,1.788,1.788,0,0,0,.948-1.586A7.256,7.256,0,0,0,6.4,31.947a1.792,1.792,0,0,0-1.224-.007,3.19,3.19,0,0,0-1.979,1.645,3.051,3.051,0,0,0,.031,2.465,17.928,17.928,0,0,0,3.832,5.881l.012.012a17.933,17.933,0,0,0,5.874,3.826,3.517,3.517,0,0,0,1.323.276,2.717,2.717,0,0,0,1.141-.245,3.19,3.19,0,0,0,1.645-1.979,1.793,1.793,0,0,0-.006-1.221A7.254,7.254,0,0,0,13.267,39.823Z" transform="translate(0 -29.32)"/></g></svg>'
  );
  $('#rodape .contact .fa-skype').replaceWith(
    '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.487 16.695"><g transform="translate(-1.33)"><path d="M10.788,15.06A6.736,6.736,0,0,1,3.037,7.176a.587.587,0,0,0-.063-.392,3.784,3.784,0,0,1,3.315-5.61A.587.587,0,0,0,6.289,0,4.958,4.958,0,0,0,1.848,7.163a7.909,7.909,0,0,0,9.138,9.055.587.587,0,0,0-.2-1.158Z" transform="translate(0)"/><path d="M95.121,15.959a8,8,0,0,0,.123-1.4,7.914,7.914,0,0,0-7.9-7.9,8,8,0,0,0-1.228.095.587.587,0,1,0,.181,1.16,6.819,6.819,0,0,1,1.047-.081,6.738,6.738,0,0,1,6.73,6.731,6.833,6.833,0,0,1-.135,1.35.587.587,0,0,0,.043.364,3.75,3.75,0,0,1,.353,1.6,3.789,3.789,0,0,1-3.785,3.784.587.587,0,0,0,0,1.174,4.964,4.964,0,0,0,4.959-4.958A4.914,4.914,0,0,0,95.121,15.959Z" transform="translate(-77.688 -6.137)"/><path d="M74.829,65.947a1.8,1.8,0,0,0-.2-.891,1.727,1.727,0,0,0-.569-.6,3.709,3.709,0,0,0-.885-.4c-.341-.11-.733-.212-1.162-.3-.34-.079-.589-.139-.737-.181a2.4,2.4,0,0,1-.441-.171,1.044,1.044,0,0,1-.343-.262.552.552,0,0,1-.124-.362.683.683,0,0,1,.366-.578,1.739,1.739,0,0,1,.963-.24,1.547,1.547,0,0,1,.935.221,1.831,1.831,0,0,1,.5.616,1.613,1.613,0,0,0,.3.4.614.614,0,0,0,.4.121.674.674,0,0,0,.676-.654,1.191,1.191,0,0,0-.156-.564,1.812,1.812,0,0,0-.492-.552A2.66,2.66,0,0,0,73,61.116a4.146,4.146,0,0,0-1.21-.158,4.4,4.4,0,0,0-1.524.24,2.153,2.153,0,0,0-.99.685,1.64,1.64,0,0,0-.342,1.02,1.572,1.572,0,0,0,.324,1.008,2.2,2.2,0,0,0,.877.64,7.673,7.673,0,0,0,1.372.411c.4.084.732.166.979.242a1.527,1.527,0,0,1,.6.33.741.741,0,0,1,.231.564.857.857,0,0,1-.429.731,1.95,1.95,0,0,1-1.114.292,1.9,1.9,0,0,1-.8-.145,1.26,1.26,0,0,1-.475-.369,2.766,2.766,0,0,1-.314-.556,1.119,1.119,0,0,0-.287-.422.619.619,0,0,0-.412-.143.685.685,0,0,0-.494.183.582.582,0,0,0-.194.438,1.607,1.607,0,0,0,.323.908,2.4,2.4,0,0,0,.843.747,3.954,3.954,0,0,0,1.855.387,4.236,4.236,0,0,0,1.622-.284,2.332,2.332,0,0,0,1.039-.787A1.924,1.924,0,0,0,74.829,65.947Z" transform="translate(-62.182 -56.186)"/></g></svg>'
  );

  $('#cabecalho .atalhos-mobile .icon-home').append(
    $(
      '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.36 30"><g transform="translate(0 -31.05)"><g transform="translate(0 31.05)"><path class="a" d="M255.186,263.75h-4.669a2.319,2.319,0,0,0-2.317,2.317v3.581a2.319,2.319,0,0,0,2.317,2.317h4.669a2.319,2.319,0,0,0,2.317-2.317v-3.581A2.319,2.319,0,0,0,255.186,263.75Zm.632,5.9a.634.634,0,0,1-.632.632h-4.669a.634.634,0,0,1-.632-.632v-3.581a.634.634,0,0,1,.632-.632h4.669a.634.634,0,0,1,.632.632Z" transform="translate(-230.774 -247.413)"/><path class="a" d="M34.36,40.879a.782.782,0,0,0-.112-.414l-5.111-8.987a.847.847,0,0,0-.73-.428H5.947a.833.833,0,0,0-.73.428l-5.1,8.987A.852.852,0,0,0,0,40.879a4.928,4.928,0,0,0,2.949,4.507V60.208a.845.845,0,0,0,.842.842h26.77a.845.845,0,0,0,.843-.842V45.492A.371.371,0,0,0,31.4,45.4,4.942,4.942,0,0,0,34.36,40.879ZM6.438,32.742H27.915L31.91,39.77H2.45Zm18.015,8.706a3.238,3.238,0,0,1-6.375,0Zm-8.165,0a3.242,3.242,0,0,1-6.382,0Zm-14.547,0H8.123a3.242,3.242,0,0,1-6.382,0ZM14.154,59.365H9.31V50.273a1.2,1.2,0,0,1,1.2-1.2h2.45a1.2,1.2,0,0,1,1.2,1.2v9.092Zm15.565,0H15.839V50.273a2.89,2.89,0,0,0-2.886-2.886H10.5a2.89,2.89,0,0,0-2.886,2.886v9.1H4.634V45.8c.1.007.2.007.295.007a4.922,4.922,0,0,0,4.086-2.176,4.924,4.924,0,0,0,8.172,0,4.911,4.911,0,0,0,8.158,0,4.922,4.922,0,0,0,4.086,2.176c.1,0,.19-.007.288-.007V59.365Zm-.288-15.242a3.236,3.236,0,0,1-3.187-2.668h6.382A3.256,3.256,0,0,1,29.431,44.123Z" transform="translate(0 -31.05)"/></g></g></svg>'
    )
  );
  $('#cabecalho .atalhos-mobile .icon-user').append(
    $(
      '<svg class="icon" xmlns="http://www.w3.org/2000/svg" id="enter" width="22.878" height="22.878" viewBox="0 0 22.878 22.878"> <g id="Grupo_2" data-name="Grupo 2" transform="translate(0 0)"> <path id="Caminho_8" data-name="Caminho 8" d="M677.312,200.155l-3.742,3.742a1.731,1.731,0,0,0,0,1.9l3.742,3.739c.374.377,1.662.377,1.662-.4V200.56C678.973,199.781,677.686,199.781,677.312,200.155Z" transform="translate(-656.095 -194.807)" fill="#3b3b3b"/> <path id="Caminho_9" data-name="Caminho 9" d="M11.439,0H0V17.159l8.579,5.719v-2.86h2.86a2.862,2.862,0,0,0,2.86-2.86V2.861A2.86,2.86,0,0,0,11.439,0Zm0,17.159H8.578V5.721l-4.29-2.86h7.149Z" transform="translate(0 -0.001)" fill="#3b3b3b"/> </g> </svg>'
    )
  );
  $('#cabecalho .atalhos-mobile .icon-shopping-cart').append(
    $(
      '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24.864" height="28.919" viewBox="0 0 24.864 28.919"> <path id="Sacola" d="M42.364,37.291,40.452,20.46a.549.549,0,0,0-.574-.5H36.626V18.356a6.694,6.694,0,0,0-13.388,0v1.607H19.986a.579.579,0,0,0-.574.5L17.5,37.291v.076a3.249,3.249,0,0,0,3.251,3.251H39.113a3.249,3.249,0,0,0,3.251-3.251ZM25.151,18.356a4.782,4.782,0,0,1,9.563,0v1.607H25.151Zm-.956,8.76A1.913,1.913,0,1,1,26.107,25.2,1.894,1.894,0,0,1,24.194,27.116Zm11.476,0A1.913,1.913,0,1,1,37.583,25.2,1.894,1.894,0,0,1,35.67,27.116Z" transform="translate(-17.5 -11.7)" fill="#000000"/> </svg>'
    )
  );
  $('#cabecalho .atalhos-mobile .icon-signout').append(
    $(
      "<svg class='icon' xmlns='http://www.w3.org/2000/svg' viewBox='-288.562 1106 19.601 16'><path id='Union_80' data-name='Union 80' class='cls-1' d='M362.053-1095.964a3.467,3.467,0,0,1-2.544-1.057,3.467,3.467,0,0,1-1.056-2.543v-8.8a3.468,3.468,0,0,1,1.056-2.543,3.467,3.467,0,0,1,2.544-1.056h4a.384.384,0,0,1,.281.119.384.384,0,0,1,.119.281c0,.033,0,.117.012.25a3.251,3.251,0,0,1,.006.331,2.07,2.07,0,0,1-.038.293.411.411,0,0,1-.125.244.375.375,0,0,1-.256.081h-4a1.926,1.926,0,0,0-1.413.588,1.925,1.925,0,0,0-.588,1.412v8.8a1.925,1.925,0,0,0,.588,1.412,1.924,1.924,0,0,0,1.413.588h3.9l.144.013q.144.012.144.037c0,.016.033.039.1.068s.1.067.087.113a.324.324,0,0,0,.025.169c0,.034,0,.117.012.25a3,3,0,0,1,.006.331,2.152,2.152,0,0,1-.037.294.415.415,0,0,1-.125.244.38.38,0,0,1-.256.081Zm7.838-.637a.768.768,0,0,1-.238-.563v-3.6h-5.6a.769.769,0,0,1-.563-.238.767.767,0,0,1-.238-.562v-4.8a.769.769,0,0,1,.238-.562.77.77,0,0,1,.563-.238h5.6v-3.6a.771.771,0,0,1,.237-.563.771.771,0,0,1,.563-.237.769.769,0,0,1,.562.237l6.8,6.8a.77.77,0,0,1,.238.563.769.769,0,0,1-.238.563l-6.8,6.8a.77.77,0,0,1-.563.238A.768.768,0,0,1,369.891-1096.6Z' transform='translate(-647.015 2217.964)'/></svg>"
    )
  );

  $('.produto div.principal .cep label').prepend(
    $(
      '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="21.343" height="15" viewBox="0 0 21.343 15"><path id="caminhofrete" d="M.749,100.933V91.853a.914.914,0,0,1,.914-.914h9.076a.914.914,0,0,1,.914.914v9.081a.3.3,0,0,1-.3.3H1.053A.3.3,0,0,1,.749,100.933Zm7.329,3.111a1.895,1.895,0,1,1-1.895-1.895A1.895,1.895,0,0,1,8.078,104.044Zm-.948,0a.948.948,0,1,0-.947.948A.947.947,0,0,0,7.13,104.044Zm-2.58-1.9H.3a.3.3,0,0,0-.3.3v.924a.3.3,0,0,0,.3.3h3.4A2.5,2.5,0,0,1,4.551,102.149Zm13.442,1.9a1.895,1.895,0,1,1-1.895-1.895A1.895,1.895,0,0,1,17.993,104.044Zm-.947,0a.948.948,0,1,0-.948.948A.948.948,0,0,0,17.045,104.044Zm4.3-1.59v.924a.3.3,0,0,1-.3.3H18.572a2.5,2.5,0,0,0-4.95,0H8.658a2.5,2.5,0,0,0-.843-1.533h4.708V93.438a.609.609,0,0,1,.609-.609h2.875A2.436,2.436,0,0,1,18.026,93.9l1.854,2.745A2.436,2.436,0,0,1,20.3,98.01v4.139h.741A.3.3,0,0,1,21.343,102.454Zm-3.09-5.736-1.482-2.106a.3.3,0,0,0-.249-.129H14.21a.3.3,0,0,0-.3.3v2.106a.3.3,0,0,0,.3.3H18A.3.3,0,0,0,18.253,96.717Z" transform="translate(0 -90.939)" fill="#858787"/></svg>'
    )
  );

  //Produto
  if (screen.width < 767 || screen.height < 700) {
    $('.secao-principal .produto .row-fluid:nth-child(3)').before(
      $('#modalVideo')
    );
  } else {
    $('.secao-principal .produto .row-fluid:nth-child(2)').before(
      $('#modalVideo')
    );
  }

  //Mobile
  $('#cabecalho .atalhos-mobile .icon-shopping-cart').append(
    $('#cabecalho .carrinho .qtd-carrinho').clone()
  );

  LI.methods.showcase();
  LI.methods.buyOfShowcase();
  LI.methods.freeShipping();
  LI.methods.account();
  LI.methods.support();
  LI.methods.addWishList();
  LI.methods.cartWithPrice();
  LI.methods.fullMenu();
  LI.methods.otherCategories();
  LI.methods.menuWithOffers();
  LI.methods.offers();
  LI.methods.counterOffer();
  LI.methods.widthMenu();
  LI.methods.toggleMenu();
  LI.methods.mobileMenu();
  LI.methods.fullbannerMobile();
  LI.methods.fixedHeader();
  LI.methods.fixedSearch();
  LI.methods.sizeTable();
  LI.methods.share();
  LI.methods.tabs();
  LI.methods.tracking();
  LI.methods.video();
  // LI.methods.instagram();
  LI.methods.floatIcons();
  LI.methods.scrollToTop();
  //LI.methods.copyright();
  LI.methods.arrumarbanner();
  LI.methods.infoBanner();
  LI.methods.buscaMobile();
  LI.methods.whatsAppFixed();
  LI.methods.discountOff();
  LI.methods.tarjaTop();
});

// EXTRA
try {
  DomReady.ready(function () {
    $('#rodape .institucional .conteiner .row-fluid .row-fluid').prepend(
      `<div class="span1 spacer"></div>`
    );
    $(
      '#rodape .institucional .conteiner .row-fluid .row-fluid'
    ).prepend(/*html*/ `
    <div class="span4 links-rodape links-rodape-logo-e-info">
          <ul class="logo-e-info">
              <li>
                  <a href="/">
                      <img src="${
                        document.querySelector('#cabecalho .logo img')
                          ? document.querySelector('#cabecalho .logo img').src
                          : ''
                      }">
                  </a>
              </li>
          </ul>
      </div>`);

    try {
      $('#rodape .pagamento-selos + div').after(
        document.querySelector('#rodape .pagamento-selos + div').outerHTML
      );
      document.querySelector(
        '#rodape .pagamento-selos + div + div '
      ).innerHTML =
        "<a href='https://www.siterelampago.com.br'><img id='site-relampago-logo' src='https://cdn.awsli.com.br/1826/1826247/arquivos/logo-rodape-site-relampago.jpg' /></a>";
    } catch (e) {
      console.log(e);
    }

    window.addEventListener('load', function () {
      try {
        document
          .querySelector(
            '#cabecalho > div.full.menu.hidden-phone > div > ul > li.offers.com-filho > a'
          )
          .setAttribute('href', objetoOfertas.url);
      } catch (error) {
        console.log(error);
      }
    });

    try {
      document.querySelector('#rodape > div:nth-child(3)').style.display =
        'none';
    } catch (error) {
      console.log(error);
    }

    if (document.querySelector('body.pagina-inicial')) {
      try {
        const marcas = document.querySelector('.marcas.hidden-phone');
        document
          .querySelector('#corpo .conteiner')
          .append(marcas ? marcas : '');
      } catch (e) {
        console.log(e);
      }
    }
  });
} catch (e) {
  console.log(e);
}

document.addEventListener('DOMContentLoaded', function (event) {
  try {
    let firstIconSvg = document.querySelector(
      '#cabecalho > div.full.menu.hidden-phone > div > ul > li.all-categories.com-filho > a > strong > svg'
    );

    let alambiques = document.querySelector(
      '#cabecalho > div.full.menu.hidden-phone > div > ul > li.categoria-id-17375906.com-filho.borda-principal'
    );
    document
      .querySelector('#cabecalho > div.full.menu.hidden-phone ul.nivel-um')
      .prepend(alambiques);

    alambiques.querySelector('.titulo').prepend(firstIconSvg);

    alambiques.classList.add('all-categories');

    let categoriaPaginas = document.querySelectorAll('li.categoria-paginas');
    categoriaPaginas.forEach((el) => {
      el.classList.remove('com-filho');
      el.querySelector('.nivel-dois').remove();
      el.querySelector('a strong').innerText = 'Quem Somos';
      el.querySelector('a').href = '#about-us-section';
    });
  } catch (e) {
    console.log(e);
  }
});

//novo quem somos
$(document).ready(function () {
  //icone da navbar
  $(
    '#cabecalho > div.full.menu.hidden-phone > div > ul'
  ).append(`<li class="quem-somos-17976708  borda-principal" style="width: 14.2857%;">
        <a href="#quem-somos-new" title="#">
          <strong class="titulo cor-secundaria">Quem Somos</strong>
        </a>
      </li>`);
  $('#barraNewsletter').before(/*html*/ `<div id="quem-somos-new">
  <img src="https://i.imgur.com/38CHrbD.jpg" />
  <div class="descricao-quem-somos">
    <h1>Quem somos</h1>
    <p>
      A Paratydrinks, é um e-commerce especializado na distribuição de
      cachaças premium. Nasceu através do amor pela cidade de Paraty, onde
      foi fundada, e pelo prazer de degustar uma boa cachaça. Paraty, cidade
      considerada uma das maiores produtoras de cachaça do Brasil, possui
      ainda enraizada em sua cultura a maneira artesanal de produzir
      cachaça. Com um acervo de cachaças que possuem premiações nacionais e
      internacionais, oferecemos todas as opções de cachaças e licores
      produzidas na cidade. Nosso amor não para por aí, comercializamos
      também as mais conceituadas cachaças do Brasil. Somos apaixonados por
      cachaça, Compre com quem intende do assunto!
    </p>
  </div>
</div>`);
});

document.querySelector(
  '#rodape > div.institucional.fundo-secundario > div > div > div > div > div.span4.links-rodape.links-rodape-paginas > ul > li:nth-child(2) > a'
).href = '#quem-somos-new';