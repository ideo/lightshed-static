/*
IDEO for Lightshed
*/

var unvr = {
  fadeSpeed: 3000,
  isMobile: false,
  prevPageIndex: 0,
  pageSwitchSpeed: 800,
  arrowSpeed: 600,

  setup: function() {
    this.preloader();
    this.checkIfMobile();
    this.nav();
    this.resize();
    this.carouselSetup();
    this.watchPop();
    if (this.isMobile) {
      this.bouncingArrow();
    } else {
      this.animateBackground();
    }
    this.calcHeight();
    this.randomBackground();
    this.arrowKeys();

    this.logoAnim();
    this.mobileNav();
  },


  // toggles hamburger and launches mobile nav
  mobileNav: function() {
    $('.hamburger').on('click', function() {
      $(this).toggleClass('expanded');
      $('.mobile_nav').fadeToggle();
    });
  },


  // this bounces arrow on mobile to inform users to swipe right
  bouncingArrow: function() {
    $('.arrow_right_home').transition({ x: '20px' }, unvr.arrowSpeed)
                          .transition({ x: '10px' }, 300)
                          .transition({ x: '20px' }, 300)
                          .transition({ x: '0px' }, unvr.arrowSpeed, function() {
                            setTimeout(unvr.bouncingArrow, 2000);
                          });
  },


  // popups on film pages
  watchPop: function() {
    $('.watch_button').on('click', function() {
      if (unvr.isMobile) {
        $(this).closest('section').find('.watch_pop_mobile').fadeToggle();
        $(this).closest('.owl-item').scrollTo(0, 0);
        $(this).toggleClass('active');
      } else {
        $(this).closest('section').find('.watch_pop').fadeToggle();
        $(this).toggleClass('active');
      }
    });

    $('.close_button').on('click', function() {
      if (unvr.isMobile) {
        $(this).closest('section').find('.watch_pop_mobile').fadeOut();
        $(this).closest('section').find('.watch_button').toggleClass('active');
      } else {
        $(this).closest('section').find('.watch_pop').fadeOut();
        $(this).closest('section').find('.watch_button').toggleClass('active');
      }
    });
  },


  // Preloading images to fix weird "cancelled" requests in Chrome and Firefox on Dreamhost
  preloader: function() {
    for (var i = 0; i < 44; i++) {
      $("<img />").attr("src", 'images/logo/' + i + '.png');
    }

    // complicated preloader so we know when title animation images are loaded
    var promises = [];
    for (var i = 0; i < 44; i++) {
        (function(url, promise) {
            var img = new Image();
            img.onload = function() {
              promise.resolve();
            };
            img.src = url;
        })('images/title_anim/' + i + '.png', promises[i] = $.Deferred());
    }
    $.when.apply($, promises).done(function() {
      unvr.titleAnimation();
    });
  },


  // animates Lightshed logo in upper left when mouseover
  logoAnim: function() {
    var count = 0;
    var totalFrames = 44;

    $('.logo').on('mouseover', function() {
      unvr.logoInterval = setInterval(logoAnimationFunction, 30);
    });
    $('.logo').on('mouseout', function() {
      clearInterval(unvr.logoInterval);
      count = 0;
      $(this).attr('src', 'images/logo/44.png');
    });

    function logoAnimationFunction() {
      $('.logo').attr('src', 'images/logo/' + count + '.png');
      count += 1;
      if (count === totalFrames) {
        clearInterval(unvr.logoInterval);
        count = 0;
        unvr.logoInterval = setInterval(logoAnimationFunction, 30);
      }
    }
  },


  titleAnimation: function() {
    var count = 0;
    var totalFrames = 44;
    var finalFrame = 20;
    unvr.titleInterval = setInterval(titleAnimationFunction, 40);

    function titleAnimationFunction() {
      $('#title_image_scaled').attr('src', 'images/title_anim/' + count + '.png');
      count += 1;
      if (count === totalFrames) {
        clearInterval(unvr.titleInterval);
        setTimeout(function() {
          unvr.titleBackInterval = setInterval(titleAnimationHalfWayBack, 40);
        }, 1000);
      }
    }

    function titleAnimationHalfWayBack() {
      $('#title_image_scaled').attr('src', 'images/title_anim/' + count + '.png');
      count -= 1;
      if (count === finalFrame) {
        clearInterval(unvr.titleBackInterval);

        setTimeout(function() {
          unvr.titleLoopInterval = setInterval(titleAnimationLoop, 400);
        }, 1000);

      }
    }

    function titleAnimationLoop() {
      var currImage = Math.floor(Math.random()*(44-35+1)+35);
      $('#title_image_scaled').attr('src', 'images/title_anim/' + currImage + '.png');
    }
  },


  /* keyboard arrow keys to page through sections */
  arrowKeys: function() {
    $(document).keydown(function(e) {
        switch(e.which) {
            case 37: // left
            unvr.carousel.trigger('prev.owl');
            break;

            case 38: // up
            unvr.carousel.trigger('prev.owl');
            break;

            case 39: // right
            unvr.carousel.trigger('next.owl');
            break;

            case 40: // down
            unvr.carousel.trigger('next.owl');
            break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
  },


  /* random site background on refresh */
  randomBackground: function() {

    var backsArray = [
        {
          image:'images/Background-alt-01.jpg',
          coords: '32 17.44 N 36 19.255 E',
          location: 'Zaatari, Jordan'
        },
        {
          image:'images/Background-alt-02.jpg',
          coords: '32 17.44 N 36 19.255 E',
          location: 'Zaatari, Jordan'
        },
        {
          image:'images/Background-alt-03.jpg',
          coords: '32 17.44 N 36 19.255 E',
          location: 'Zaatari, Jordan'
        },
        {
          image:'images/Background-alt-04.jpg',
          coords: '32 17.44 N 36 19.255 E',
          location: 'Zaatari, Jordan'
        },
        {
          image:'images/Background-alt-05.jpg',
          coords: '6 32.73 N 10 80.64 W',
          location: 'West Point, Liberia'
        }];

    var newBackground = backsArray[Math.floor(Math.random()*backsArray.length)];
    var newBackgroundImage = newBackground.image
    $('.horiz_background').css('background-image', "url(" + newBackgroundImage + ")").addClass('show');
    $('#location_coords').text(newBackground.coords);
    $('#location_place').text(newBackground.location);

    if (!unvr.isMobile) {
      $('.location').addClass('show');
    } else {
      // setTimeout hack to get around fadeIn of two backgrounds showing up with horiz line
      setTimeout(function() {$('.site_nav').css('background-image', "url(" + newBackgroundImage + ")")}, 4000);
    }
  },

  resize: function() {
    $( window ).resize(function() {
      // unvr.calcHeight();
    });
  },

  checkIfMobile: function() {
    var isMobile = false; //initiate as false
    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

    this.isMobile = isMobile;
  },

  calcHeight: function() {
    var windowHeight = $(window).height();
    if (!unvr.isMobile) {
      unvr.setHeight();
    }
  },


  /* sets equal column heights */
  setHeight: function() {
    var desiredHeight = 400;
    $('.height_setter').each(function() {
      var currHeight = $(this).outerHeight();

      if (currHeight > desiredHeight) {
        desiredHeight = currHeight;
      }
    }).find('.highlight_box').height(desiredHeight-60);
    $('.height_getter').height(desiredHeight);
    $('.grid_images_container').height(desiredHeight+5);
    unvr.gridFormatting(desiredHeight);
  },

  /* ensure that grid-page formatting isn't wacky */
  gridFormatting: function(desiredHeight) {
    var boundingHeight = $('.grid_images_container').height();
    var gridImageHeight = $('.grid_image_container').eq(0).height();
    var gridImageCaptionHeight = $('.grid_image_caption').eq(1).outerHeight();

    // only do this reformatting if the grid is taller than the container
    if (gridImageHeight*2 + gridImageCaptionHeight*2 > (boundingHeight-30)) {
      var newImageHeight = ((boundingHeight - (gridImageCaptionHeight*2))/2) - 22;
      $('.grid_image_container').height(newImageHeight);
    }
  },


  /* Top nav click events */
  nav: function() {
    $('.logo').on('click', function() {
      $(".owl-carousel").trigger("to.owl.carousel", [0, 500, true]);
    });
    $('#nav1').on('click', function() {
      $(".owl-carousel").trigger("to.owl.carousel", [1, 500, true]);
    });
    $('#nav2').on('click', function() {
      $(".owl-carousel").trigger("to.owl.carousel", [2, 500, true]);
    });
    $('#nav3').on('click', function() {
      $(".owl-carousel").trigger("to.owl.carousel", [3, 500, true]);
    });
    $('#nav4').on('click', function() {
      $(".owl-carousel").trigger("to.owl.carousel", [5, 500, true]);
    });
    $('#nav5').on('click', function() {
      $(".owl-carousel").trigger("to.owl.carousel", [7, 500, true]);
    });
    $('#nav6').on('click', function() {
      $(".owl-carousel").trigger("to.owl.carousel", [9, 500, true]);
    });
    $('.arrow_right').on('click', function() {
      unvr.carousel.trigger('next.owl');
    });
    $('.arrow_left').on('click', function() {
      unvr.carousel.trigger('prev.owl');
    });

    $('.mobile_nav_item').on('click', function() {
      var goto = $(this).data('goto');
      $('#' + goto).trigger('click');
      $('.hamburger').trigger('click');
    });

    $('.arrow_right_home').on('click', function() {
      $('#nav1').trigger('click');
    });

  },


  /* subtle panning of background image. animation controlled by css */
  animateBackground: function() {
    $('.horiz_background').addClass('animate_me');
  },


  scrollCounter: 0,
  scrollIntervalRunning: false,
  firstScroll: true,
  currentlySliding: false,
  firstSlide: true,

  // owl carousel 2 (beta)
  // events demo: http://www.owlcarousel.owlgraphic.com/demos/events.html
  carouselSetup: function() {

    if (this.isMobile) {
      unvr.pageSwitchSpeed = 200;
    }

    unvr.carousel = $('.owl-carousel');
    unvr.carousel.owlCarousel({
      nav: false,
      pagination: true,
      dots: false,
      items: 1,
      loop: false,
      smartSpeed: unvr.pageSwitchSpeed,
      callbacks: true,
      onTranslated: unvr.afterMovement,
      onChanged: unvr.movement
    })
    .on('mousewheel', '.owl-stage', function (event) {

      if (event.deltaY > 0) {
        unvr.scrollForward = true;
      } else {
        unvr.scrollForward = false;
      }

      // call changePage from here only on MouseWheel Event.
      // TODO: ensure that this deltaFactor works across browsers.
      if (event.deltaFactor > 1.2) {
        unvr.changePage();
      }
      if (event.deltaFactor === 1) { // if it's trackpad... debounce before sending
        debounceChangePage();
      }

      event.preventDefault();
    });


    // using underscore.js debouncer to enable trackpad scrolling
    var debounceChangePage = _.debounce(function(e) {
      unvr.changePage();
    }, 40, true); // Maximum run of once per x milliseconds. Fire immediately.


    var intervalFunction = function() {
      unvr.scrollCounter += 1;
    };
  },


  changePage: function(scrollDevice) {
    if (unvr.scrollForward) {
      if (scrollDevice === "mouseWheel") {
        if (!unvr.currentlySliding || unvr.firstSlide) {
          unvr.firstSlide = false;
          unvr.carousel.trigger('next.owl');
        }
      } else { // scrolling by trackpad is already debounced
        unvr.firstSlide = false;
        unvr.carousel.trigger('next.owl');
      }

    } else {
      if (!unvr.currentlySliding || unvr.firstSlide) {
        unvr.carousel.trigger('prev.owl');
      }
    }
  },

  afterMovement: function(event) {
    var direction = unvr.determineDirection(unvr.page);
    unvr.prevPageIndex = unvr.page;
  },

  /* adjust opacity of sections as they come in and out of view */
  sectionOpacity: function(page) {
    $('section').removeClass('current_section');
    $('section').eq(page).addClass('current_section');
  },


  currentlySlidingTrigger: function() {
    if (unvr.currentlySlidingTimeout) {
      clearTimeout(unvr.currentlySlidingTimeout);
    }
    unvr.currentlySlidingTimeout = setTimeout(function() {
      unvr.currentlySliding = false;
    }, 300);
  },

  /* add some subtle movement of elements when pages are snapped to place */
  movement: function(event) {
    unvr.currentlySliding = true;
    unvr.currentlySlidingTrigger();

    // https://github.com/smashingboxes/OwlCarousel2/issues/292#event-140932502
    var page = event.relatedTarget.relative(event.property.value);
    unvr.page = page;
    var direction = unvr.determineDirection(page);

    unvr.setNavState(page, direction);
    unvr.sectionOpacity(page);


    // don't do all this parallax stuff if we're on mobile device.
    if (unvr.isMobile) {
      return;
    }

    /* Subtle Parallax effect when changing pages */
    if (page === 0) {
      $('.section2 .parallax_bleed').addClass('bleed_me');
    }
    if (page === 1) {
      $('.section2_1 .parallax_bleed').addClass('bleed_me');
      $('.section2 .parallax_bleed').removeClass('bleed_me');
    }
    if (page === 2) {
      $('.section2_1 .parallax_bleed').removeClass('bleed_me');
      $('.section3 .highlight_box').addClass('bleed_me_small');
    }
    if (page === 3) {
      $('.section3 .highlight_box').removeClass('bleed_me_small');
    }
    if (page === 8) {
      $('.section7 .parallax_bleed').addClass('bleed_me');
    }
    if (page === 9){
      $('.section7 .parallax_bleed').removeClass('bleed_me');
    }

    if (page === 4 && direction === 'forward') {
      $('.section3 .parallax_me').removeClass('no_transition');
      $('.section3 .parallax_me').addClass('normal');
    } else if (page === 5 && direction === 'backward') {
      $('.section3 .parallax_me').removeClass('no_transition');
      $('.section3 .parallax_me').addClass('normal');
    } else {
      $('.section3  .parallax_me').addClass('no_transition').removeClass('normal push_left push_right');
    }

    if (page === 5) {
      $('.section3 .parallax_me').addClass('no_transition push_left').removeClass('push_right');
      $('.section4 .parallax_me').removeClass('no_transition');
      $('.section4 .parallax_me').addClass('normal');
    } else {
      $('.section4  .parallax_me').removeClass('normal');
    }

    if (page === 6) {
      $('.section4 .parallax_me').addClass('no_transition push_left').removeClass('push_right');
    }

  },


  /* slidy nav underline */
  /* TODO: refactor this code so it's not so complicated.... Warning: Here be Dragons! */
  setNavState: function(page, direction) {
    var activeIndex = $('.nav_items_container .active').index();
    switch(page) {
      case 0: // title animation... no nav should be active
        $('.nav_item:not(.active) .nav_anim').addClass('no_anim');
        $('.nav_item').addClass('bar_left');
        $('.nav_anim')[0].offsetHeight; // hack to force browser redraw http://stackoverflow.com/questions/11131875/what-is-the-cleanest-way-to-disable-css-transition-effects-temporarily
        $('.nav_anim').removeClass('no_anim');
        $('.active').removeClass('active').addClass('bar_left');

        $('.arrow_left').fadeOut(300);
        break;

      case 1: // Mission
        $('#nav1').addClass('soon_active');
        $('.nav_item:not(.active, .soon_active) .nav_anim').addClass('no_anim');
        $('.nav_item').not('.active, .soon_active').removeClass('bar_right bar_left');
        $('#nav2, #nav3, #nav4, #nav5, #nav6').not('.active, .soon_active').addClass('bar_left');
        $('.nav_anim')[0].offsetHeight;
        $('.nav_anim').removeClass('no_anim');
        $('.nav_items_container .active').addClass('bar_left');
        $('.nav_items_container .active').removeClass('active');
        $('#nav1').addClass('active').removeClass('soon_active bar_right bar_left');
        break;

      case 2: // Collaborators
        $('#nav2').addClass('soon_active');
        $('.nav_item:not(.active, .soon_active) .nav_anim').addClass('no_anim');
        $('.nav_item').not('.active, .soon_active').removeClass('bar_right bar_left');
        $('#nav1').not('.active, .soon_active').addClass('bar_right');
        $('#nav3, #nav4, #nav5, #nav6').not('.active, .soon_active').addClass('bar_left');
        $('.nav_anim')[0].offsetHeight;
        $('.nav_anim').removeClass('no_anim');
        if (activeIndex < 1) {
          $('.nav_items_container .active').addClass('bar_right');
        } else {
          $('.nav_items_container .active').addClass('bar_left');
        }
        $('.nav_items_container .active').removeClass('active');
        $('#nav2').addClass('active').removeClass('soon_active bar_right bar_left');
      break;

      case 3: // Films
      case 4:
        $('#nav3').addClass('soon_active');
        $('.nav_item:not(.active, .soon_active) .nav_anim').addClass('no_anim');
        $('.nav_item').not('.active, .soon_active').removeClass('bar_right bar_left');
        $('#nav1, #nav2').not('.active, .soon_active').addClass('bar_right');
        $('#nav4, #nav5, #nav6').not('.active, .soon_active').addClass('bar_left');
        $('.nav_anim')[0].offsetHeight;
        $('.nav_anim').removeClass('no_anim');
        if (activeIndex < 2) {
          $('.nav_items_container .active').addClass('bar_right');
        } else if (activeIndex > 3) {
          $('.nav_items_container .active').addClass('bar_left');
        }
        $('.nav_items_container .active').removeClass('active');
        $('#nav3').addClass('active').removeClass('soon_active bar_right bar_left');

        if (!unvr.isMobile) {
          $('.darker_background').fadeIn();
        }
      break;

      case 5: // Future
      case 6:
        $('#nav4').addClass('soon_active');
        $('.nav_item:not(.active, .soon_active) .nav_anim').addClass('no_anim');
        $('.nav_item').not('.active, .soon_active').removeClass('bar_right bar_left');
        $('#nav1, #nav2, #nav3').not('.active, .soon_active').addClass('bar_right');
        $('#nav5, #nav6').not('.active, .soon_active').addClass('bar_left');
        $('.nav_anim')[0].offsetHeight;
        $('.nav_anim').removeClass('no_anim');
        if (activeIndex < 4) {
          $('.nav_items_container .active').addClass('bar_right');
        } else if (activeIndex > 5) {
          $('.nav_items_container .active').addClass('bar_left');
        }
        $('.nav_items_container .active').removeClass('active');
        $('#nav4').addClass('active').removeClass('soon_active bar_right bar_left');
      break;

      case 7: // Impact
      case 8:
        $('#nav5').addClass('soon_active');
        $('.nav_item:not(.active, .soon_active) .nav_anim').addClass('no_anim');
        $('.nav_item').not('.active, .soon_active').removeClass('bar_right bar_left');
        $('#nav1, #nav2, #nav3, #nav4').not('.active, .soon_active').addClass('bar_right');
        $('#nav6').not('.active, .soon_active').addClass('bar_left');
        $('.nav_anim')[0].offsetHeight;
        $('.nav_anim').removeClass('no_anim');
        if (activeIndex < 4) {
          $('.nav_items_container .active').addClass('bar_right');
        } else if (activeIndex > 5) {
          $('.nav_items_container .active').addClass('bar_left');
        }
        $('.nav_items_container .active').removeClass('active');
        $('#nav5').addClass('active').removeClass('soon_active bar_right bar_left');
      break;

      case 9: // Act
        $('#nav6').addClass('soon_active');
        $('.nav_item:not(.active, .soon_active) .nav_anim').addClass('no_anim');
        $('.nav_item').not('.active, .soon_active').removeClass('bar_right bar_left');
        $('#nav1, #nav2, #nav3, #nav4, #nav5').not('.active, .soon_active').addClass('bar_right');
        $('.nav_anim')[0].offsetHeight;
        $('.nav_anim').removeClass('no_anim');
        $('.nav_items_container .active').addClass('bar_right');
        $('.nav_items_container .active').removeClass('active');
        $('#nav6').addClass('active').removeClass('soon_active bar_right bar_left');

        $('.arrow_right').fadeOut(300);
      break;


      default: return; // exit this handler for other keys
    }

    // a few random things that fell outside the switch statement
    if (page !== 0 && typeof page !== "undefined") {
      $('.arrow_left').fadeIn(300);
    }
    if (page !== 3 && page !== 4) {
      if (!unvr.isMobile) {
        $('.darker_background').fadeOut(); // fadeOut darker background if not on film pages
      }
    }
    if (page !== 9) {
      $('.arrow_right').fadeIn(300);
    }

  },


  /* annoyingly complex logic to figure out which direction user is moving through carousel */
  determineDirection: function(page) {
    var direction = 'forward';
    if (unvr.prevPageIndex === 1 && page === 0) {
      direction = 'backward';
    } else if (unvr.prevPageIndex === 0 && page === 1) {
      direction = 'forward';
    } else if (unvr.prevPageIndex > page && page === 0) {
      direction = 'forward';
    } else if (page < unvr.prevPageIndex || (unvr.prevPageIndex === 0 && page > unvr.prevPageIndex) ) {
      direction = 'backward';
    } else {
      direction = 'forward';
    }
    return direction;
  },


  horizScrollSetup: function() {
    var controller = new ScrollMagic.Controller({vertical: false});

    // blur background when film sections begin
    var scene1 = new ScrollMagic.Scene({
      triggerElement: '.section3'
    }).addTo(controller)
      .addIndicators({name: "begin blur"});
    scene1.on("enter", function (event) {
      // $('.horiz_background').addClass('blur_me');
    });
    scene1.on("leave", function (event) {
      // $('.horiz_background').removeClass('blur_me');
    });

    // unblur background when film sections end
    var scene2 = new ScrollMagic.Scene({
      triggerElement: '.section6'
    }).addTo(controller)
      .addIndicators({name: "end blur"});
    scene2.on("enter", function (event) {
      // $('.horiz_background').removeClass('blur_me');
    });
    scene2.on("leave", function (event) {
      // $('.horiz_background').addClass('blur_me');
    });
  },

};

/* when the DOM is loaded */
$(function() {
  unvr.setup();
});
