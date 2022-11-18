
  
  
var Shopify = Shopify || {};
// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
Shopify.money_format = "Rs.{{amount}}";
Shopify.formatMoney = function(cents, format) {
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);

  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) { return 0; }

    number = (number/100.0).toFixed(precision);

    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};

$(document).ready(function() {

// ---------------------------------------------------------------------------
// Toggle mini cart
// ---------------------------------------------------------------------------

	$drawerRight = $(".cart-drawer-right");
	$cart_list = $("a.site-header__icon.site-header__cart, .cart-drawer-close-btn, .header__icon.header__icon--cart");

	$cart_list.click(function(e) {
		e.preventDefault()
		$(this).toggleClass("active");
		$("body").toggleClass("cart-drawer-pushtoleft");
		$drawerRight.toggleClass("cart-drawer-open");
		$('body').toggleClass("overflow_hidden");
		$('.CartDrawer .overlay').toggleClass('remveoverlay')
	});
});
$('.overlay').click(function() {
	$("body").toggleClass("cart-drawer-pushtoleft");
	$(".cart-drawer-right").toggleClass("cart-drawer-open");
	$('body').toggleClass("overflow_hidden");
	$(this).toggleClass('remveoverlay')
})


Handlebars.registerHelper('money', function (price) {
    return Shopify.formatMoney(price);
})

// ---------------------------------------------------------------------------
// Build cart and show cart
// ---------------------------------------------------------------------------

function buildCart() {

	$.getJSON('/cart', function(data) {
		var allProducts = [];
		var cart_products = data.items
		$('.cart-count-bubble span[aria-hidden="true"]').html(data.item_count)
		data1 = {
			data,
			grid_item_width: ''
		  };


		  console.log(data1)
  
		  //   use handlebars snippet minicart-template
		  var source = $('#minicart').html();
		  var template = Handlebars.compile(source);
		  $( "#minicart_cintent" ).replaceWith(template(data1))


		var total_price = '$' + Number(data.total_price / 100).toFixed(2);
		$('[mini-cart-subtotal]').find('.tprice').html(total_price)
	})
}

// ---------------------------------------------------------------------------
// add to cart button js
// ---------------------------------------------------------------------------

$(document).on('click', '.product-form__submit-js', function(e) {
	e.preventDefault();
	let _self = this;
	$(_self).addClass('loading');  // start loader
	$(_self).find('.loading-overlay__spinner').removeClass('hidden'); // start loader


	// add product to cart 
	$.ajax({
		type: 'POST',
		url: '/cart/add.js',
		dataType: 'json',
		data: $(this).parents('form[action="/cart/add"]').serialize(),
		success: function(data) {

			buildCart();

			$('.cart-drawer-btn').toggleClass("active");
			$("body").toggleClass("cart-drawer-pushtoleft");
			$(".cart-drawer-right").toggleClass("cart-drawer-open");
			$('body').toggleClass("overflow_hidden");
			$('.CartDrawer .overlay').toggleClass('remveoverlay')
			$.getJSON('/cart', function(data_utem) {
				if (data_utem.item_count > 0) {
					$('.drawer__inner').removeClass('remveoverlay')
					$('.Maincheckout').removeClass('remveoverlay')
					$('.emptyCart').addClass('remveoverlay')
				}
			})
			$(_self).removeClass('loading'); // stop loader
			$(_self).find('.loading-overlay__spinner').addClass('hidden'); // stop loader
			return false;
		},
		error: function(error) {
			return false;
		}
	});

});

// ---------------------------------------------------------------------------
// update , change function for quantity and remove button
// ---------------------------------------------------------------------------
function updateQuantity(updateqty, qun) {
	$.ajax({
		type: 'post',
		url: '/cart/change.js',
		data: {
			id: updateqty,
			quantity: qun
		},
		success: function(new_items) {
			buildCart()
		},
		dataType: 'json'
	});
	$(this).parents('.qtymain').find('.cart__qty-input').val(qun)
}


// ---------------------------------------------------------------------------
// increase item quantity
// ---------------------------------------------------------------------------
$("body").delegate("i.ri-add-line.add", "click", function() {
	var qun = $(this).parents('.qtymain').find('.cart__qty-input').val();
	qun = parseInt(qun) + 1;
	var updateqty = $(this).parents('.miniproduct_item').attr('variant_id');
	updateQuantity(updateqty, qun)


});

// ---------------------------------------------------------------------------
// decrease item quantity
// ---------------------------------------------------------------------------

$("body").delegate("i.ri-subtract-line.sub", "click", function() {
	var qun = $(this).parents('.qtymain').find('.cart__qty-input').val();
	if (qun > 1) {
		qun = parseInt(qun) - 1
		var updateqty = $(this).parents('.miniproduct_item').attr('variant_id');
		$(this).parents('.qtymain').find('.cart__qty-input').val(qun)
	}
	updateQuantity(updateqty, qun)


});


// ---------------------------------------------------------------------------
// remove item 
// ---------------------------------------------------------------------------

$("body").delegate("[data-cart-remove] p", "click", function(e) {
	var updateqty = $(this).parents('.miniproduct_item').attr('variant_id');
	updateQuantity(updateqty, 0);

});
  
  wishlishItems = localStorage.getItem("wishlistProducts") || [];
  if(wishlishItems.length > 0 ){wishlishItems = wishlishItems.split(',')}
  Shopify.wishlistProducts = [...wishlishItems];
  
  $(document).ready(function() {
   var productData = [] ;
   let  getProductData = url => $.getJSON(url, data => {
    console.log(data.product) ;

    data = {
      title: data.product.title,
      image: data.product.images[0].src,
      handle: data.product.handle,
      first_variant_id : data.product.variants[0].id,
      first_variant_iprice:  data.product.variants[0].price 
    }
    buildProduct(data)
  })
    .then(()=>{
      getAllproducts() ;
   });
   function getAllproducts(){
      if (Shopify.wishlistProducts.length > 0)
      {
        getProductData(Shopify.wishlistProducts.shift());
      }
   }


    getAllproducts()
    function buildProduct(data){
      data1 = {
        items: data,
        grid_item_width: ''
     };
     console.log('data1',data1)
    //   use handlebars 
    var source = $('#wishlist-cards').html();
    var template = Handlebars.compile(source);
    $( "#collection_product_container" ).append(template(data1));
    }

    $('#collection_product_container .assesment-slider-product').show()

	$("body").delegate("#collection_product_container span.wishlist_btn", "click", function(e) {
    $(this).parents('.wishlistcard_item').remove() ;
   });

   $("body").delegate(".clear_wislist", "click", function(e) {
    $( "#collection_product_container" ).empty();
    $( "#collection_product_container" ).append('<p>Wishlist is Empety</p>')
    localStorage.removeItem("wishlistProducts");
   });

   $('body').on("click",'.wishlist_add_tocart',function(){
    
    let products = [
      {
       id: $(this).data('id'),
       quantity: 1,
      }
    ];
    $.ajax({
      url: "/cart/add.js",
      method: "POST",
      dataType: 'json', 
      data: {
        items: products 
      },
      success:function(data){
        buildCart();

        $('.cart-drawer-btn').toggleClass("active");
        $("body").toggleClass("cart-drawer-pushtoleft");
        $(".cart-drawer-right").toggleClass("cart-drawer-open");
        $('body').toggleClass("overflow_hidden");
        $('.CartDrawer .overlay').toggleClass('remveoverlay')
      }
    })
  
 
  });

   
});


