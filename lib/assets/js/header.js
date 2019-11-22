(function($) {

  var jupiterx = window.jupiterx || {}

  /**
   * Header component.
   *
   * @since 1.0.0
   */
  jupiterx.components.Header = jupiterx.components.Base.extend({
    /**
     * Set elements.
     *
     * @since 1.0.0
     */
    setElements: function () {
      this._super()

      var elements = this.elements
      elements.header = '.jupiterx-header'
      elements.$header = $(elements.header)
      elements.$navbar = elements.$header.find('.navbar-nav')
      elements.$collapseMenu = elements.$header.find('.navbar-collapse')
      elements.$dropdownToggler = elements.$navbar.find('.dropdown-toggle-icon')
      elements.$window = $(window)
      elements.$inPageMenuItems = elements.$navbar.find('a[href^="#"]')
    },

    /**
     * Set settings.
     *
     * @since 1.0.0
     */
    setSettings: function () {
      this._super()

      var settings = this.settings
      var headerSettings = this.elements.$header.data('jupiterxSettings')

      settings.breakpoint = headerSettings.breakpoint
      settings.template = headerSettings.template
      settings.stickyTemplate = headerSettings.stickyTemplate
      settings.behavior = headerSettings.behavior
      settings.position = headerSettings.position || 'top'
      settings.offset = parseInt(headerSettings.offset) + this.tbarHeight()
      settings.overlap = headerSettings.overlap
    },

    /**
     * Bind events.
     *
     * @since 1.0.0
     */
    bindEvents: function() {
      var self = this
      var elements = this.elements
      var settings = this.settings

      // Accessibility.
      self.focusToggler()
      self.blurToggler()

      // Behavior.
      self.setBehavior()
      self.mobileMenuScroll()

      // Navbar.
      elements.$dropdownToggler.on('click', function (event) {
        self.initNavbarDropdown(event)
        self.setHeight()
      })

      // Resize subscribe.
      jupiterx.pubsub.subscribe('resize', function (windowWidth) {
        // Behavior.
        self.setBehavior()
        self.setHeight()

        // Navbar
        if (windowWidth > settings.breakpoint) {
          elements.$navbar.find('.dropdown-menu').removeClass('show')
        }
      })

      // Scroll subscribe.
      jupiterx.pubsub.subscribe('scroll', function (position) {
        // Sticky behavior.
        self.setBehaviorSticky(position)
      })

      self.responsiveMenuAutoClose()
    },

    /**
     * Add support for keyboard navigation to menu.
     * @since 1.11.0
     * @link https://github.com/wpaccessibility/a11ythemepatterns
     */
    focusToggler: function() {
      // make dropdown functional on focus
      $('.jupiterx-site-navbar').find('a').on('focus', function() {
          $('.dropdown.hover, ul.dropdown-menu.hover').removeClass('hover show');
          $(this).parents('ul, li').addClass('hover show');
          $(this).next('ul.dropdown-menu').addClass('hover show');
      })
    },

    /**
     * Add support for keyboard navigation to menu.
     * @since 1.11.0
     * @link https://github.com/wpaccessibility/a11ythemepatterns
     */
    blurToggler: function() {
      // make dropdown functional on focus
      $('.jupiterx-site-navbar').find('a').on('blur', function() {
        if(!$(this).next().length && ! $(this).parents('ul').hasClass('sub-menu') ) {
          $(this).parents('ul, li').removeClass('hover show');
          $(this).next('ul.dropdown-menu').removeClass('hover show');
        }
      })
    },

    /**
     * Auto close responsive menu after tabbing on last element.
     *
     * @since 1.11.0
     */
    responsiveMenuAutoClose: function() {
      var $collapseMenu = this.elements.$collapseMenu;
      var focusable = $collapseMenu.find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      var lastFocusable = focusable[focusable.length - 1];

      $(lastFocusable).on('blur', function(){
        $collapseMenu.removeClass('show')
      })
    },

    /**
     * Set maximum height for menu to allow scroll on menu.
     *
     * @since 1.0.1
     */
    setHeight: function() {
      var navContainer = this.elements.$header.find('.navbar-collapse')
      if ( navContainer.length ) {
        var navbar = this.elements.$navbar
        navContainer.css('max-height', document.documentElement.clientHeight - navContainer.offset().top + window.pageYOffset - parseInt(navbar.css('margin-top')) );
      }
    },

    /**
     * Prevent body scroll while scrolling mobile menu. (touch scroll only)
     *
     * @since 1.0.2
     */
    mobileMenuScroll: function () {
      var overlays = document.getElementsByClassName('navbar-collapse'),
        _clientY = null
      for (var i = 0; i < overlays.length; i++) {
        overlays[i].addEventListener('touchstart', function (event) {
          if (event.targetTouches.length === 1) {
            _clientY = event.targetTouches[0].clientY
          }
        }, false)

        overlays[i].addEventListener('touchmove', function (event) {
          if (event.targetTouches.length === 1) {
            var clientY = event.targetTouches[0].clientY - _clientY
            if (overlays[i].scrollTop === 0 && clientY > 0 && event.cancelable) {
              event.preventDefault()
            }
            if (overlays[i].scrollHeight - overlays[i].scrollTop <= overlays[i].clientHeight && clientY < 0 && event.cancelable) {
              event.preventDefault()
            }
          }
        }, false)
      }
    },

    /**
     * Set behavior.
     *
     * @since 1.0.0
     */
    setBehavior: function () {
      this.setBehaviorFixed()
      this.setBehaviorSticky()
    },

    /**
     * Set fixed behavior.
     *
     * @since 1.0.0
     */
    setBehaviorFixed: function () {
      if (this.settings.behavior === 'fixed') {
        this.setSiteSpacing()
      }
    },

    /**
     * Set sticky behavior.
     *
     * @since 1.0.0
     */
    setBehaviorSticky: function (position) {
      var elements = this.elements,
        settings = this.settings

      if (settings.behavior !== 'sticky') {
        return
      }

      // Stick.
      if (position > settings.offset / 2) {
        elements.$body.addClass('jupiterx-header-stick')
        this.setSiteSpacing()
      } else {
        elements.$body.removeClass('jupiterx-header-stick')
        this.clearSiteSpacing()
      }

      // Sticked.
      if (position > settings.offset) {
        elements.$body.addClass('jupiterx-header-sticked')
      } else {
        elements.$body.removeClass('jupiterx-header-sticked')
      }
    },

    /**
     * Set site spacing.
     *
     * @since 1.0.0
     */
    setSiteSpacing: function () {
      var elements = this.elements,
        settings = this.settings

      if (this.isOverlap()) {
        this.clearSiteSpacing()
        return
      }

      var $header = elements.$header

      if (settings.behavior === 'fixed' && settings.position === 'bottom') {
        elements.$site.css('padding-' + settings.position, $header.outerHeight())
      } else {
        elements.$site.css('padding-' + settings.position, $header.outerHeight() + this.tbarHeight())
      }
    },

    /**
     * Clear site spacing.
     *
     * @since 1.0.0
     */
    clearSiteSpacing: function () {
      this.elements.$site.css('padding-' + this.settings.position, '')
    },

    /**
     * Check if header should overlap content.
     *
     * @since 1.0.0
     *
     * @return {boolean} Overlap status.
     */
    isOverlap: function () {
      var elements = this.elements,
        windowWidth = elements.$window.outerWidth(),
        overlap = this.settings.overlap

      if (!overlap) {
        return false
      }

      var desktop = (windowWidth > 768 && overlap.indexOf('desktop') > -1),
        tablet = ((windowWidth < 767.98 && windowWidth > 576) && overlap.indexOf('tablet') > -1),
        mobile = (windowWidth < 575.98 && overlap.indexOf('mobile') > -1)

      // Check current state depending on windowWidth.
      if (desktop || tablet || mobile) {
        return true
      }

      return false
    },

    /**
     * Add dropdown behavior to navbar in responsive state.
     *
     * @since 1.0.0
     */
    initNavbarDropdown: function (event) {
      event.preventDefault()
      event.stopPropagation()

      if (this.elements.$window.outerWidth() > this.settings.breakpoint) {
        return
      }

      $(event.target).closest('.menu-item').find('> .dropdown-menu').toggleClass('show')
    },

    /**
     * Handle click event on anchor tags with href as hash.
     *
     * @since 1.8.0
     */
    inPageMenuClick: function () {
      var self = this,
        anchorId
      var headerSettings = this.getHeaderSettings()

      this.elements.$navbar.on('click', (e) => {
        anchorId = e.target.getAttribute('href') || ''

        let url = null

        try {
          url = new window.URL(anchorId)
        } catch (err) {
          return
        }

        if (url.hash.search(/^#/) === -1) {
          return
        }

        anchorId = url.hash

        e.preventDefault()

        var anchorTarget = $(anchorId)

        if (anchorTarget.length === 0) {
          return
        }

        var scrollPosition = anchorTarget.offset().top
        scrollPosition -= self.getAdminbarHeight()
        scrollPosition -= self.getBodyBorderWidth()
        scrollPosition -= 2 * self.tbarHeight()

        if (
          (headerSettings.behavior === 'fixed' && headerSettings.position === 'top') ||
          headerSettings.behavior === 'sticky'
        ) {
          scrollPosition -= self.getHeaderHeight()
        }

        $('html, body').stop().animate({
          scrollTop: scrollPosition
        }, 500, 'swing', function() {
          if ($('#jupiterxSiteNavbar').hasClass('show') && self.isBelowDesktop()) {
            $('#jupiterxSiteNavbar').collapse('hide')
          }

          window.location.hash = url.hash
        })

        return false
      })
    },

    /**
     * Set menu item active based on current section visible.
     *
     * @since 1.8.0
     */
    inPageMenuScroll: function () {
      var self = this

      if (self.elements.$inPageMenuItems.length) {
        self.activateMenuItem()

        window.addEventListener('scroll', _.throttle(function () {
          self.activateMenuItem()
        }, 200))
      }
    },

    /**
     * Set menu item active.
     *
     * @since 1.8.0
     */
    activateMenuItem: function () {
      var self = this,
        anchorId,
        section,
        position = window.pageYOffset

      self.elements.$inPageMenuItems.each(function (_index, element) {
        if (element.hash < 1) {
          return true
        }

        section = document.querySelector(element.hash)

        if (!section) {
          return true
        }

        if ( // Give some space to Firefox. As it calculates values with decimals.
          (Math.abs($(section).offset().top + $(section).outerHeight() - $(document).height()) < 10) &&
          (Math.abs($(window).scrollTop() + window.innerHeight - $(document).height()) < 10)
        ) {
          anchorId = element.hash
          return false
        }

        // Give some space to Firefox. As it calculates values with decimals.
        if (position + 10 >= $(section).offset().top - self.getHeaderHeight() - self.getAdminbarHeight()) {
          anchorId = element.hash
          return true
        }
      })

      self.elements.$inPageMenuItems.removeClass('active')
      self.elements.$navbar.find('a[href="' + anchorId + '"]').addClass('active')
    },

    /**
     * Calculate header height.
     *
     * @since 1.8.0
     */
    getHeaderHeight: function () {
      var header = $('.jupiterx-header')

      if (header.length === 0) {
        return 0
      }

      var headerSettings = header.data('jupiterx-settings')
      var behavior = headerSettings.behavior

      if (behavior === 'fixed' || behavior === 'sticky' || window.pageYOffset < header.height()) {
        return header.height()
      }

      return 0
    },

    getHeaderSettings: function () {
      var $header = $('.jupiterx-header')

      return $header.data('jupiterx-settings')
    },

    getBodyBorderWidth: function () {
      var $bodyBorder = $('.jupiterx-site-body-border')

      if ($bodyBorder.length === 0) {
        return 0
      }

      var width = $bodyBorder.css('border-width')

      if (!width) {
        return 0
      }

      return parseInt(width.replace('px', ''))
    },

    /**
     * Get WP Admin bar height.
     *
     * @since 1.8.0
     */
    getAdminbarHeight: function () {
      var adminbar = $('#wpadminbar')
      if (adminbar.length) {
        return adminbar.height()
      }
      return 0
    },

    /**
     * Get Template bar height.
     *
     * @since 1.11.0
     */
    tbarHeight: function () {
      var tbar = $('.jupiterx-tbar');

      if (tbar.length) {
        return tbar.outerHeight()
      }

      return 0
    },

    /**
     * Check screen size is smaller than Desktop.
     *
     * @since 1.8.0
     */
    isBelowDesktop: function () {
      return window.jupiterx.utils.onMobile() || window.jupiterx.utils.onTablet()
    },

    /**
     * Handle cross page anchor tag target section overlap.
     *
     * @since 1.8.0
     */
    handlePageLoadScroll: function () {
      var self = this
      let headerSettings = this.getHeaderSettings()

      $(document).ready(function () {
        if (window.jupiterx.utils.onMobile() && $('body').hasClass('jupiterx-header-mobile-behavior-off')) {
          return
        }

        if (window.jupiterx.utils.onTablet() && $('body').hasClass('jupiterx-header-tablet-behavior-off')) {
          return
        }

        var anchorTarget = $(window.location.hash)
        if (anchorTarget.length === 0) {
          return
        }

        let scrollPosition = anchorTarget.offset().top
        scrollPosition -= self.getAdminbarHeight()
        scrollPosition -= self.getBodyBorderWidth()
        scrollPosition -= 2 * self.tbarHeight()

        if (
          (headerSettings.behavior === 'fixed' && headerSettings.position === 'top') ||
          headerSettings.behavior === 'sticky'
        ) {
          scrollPosition -= self.getHeaderHeight()
        }

        $('html, body').stop().animate({
          scrollTop: scrollPosition
        }, 500, 'swing')
      })
    },

    /**
     * Initialize
     *
     * @since 1.0.0
     */
    init: function () {
      this.handlePageLoadScroll()

      this.setElements()

      if (!this.elements.$header.length) {
        return;
      }

      this.setSettings()
      this.bindEvents()
      this.inPageMenuClick()
      this.inPageMenuScroll()
    }
  });

})( jQuery );
