(function ($) {
  "use strict";


/*=================================
      JS Index Here
  ==================================*/
  /*
    01. Preloader
    02. Mobile Menu Active
    03. Sticky fix
    04. Scroll To Top
    05. Set Background Image
    06. Global Slider
    07. Ajax Contact Form
    08. Magnific Popup
    09. Filter
    10. Popup Sidemenu   
    11. Counter section
    12. side cart toggle
    13. Search Box Popup
    14. Lenis Library Support
    15. Split Text Animation With GSAP Plugins
    16. Active Menu Item Based On URL
    17. Back to Top
    18. countdown timer
    19. Renge
    20. Element Movement On Mouse Enter With GSAP Plugins
    21. Parallax Zoom Animation
    22. testis slider
    23. range
    24. Progress Bar
    25. Quantity
    26. flipdown
  */
  /*=================================
      JS Index End
  ==================================*/
  /*




  /* -----------------------
     Helper utilities
  ----------------------- */
  const safeQuery = (selector, context = document) =>
    context ? context.querySelector(selector) : null;

  const safeQueryAll = (selector, context = document) =>
    context ? Array.from(context.querySelectorAll(selector)) : [];

  const isFunction = (v) => typeof v === "function";

  const noop = () => {};

  // Throttle helper
  const throttle = (fn, wait = 100) => {
    let last = 0;
    let timeout = null;
    return function (...args) {
      const now = Date.now();
      const remaining = wait - (now - last);
      const context = this;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        last = now;
        fn.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(() => {
          last = Date.now();
          timeout = null;
          fn.apply(context, args);
        }, remaining);
      }
    };
  };
  const safeInit = (fn) => {
    try {
      if (isFunction(fn)) fn();
    } catch (err) {
      
    }
  };

  /* -----------------------
     Cached selectors (global)
     Cached after DOM ready where appropriate
  ----------------------- */

  // We'll cache some selectors after DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    // Basic caches
    const $window = window;
    const docEl = document.documentElement;
    const body = document.body;

    // jQuery caches (for parts using jQuery)
    const $formMessages = $(".form-messages");
    const $ajaxForm = $(".ajax-contact");

  /* ===========================
      01. Preloader
  =========================== */
  $(window).on("load", function () {
    try {
      const $preloader = $(".preloader");
      const $preloaderClose = $(".preloaderCls");

      // Preloader exists?
      if ($preloader.length) {
        // GSAP safe check
        if (typeof gsap !== "undefined" && typeof gsap.to === "function") {
          gsap.to(".preloader", {
            y: "-100%",
            duration: 1.2,
            ease: "power3.inOut",
            onComplete: function () {
              $preloader.hide();
            },
          });
        } else {
          // Fallback if GSAP missing
          $preloader.fadeOut(500);
        }

        // Close button check
        if ($preloaderClose.length) {
          $preloaderClose.on("click", function (e) {
            e.preventDefault();

            if (typeof gsap !== "undefined") {
              gsap.to(".preloader", {
                y: "-100%",
                duration: 1.2,
                ease: "power3.inOut",
                onComplete: function () {
                  $preloader.hide();
                },
              });
            } else {
              $preloader.fadeOut(500);
            }
          });
        }
      }

      /* AOS Safe Init */
      if (typeof AOS !== "undefined" && typeof AOS.init === "function") {
        AOS.init({
          once: true,
        });
      }
    } catch (err) {
      console.warn("Preloader init failed:", err);
    }
  });


    /* ===========================
       02. Mobile Menu Active
    =========================== */
    safeInit(() => {
      // keep original plugin API but avoid var usage
      $.fn.vsmobilemenu = function (options) {
        const opt = $.extend(
          {
            menuToggleBtn: ".vs-menu-toggle",
            bodyToggleClass: "vs-body-visible",
            subMenuClass: "vs-submenu",
            subMenuParent: "vs-item-has-children",
            subMenuParentToggle: "vs-active",
            meanExpandClass: "vs-mean-expand",
            appendElement: '<span class="vs-mean-expand"></span>',
            subMenuToggleClass: "vs-open",
            toggleSpeed: 400,
          },
          options
        );

        return this.each(function () {
          const menu = $(this);

          function menuToggle() {
            menu.toggleClass(opt.bodyToggleClass);

            const subMenu = "." + opt.subMenuClass;
            $(subMenu).each(function () {
              const $this = $(this);
              if ($this.hasClass(opt.subMenuToggleClass)) {
                $this.removeClass(opt.subMenuToggleClass).css("display", "none");
                $this.parent().removeClass(opt.subMenuParentToggle);
              }
            });
          }

          // Setup submenus
          menu.find("li").each(function () {
            const submenu = $(this).find("ul");
            if (submenu.length) {
              submenu.addClass(opt.subMenuClass).css("display", "none");
              submenu.parent().addClass(opt.subMenuParent);
              submenu.prev("a").append(opt.appendElement);
              submenu.next("a").append(opt.appendElement);
            }
          });

          function toggleDropDown($element) {
            const $el = $($element);
            if ($el.next("ul").length > 0) {
              $el.parent().toggleClass(opt.subMenuParentToggle);
              $el.next("ul").slideToggle(opt.toggleSpeed).toggleClass(opt.subMenuToggleClass);
            } else if ($el.prev("ul").length > 0) {
              $el.parent().toggleClass(opt.subMenuParentToggle);
              $el.prev("ul").slideToggle(opt.toggleSpeed).toggleClass(opt.subMenuToggleClass);
            }
          }

          const expandToggler = "." + opt.meanExpandClass;
          $(expandToggler).each(function () {
            $(this).on("click", function (e) {
              e.preventDefault();
              toggleDropDown($(this).parent());
            });
          });

          $(opt.menuToggleBtn).each(function () {
            $(this).on("click", function () {
              menuToggle();
            });
          });

          menu.on("click", function (e) {
            e.stopPropagation();
            menuToggle();
          });

          menu.find("div").on("click", function (e) {
            e.stopPropagation();
          });
        });
      };

      $(".vs-menu-wrapper").vsmobilemenu();
    });

    const stickyTarget = safeQuery(".sticky-active");
    const scrollToTopBtnSel = ".scrollToTop";
    const $scrollToTopBtn = $(scrollToTopBtnSel);
    const scrollToTopBtnExists = !!$scrollToTopBtn.length;

    let lastScrollTop = 0;
    let counterTriggered = false;

    // Helper functions used by scroll handler
    const handleSticky = () => {
      if (!stickyTarget) return;
      try {
        const st = window.pageYOffset || docEl.scrollTop;
        const parent = stickyTarget.parentElement;
        if (!parent) return;
        const height = window.getComputedStyle(stickyTarget).height;
        parent.style.minHeight = height;
        if (st > 800) {
          parent.classList.add("will-sticky");
          if (st > lastScrollTop) {
            stickyTarget.classList.remove("active");
          } else {
            stickyTarget.classList.add("active");
          }
        } else {
          parent.style.minHeight = "";
          parent.classList.remove("will-sticky");
          stickyTarget.classList.remove("active");
        }
        lastScrollTop = st;
      } catch (err) {
        // silent
      }
    };

    const handleBackToTopVisibility = () => {
      if (!scrollToTopBtnExists) return;
      try {
        if (window.pageYOffset > 500) {
          $($scrollToTopBtn).addClass("show");
        } else {
          $($scrollToTopBtn).removeClass("show");
        }
      } catch (err) {}
    };

    // Counter trigger (run once when in view)
    const handleCounters = () => {
      try {
        if (counterTriggered) return;
        const mediaCounter = $(".media-counter");
        if (!mediaCounter.length) return;
        const oTop = mediaCounter.offset().top - window.innerHeight;
        if ($(window).scrollTop() > oTop) {
          $(".counter-number").each(function () {
            const $this = $(this);
            const countTo = parseInt($this.attr("data-count"), 10) || 0;
            $({ countNum: parseInt($this.text(), 10) || 0 }).animate(
              { countNum: countTo },
              {
                duration: 4000,
                easing: "swing",
                step: function () {
                  $this.text(Math.floor(this.countNum));
                },
                complete: function () {
                  $this.text(this.countNum);
                },
              }
            );
          });
          counterTriggered = true;
        }
      } catch (err) {
        // ignore
      }
    };

    /* Progress circle update (back-to-top progress) */
    const progressCircleEl = safeQuery(".progress");
    const progressPercentageEl = safeQuery("#progressPercentage");
    const BACK_CIRCLE_RADIUS = 40;
    const BACK_CIR_C = 2 * Math.PI * BACK_CIRCLE_RADIUS;
    if (progressCircleEl) {
      try {
        progressCircleEl.style.strokeDasharray = BACK_CIR_C;
        progressCircleEl.style.strokeDashoffset = BACK_CIR_C;
      } catch (err) {}
    }

    const updateProgress = () => {
      try {
        if (!progressCircleEl || !progressPercentageEl) return;
        const scrollPosition = window.scrollY || window.pageYOffset;
        const totalHeight = docEl.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) return;
        const scrollPercentage = (scrollPosition / totalHeight) * 100;
        const offset = BACK_CIR_C * (1 - scrollPercentage / 100);
        progressCircleEl.style.strokeDashoffset = offset.toFixed(2);
        progressPercentageEl.textContent = `${Math.round(scrollPercentage)}%`;
      } catch (err) {}
    };

    // Single throttled scroll handler
    const onScroll = throttle(() => {
      handleSticky();
      handleBackToTopVisibility();
      handleCounters();
      updateProgress();
      // other scroll-related safe calls could be added here
    }, 60);

    // Attach single scroll handler
    window.addEventListener("scroll", onScroll, { passive: true });

    // Back to top click (safe)
    if (scrollToTopBtnExists && document.getElementById("backToTop")) {
      const backToTopBtn = document.getElementById("backToTop");
      backToTopBtn.addEventListener("click", () => {
        safeInit(() => {
          if (typeof gsap !== "undefined" && isFunction(gsap.to)) {
            gsap.to(window, { duration: 1, scrollTo: 0 });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
      });
    }

    // Initial fire for progress & sticky etc.
    safeInit(() => {
      handleSticky();
      handleBackToTopVisibility();
      updateProgress();
      handleCounters();
    });

    /* ===========================
       05. Set Background Image
       =========================== */
    safeInit(() => {
      $("[data-bg-src]").each(function () {
        const $el = $(this);
        const src = $el.attr("data-bg-src");
        if (src) {
          $el.css("background-image", `url(${src})`);
          $el.removeAttr("data-bg-src").addClass("background-image");
        }
      });
    });

    /* ===========================
      06. Global Slider
      =========================== */
     $(".vs-carousel").each(function () {
        var asSlide = $(this);

        // Collect Data
        function d(data) {
          return asSlide.data(data);
        }

        // Custom Arrow Button
        var prevButton =
          '<button type="button" class="slick-prev"><i class="' +
          d("prev-arrow") +
          '"></i></button>',
          nextButton =
          '<button type="button" class="slick-next"><i class="' +
          d("next-arrow") +
          '"></i></button>';

        // Function For Custom Arrow Btn
        $("[data-slick-next]").each(function () {
          $(this).on("click", function (e) {
            e.preventDefault();
            $($(this).data("slick-next")).slick("slickNext");
          });
        });

        $("[data-slick-prev]").each(function () {
          $(this).on("click", function (e) {
            e.preventDefault();
            $($(this).data("slick-prev")).slick("slickPrev");
          });
        });

        // Check for arrow wrapper
        if (d("arrows") == true) {
          if (!asSlide.closest(".arrow-wrap").length) {
            asSlide.closest(".container").parent().addClass("arrow-wrap");
          }
        }

        asSlide.slick({
          dots: d("dots") ? true : false,
          fade: d("fade") ? true : false,
          arrows: d("arrows") ? true : false,
          speed: d("speed") ? d("speed") : 1000,
          asNavFor: d("asnavfor") ? d("asnavfor") : false,
          autoplay: d("autoplay") == true ? true : false,
          infinite: d("infinite") == false ? false : true,
          slidesToShow: d("slide-show") ? d("slide-show") : 1,
          adaptiveHeight: d("adaptive-height") ? true : false,
          centerMode: d("center-mode") ? true : false,
          autoplaySpeed: d("autoplay-speed") ? d("autoplay-speed") : 8000,
          centerPadding: d("center-padding") ? d("center-padding") : "0",
          focusOnSelect: d("focuson-select") == false ? false : true,
          pauseOnFocus: d("pauseon-focus") ? true : false,
          pauseOnHover: d("pauseon-hover") ? true : false,
          variableWidth: d("variable-width") ? true : false,
          vertical: d("vertical") ? true : false,
          verticalSwiping: d("vertical") ? true : false,
          prevArrow: d("prev-arrow") ?
            prevButton : '<button type="button" class="slick-prev"><i class="fa-solid fa-arrow-left"></i></button>',
          nextArrow: d("next-arrow") ?
            nextButton : '<button type="button" class="slick-next"><i class="fa-solid fa-arrow-right"></i></button>',
          rtl: $("html").attr("dir") == "rtl" ? true : false,
          responsive: [{
              breakpoint: 1600,
              settings: {
                arrows: d("xl-arrows") ? true : false,
                dots: d("xl-dots") ? true : false,
                slidesToShow: d("xl-slide-show") ?
                  d("xl-slide-show") : d("slide-show"),
                centerMode: d("xl-center-mode") ? true : false,
                centerPadding: 0,
              },
            },
            {
              breakpoint: 1400,
              settings: {
                arrows: d("ml-arrows") ? true : false,
                dots: d("ml-dots") ? true : false,
                slidesToShow: d("ml-slide-show") ?
                  d("ml-slide-show") : d("slide-show"),
                centerMode: d("ml-center-mode") ? true : false,
                centerPadding: 0,
              },
            },
            {
              breakpoint: 1300,
              settings: {
                arrows: d("mld-arrows") ? true : false,
                dots: d("mld-dots") ? true : false,
                slidesToShow: d("mld-slide-show") ?
                  d("mld-slide-show") : d("slide-show"),
                centerMode: d("mld-center-mode") ? true : false,
                centerPadding: 0,
              },
            },
            {
              breakpoint: 1200,
              settings: {
                arrows: d("lg-arrows") ? true : false,
                dots: d("lg-dots") ? true : false,
                // vertical:d("lg-vertical") ? true : false,
                slidesToShow: d("lg-slide-show") ?
                  d("lg-slide-show") : d("slide-show"),
                centerMode: d("lg-center-mode") ? d("lg-center-mode") : false,
                centerPadding: 0,
              },
            },
            {
              breakpoint: 992,
              settings: {
                arrows: d("md-arrows") ? true : false,
                dots: d("md-dots") ? true : false,
                vertical:d("md-vertical") ? true : false,
                slidesToShow: d("md-slide-show") ? d("md-slide-show") : 1,
                centerMode: d("md-center-mode") ? d("md-center-mode") : false,
                centerPadding: 0,
              },
            },
            {
              breakpoint: 767,
              settings: {
                arrows: d("sm-arrows") ? true : false,
                dots: d("sm-dots") ? true : false,
                vertical:d("sm-vertical") ? true : false,
                slidesToShow: d("sm-slide-show") ? d("sm-slide-show") : 1,
                centerMode: d("sm-center-mode") ? d("sm-center-mode") : false,
                centerPadding: 0,
              },
            },
            {
              breakpoint: 576,
              settings: {
                arrows: d("xs-arrows") ? true : false,
                dots: d("xs-dots") ? true : false,
                vertical:d("xs-vertical") ? true : false,
                slidesToShow: d("xs-slide-show") ? d("xs-slide-show") : 1,
                centerMode: d("xs-center-mode") ? d("xs-center-mode") : false,
                centerPadding: 0,
              },
            },
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
          ],
        });
      });
    /* ===========================
       07. Ajax Contact Form
       =========================== */
    safeInit(() => {
      const formSelector = ".ajax-contact";
      const formEl = document.querySelector(formSelector);
      if (!formEl) return;

      const invalidCls = "is-invalid";
      const emailSelector = `${formSelector} [name="email"]`;
      const validationSelector = `${formSelector} [name="name"],${formSelector} [name="email"],${formSelector} [name="subject"],${formSelector} [name="message"]`;

      const validateContact = () => {
        let valid = true;
        try {
          // split selectors and test each
          const selectors = validationSelector.split(",");
          selectors.forEach((sel) => {
            const node = document.querySelector(sel);
            if (!node || !node.value || !node.value.trim()) {
              if (node) node.classList.add(invalidCls);
              valid = false;
            } else {
              node.classList.remove(invalidCls);
            }
          });

          const emailNode = document.querySelector(emailSelector);
          const emailVal = emailNode ? (emailNode.value || "").trim() : "";
          const emailRegex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          if (!emailVal || !emailRegex.test(emailVal)) {
            if (emailNode) emailNode.classList.add(invalidCls);
            valid = false;
          } else if (emailNode) {
            emailNode.classList.remove(invalidCls);
          }
        } catch (err) {
          valid = false;
        }
        return valid;
      };

      const sendContact = () => {
        if (!validateContact()) return;
        const $form = $(formSelector);
        const formData = $form.serialize();
        const actionUrl = $form.attr("action") || window.location.href;

        $.ajax({
          url: actionUrl,
          data: formData,
          type: "POST",
          dataType: "json",
          timeout: 10000, // 10s timeout
        })
          .done((response) => {
            try {
              $formMessages.removeClass("error").addClass("success");
              // If server returns JSON message
              const msg = response && response.message ? response.message : "Message sent successfully.";
              $formMessages.html(msg);
              $form.find('input:not([type="submit"]), textarea').val("");
            } catch (err) {
              $formMessages.removeClass("error").addClass("success").text("Message sent.");
            }
          })
          .fail((xhr, textStatus) => {
            $formMessages.removeClass("success").addClass("error");
            if (textStatus === "timeout") {
              $formMessages.text("Request timed out. Please try again.");
            } else if (xhr && xhr.responseJSON && xhr.responseJSON.message) {
              $formMessages.text(xhr.responseJSON.message);
            } else if (xhr && xhr.responseText) {
              // if backend returns HTML/text
              $formMessages.html(xhr.responseText);
            } else {
              $formMessages.text("Oops! An error occurred and your message could not be sent.");
            }
          });
      };

      $(formSelector).on("submit", function (e) {
        e.preventDefault();
        sendContact();
      });
    });

    /* ===========================
       08. Magnific Popup
       =========================== */
    safeInit(() => {
      if ($.fn.magnificPopup) {
        $(".popup-image").magnificPopup({ type: "image", gallery: { enabled: true } });
        $(".popup-video").magnificPopup({ type: "iframe" });
      }
    });

    /* ===========================
       09. Filter (Isotope + imagesLoaded)
       =========================== */
    safeInit(() => {
      const $filterContainer = $(".filter-active");
      const $filterMenu = $(".filter-menu-active");
      if (!$filterContainer.length) return;

      try {
        if ($filterContainer.imagesLoaded && $filterContainer.isotope) {
          $filterContainer.imagesLoaded(function () {
            const $grid = $filterContainer.isotope({
              itemSelector: ".filter-item",
              layoutMode: "masonry",
              filter: "*",
              masonry: { columnWidth: ".filter-item" },
            });

            $filterMenu.on("click", "button", function (e) {
              e.preventDefault();
              const filterValue = $(this).data("filter");
              $grid.isotope({ filter: filterValue });
              $(this).addClass("active").siblings().removeClass("active");
            });
          });
        }
      } catch (err) {
        // isotope/imagesLoaded not available — ignore gracefully
      }
    });

    /* ===========================
       10. Popup Sidemenu (safe)
       =========================== */
    safeInit(() => {
      const popupSideMenu = ($sideMenu, $sideMunuOpen, $sideMenuCls, $toggleCls) => {
        $($sideMunuOpen).on("click", function (e) {
          e.preventDefault();
          $($sideMenu).addClass($toggleCls);
        });
        $($sideMenu).on("click", function (e) {
          e.stopPropagation();
          $($sideMenu).removeClass($toggleCls);
        });
        const sideMenuChild = `${$sideMenu} > div`;
        $(sideMenuChild).on("click", function (e) {
          e.stopPropagation();
          $($sideMenu).addClass($toggleCls);
        });
        $($sideMenuCls).on("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          $($sideMenu).removeClass($toggleCls);
        });
      };
      popupSideMenu(".sidemenu-wrapper", ".sideMenuToggler", ".sideMenuCls", "show");
    });

    /* ===========================
       11. Counter section
       (moved into onScroll handler above for single scroll)
       =========================== */

    /* ===========================
       12. Side cart toggle
       =========================== */
    safeInit(() => {
      $(document).on("click", ".sideMenuCls2", function () {
        $(".sideCart-wrapper").removeClass("show");
      });

      $(document).on("click", ".sideCart-wrapper", function (event) {
        if (!$(event.target).closest(".sidemenu-content").length) {
          $(".sideCart-wrapper").toggleClass("show");
        }
      });

      $(document).on("click", ".sideCartToggler", function () {
        $(".sideCart-wrapper").toggleClass("show");
      });
    });

    /* ===========================
       13. Search Box Popup
       =========================== */
    safeInit(() => {
      function popupSarchBox($searchBox, $searchOpen, $searchCls, $toggleCls) {
        $($searchOpen).on("click", function (e) {
          e.preventDefault();
          $($searchBox).addClass($toggleCls);
        });
        $($searchBox).on("click", function (e) {
          e.stopPropagation();
          $($searchBox).removeClass($toggleCls);
        });
        $($searchBox).find("form").on("click", function (e) {
          e.stopPropagation();
          $($searchBox).addClass($toggleCls);
        });
        $($searchCls).on("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          $($searchBox).removeClass($toggleCls);
        });
      }
      popupSarchBox(".popup-search-box", ".searchBoxTggler", ".searchClose", "show");
    });

    /* ===========================
       14. Lenis + GSAP + ScrollTrigger
       =========================== */
    // safeInit(() => {
    //   try {
    //     if (typeof gsap !== "undefined") {
    //       gsap.registerPlugin && safeInit(() => gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText));
    //     }
    //   } catch (err) {}

    //   safeInit(() => {
    //     if (typeof Lenis !== "undefined") {
    //       try {
    //         const lenis = new Lenis({
    //           lerp: 0.1,
    //           touchMultiplier: 0,
    //           smoothWheel: true,
    //           smoothTouch: false,
    //           mouseWheel: false,
    //           autoResize: true,
    //           smooth: true,
    //           easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    //           syncTouch: true,
    //         });
    //         if (lenis && lenis.on && ScrollTrigger) {
    //           lenis.on("scroll", ScrollTrigger.update);
    //         }
    //         if (typeof gsap !== "undefined" && gsap.ticker) {
    //           gsap.ticker.add((time) => {
    //             lenis.raf(time * 1200);
    //           });
    //         }
    //       } catch (err) {
    //         // Lenis failed — ignore
    //       }
    //     }
    //   });
    // });

    /* ===========================
       15. Split Text Animation With GSAP
       =========================== */
    safeInit(() => {
      if (typeof SplitText === "undefined" || typeof gsap === "undefined") return;
      const vsTitleAnimation = () => {
        const vsElements = document.querySelectorAll(".title-anime");
        if (!vsElements || !vsElements.length) return;

        vsElements.forEach((container) => {
          const quotes = container.querySelectorAll(".title-anime__title");
          if (!quotes) return;
          quotes.forEach((quote) => {
            try {
              if (quote.animation) {
                quote.animation.kill && quote.animation.kill();
                quote.split && quote.split.revert && quote.split.revert();
              }
              quote.style.textTransform = "initial";
              const animationClass = container.className.match(/animation-(style\d+)/);
              if (!animationClass || animationClass[1] === "style4") return;

              quote.split = new SplitText(quote, { type: "lines,words,chars", linesClass: "split-line" });
              gsap.set(quote, { perspective: 1000 });

              const chars = quote.split.chars;
              const style = animationClass[1];
              const initialStates = {
                style1: { opacity: 0, y: "90%", rotateX: "-40deg" },
                style2: { opacity: 0, x: "50" },
                style3: { opacity: 0 },
                style4: { opacity: 0, skewX: "-30deg", scale: 0.8 },
                style5: { opacity: 0, scale: 0.5 },
                style6: { opacity: 0, y: "-100%", rotate: "45deg" },
              };

              gsap.set(chars, initialStates[style] || initialStates.style3);

              quote.animation = gsap.to(chars, {
                x: "0",
                y: "0",
                rotateX: "0",
                rotate: "0",
                opacity: 1,
                skewX: "0",
                scale: 1,
                duration: 1,
                ease: "back.out(1.7)",
                stagger: 0.02,
                scrollTrigger: {
                  trigger: quote,
                  start: "top 90%",
                  toggleActions: "play none none none",
                },
              });
            } catch (err) {
              // skip faulty quote
            }
          });
        });
      };

      ScrollTrigger && ScrollTrigger.addEventListener && ScrollTrigger.addEventListener("refreshInit", () => {
        document.querySelectorAll(".title-anime__title").forEach((quote) => {
          if (quote.split) quote.split.revert && quote.split.revert();
        });
      });

      ScrollTrigger && ScrollTrigger.addEventListener && ScrollTrigger.addEventListener("refresh", vsTitleAnimation);

      vsTitleAnimation();
      document.addEventListener("DOMContentLoaded", vsTitleAnimation);
    });

    /* ===========================
       16. Active Menu Item Based On URL
       =========================== */
    safeInit(() => {
      const navMenu = document.querySelector(".main-menu");
      const windowPathname = window.location.pathname;
      if (!navMenu) return;
      const navLinkEls = navMenu.querySelectorAll("a");
      navLinkEls.forEach((navLinkEl) => {
        try {
          const navLinkPathname = new URL(navLinkEl.href, window.location.origin).pathname;
          if (windowPathname === navLinkPathname || (windowPathname === "/index.html" && navLinkPathname === "/")) {
            navLinkEl.classList.add("active");
            let parentLi = navLinkEl.closest("li");
            while (parentLi && parentLi !== navMenu) {
              parentLi.classList.add("active");
              parentLi = parentLi.parentElement.closest("li");
            }
          }
        } catch (err) {}
      });
    });

    /* ===========================
       18. Countdown timer 
       =========================== */
    safeInit(() => {
      const offerEl = document.querySelector(".offer-counter");
      const dayEl = document.querySelector(".day");
      const hourEl = document.querySelector(".hour");
      const minuteEl = document.querySelector(".minute");
      const secondEl = document.querySelector(".second");

      const updateCountdown = () => {
        try {
          if (!offerEl) return;
          const offerDateStr = offerEl.getAttribute("data-offer-date");
          if (!offerDateStr) return;
          const offerDate = new Date(offerDateStr);
          if (isNaN(offerDate.getTime())) return;
          const currentDate = new Date();
          let timeDiff = offerDate.getTime() - currentDate.getTime();
          timeDiff = Math.abs(timeDiff);

          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

          dayEl && (dayEl.textContent = days);
          hourEl && (hourEl.textContent = hours);
          minuteEl && (minuteEl.textContent = minutes);
          secondEl && (secondEl.textContent = seconds);
        } catch (err) {}
      };

      updateCountdown();
      setInterval(updateCountdown, 1000);
    });

    /* ===========================
       19. Range slider simple update
       =========================== */
    safeInit(() => {
      const slider = document.getElementById("range-slider__range");
      const output = document.getElementById("range-slider__value");
      if (!slider || !output) return;
      const updateSlider = () => {
        try {
          output.textContent = slider.value;
          const min = parseFloat(slider.min) || 0;
          const max = parseFloat(slider.max) || 100;
          const valuePercent = ((slider.value - min) / (max - min)) * 100;
          slider.style.background = `linear-gradient(to right, #F86E2D 0%, #F86E2D ${valuePercent}%, #d7dcdf ${valuePercent}%, #d7dcdf 100%)`;
        } catch (err) {}
      };
      output.textContent = slider.value;
      slider.addEventListener("input", updateSlider);
      updateSlider();
    });

    /* ===========================
       20. Parallax mouse move
       =========================== */
    safeInit(() => {
      const wrappers = document.querySelectorAll(".parallax-wrap");
      wrappers.forEach((wrap) => {
        wrap.addEventListener("mousemove", (event) => {
          const elements = wrap.querySelectorAll(".parallax-element");
          elements.forEach((element) => {
            const move = parseFloat(element.dataset.move) || 20;
            try {
              const rect = wrap.getBoundingClientRect();
              const relX = event.clientX - rect.left;
              const relY = event.clientY - rect.top;
              const moveX = ((relX - rect.width / 2) / rect.width) * move;
              const moveY = ((relY - rect.height / 2) / rect.height) * move;
              if (typeof gsap !== "undefined") {
                gsap.to(element, { duration: 0.3, x: moveX, y: moveY, ease: Power2 ? Power2.easeOut : "power2.out" });
              } else {
                element.style.transform = `translate(${moveX}px, ${moveY}px)`;
              }
            } catch (err) {}
          });
        });

        wrap.addEventListener("mouseleave", () => {
          const elements = wrap.querySelectorAll(".parallax-element");
          elements.forEach((element) => {
            if (typeof gsap !== "undefined") {
              gsap.to(element, { duration: 0.3, x: 0, y: 0, ease: Power2 ? Power2.easeOut : "power2.out" });
            } else {
              element.style.transform = "";
            }
          });
        });
      });
    });

    /* ===========================
       21. Parallax Zoom Animation
       =========================== */
    safeInit(() => {
      if (typeof gsap === "undefined" || !gsap.utils) return;
      try {
        gsap.utils.toArray("[data-vs-gsap-parallax-speed]").forEach((container) => {
          const img = container.querySelector("img");
          if (!img) return;
          const speed = parseFloat(container.getAttribute("data-vs-gsap-parallax-speed")) || 1;
          const zoomEnabled = container.hasAttribute("data-vs-gsap-parallax-zoom");
          const tl = gsap.timeline({ scrollTrigger: { trigger: container, scrub: true, pin: false } });
          const fromVars = { yPercent: -10 * speed, ease: "none" };
          const toVars = { yPercent: 10 * speed, ease: "none" };
          if (zoomEnabled) {
            fromVars.scale = 1;
            toVars.scale = 1.2;
          }
          tl.fromTo(img, fromVars, toVars);
        });
      } catch (err) {}
    });

    /* ===========================
       22. Testimonials slider 
       =========================== */
    safeInit(() => {
      try {
        const $slider1 = $("#testis_4_1");
        const $slider2 = $("#testis_4_2");
        const $slider3 = $("#testis_4_3");
        if (!$slider1.length || !$slider2.length || !$slider3.length) return;
        if (typeof $slider1.slick !== "function") return;

        $slider1.slick({ dots: true, arrows: false, infinite: true, autoplay: true, autoplaySpeed: 6000, speed: 1000, slidesToShow: 1, slidesToScroll: 1, fade: true, asNavFor: "#testis_4_2", responsive: [{ breakpoint: 1500, settings: { arrows: false } }] });
        $slider2.slick({ dots: false, infinite: true, arrows: false, autoplay: true, autoplaySpeed: 6000, speed: 1000, slidesToShow: 1, slidesToScroll: 1, fade: true, centerMode: true, centerPadding: "0", focusOnSelect: true, asNavFor: "#testis_4_1" });
        $slider3.slick({ dots: false, infinite: true, arrows: false, autoplay: true, autoplaySpeed: 6000, speed: 1000, slidesToShow: 1, slidesToScroll: 1, fade: true });

        $slider1.on("afterChange", function (event, slick, currentSlide) {
          try {
            $slider3.slick("slickGoTo", currentSlide);
          } catch (err) {}
        });

        $slider2.on("afterChange", function (event, slick, currentSlide) {
          try {
            $slider3.slick("slickGoTo", currentSlide);
          } catch (err) {}
        });

        $slider2.on("click", ".slick-slide", function () {
          try {
            const index = $(this).data("slick-index");
            $slider1.slick("slickGoTo", index);
            $slider2.slick("slickGoTo", index);
            $slider3.slick("slickGoTo", index);
          } catch (err) {}
        });
      } catch (err) {}
    });

    /* ===========================
       23. noUiSlider
       =========================== */
    safeInit(() => {
      try {
        const skipSlider = document.getElementById("skipstep");
        const skipLower = document.getElementById("skip-value-lower");
        const skipUpper = document.getElementById("skip-value-upper");
        if (!skipSlider || !skipLower || !skipUpper) return;
        if (typeof noUiSlider === "undefined" || !noUiSlider.create) return;

        noUiSlider.create(skipSlider, {
          start: [0, 100],
          connect: true,
          behaviour: "drag",
          step: 1,
          range: { min: 0, max: 100 },
          format: {
            from: function (value) { return parseInt(value, 10); },
            to: function (value) { return parseInt(value, 10); },
          },
        });

        skipSlider.noUiSlider.on("update", function (values, handle) {
          if (handle === 0) skipLower.innerHTML = values[0];
          else skipUpper.innerHTML = values[1];
        });
      } catch (err) {}
    });

    /* ===========================
       24. Progress Bar
       =========================== */
    safeInit(() => {
      try {
        const progressBoxes = document.querySelectorAll(".progress-box");
        if (!progressBoxes || !progressBoxes.length) return;
        const options = { root: null, rootMargin: "0px", threshold: 0.5 };
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const progressBox = entry.target;
              const progressBar = progressBox.querySelector(".progress-box__bar");
              const progressNumber = progressBox.querySelector(".progress-box__number");
              let targetWidth = 0;
              if (progressBar) {
                targetWidth = parseInt(progressBar.getAttribute("data-width") || progressBar.style.width || "0", 10);
                if (isNaN(targetWidth)) targetWidth = 0;
              }
              let width = 0;
              const countInterval = setInterval(() => {
                width++;
                if (progressBar) progressBar.style.width = width + "%";
                if (progressNumber) progressNumber.textContent = width + "%";
                if (width >= targetWidth) clearInterval(countInterval);
              }, 20);
              obs.unobserve(progressBox);
            }
          });
        }, options);

        progressBoxes.forEach((box) => observer.observe(box));
      } catch (err) {}
    });

    /* ===========================
       25. Quantity controls
       =========================== */
    safeInit(() => {
      $(document).on("click", ".quantity-plus", function (e) {
        e.preventDefault();
        const $qty = $(this).siblings(".qty-input");
        const currentVal = parseInt($qty.val(), 10);
        if (!isNaN(currentVal)) $qty.val(currentVal + 1);
      });

      $(document).on("click", ".quantity-minus", function (e) {
        e.preventDefault();
        const $qty = $(this).siblings(".qty-input");
        const currentVal = parseInt($qty.val(), 10);
        if (!isNaN(currentVal) && currentVal > 1) $qty.val(currentVal - 1);
      });
    });

    /* ===========================
       26. FlipDown
       =========================== */
    safeInit(() => {
      try {
        if (typeof FlipDown === "undefined") return;
        const flipdownEl = document.querySelector(".flipdown");
        if (!flipdownEl) return;
        const toDayFromNow = new Date("Dec 31, 2025 23:59:59").getTime() / 1000;
        const flipdown = new FlipDown(toDayFromNow)
          .start()
          .ifEnded(() => {
            flipdownEl.innerHTML = `<h2>Timer is ended</h2>`;
          });
      } catch (err) {}
    });

  }); 



   /* ===========================
       About list hover active
       (optimized: cached NodeList)
       =========================== */
    safeInit(() => {
      const items = safeQueryAll(".about-list1 .list-box1");
      if (items.length) {
        items[0].classList.add("active");
        items.forEach((item) => {
          item.addEventListener("mouseenter", () => {
            items.forEach((i) => i.classList.remove("active"));
            item.classList.add("active");
          });
          item.addEventListener("mouseleave", () => {
            items.forEach((i) => i.classList.remove("active"));
            items[0].classList.add("active");
          });
        });
      }
    });

})(jQuery);
