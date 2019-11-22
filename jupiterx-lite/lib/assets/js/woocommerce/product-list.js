jQuery(document).ready(function ($) {
  function ProductQuickView () {
    var self = this
    this.$productContainer = $('.jupiterx-product-container')
    this.modals = {}

    if (typeof ProductQuickView._initialized == 'undefined') {
      ProductQuickView.prototype.init = function () {
        if (!this.hasQuickView()) {
          return
        }

        this.bindEvents()
      }

      ProductQuickView.prototype.bindEvents = function () {
        if (this.hasQuickViewBtn()) {
          $(document)
            .add(this.$productContainer)
            .on('click', '.jupiterx-product-quick-view-btn', function(e) {
              e.preventDefault()
              e.stopPropagation()

              var productId = $(this).closest('.jupiterx-product-container')
                .data('product-id')

              self.showQuickView(productId)
          })

          return
        }

        $(document)
          .add(this.$productContainer)
          .on( 'click', '.woocommerce-loop-product__link', function (e) {
            e.preventDefault()
            e.stopPropagation()
        })

        $(document)
          .add(this.$productContainer)
          .on('click', '.woocommerce-loop-product__title', function () {
            var productId = $(this).closest('.jupiterx-product-container')
              .data('product-id')

            self.showQuickView(productId)
        })

        $(document)
          .add(this.$productContainer)
          .on('click', '.jupiterx-wc-loop-product-image', function () {
            var productId = $(this).closest('.jupiterx-product-container')
              .data('product-id')

            self.showQuickView(productId)
        })
      }

      ProductQuickView.prototype.showQuickView = function (productId) {
        if (!self.modals[productId]) {
          self.modals[productId] = $.featherlight($('#jupiterx-product-quick-view-modal-' + productId), {
            persist: true,
            variant: 'jupiterx-product-quick-view-featherlight'
          })
        } else {
          self.modals[productId].open()
        }
      }

      ProductQuickView.prototype.hasQuickViewBtn = function () {
        return this.$productContainer.find('.jupiterx-product-quick-view-btn').length > 0
      }

      ProductQuickView.prototype.hasQuickView = function () {
        return this.$productContainer.hasClass('jupiterx-product-has-quick-view')
      }
    }
  }

  var productQuickView = new ProductQuickView()
  productQuickView.init()
})
