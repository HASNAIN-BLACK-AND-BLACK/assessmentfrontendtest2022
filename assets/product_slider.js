$(window).on('load',function(){
    $('.assesment-slider-product').show();
      $('.collection_product_container').slick({
        
          arrows: true,
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 2,
          prevArrow:"<button type='button' class='slick-prev pull-left'></button>",
          nextArrow:"<button type='button' class='slick-next pull-right'></button>",
          responsive: [
            {
              breakpoint: 1280,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true,
                dots: false,
                arrows: true,
              }
            },
            {
              breakpoint: 800,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                dots: true,
                arrows: false
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true,
                arrows: false
              }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
          ]
        });
  
        $('body').on("click",'.add-to-cart-js',function(){
          $('#loader').removeClass('hidden').addClass('active');
          let modal = $(this).data('href')
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
               $('#productslide_modal .products_popup-title').html('You have successfully added '+data.items[0].title+" into your cart!");
               $('#productslide_modal .products_popup-image img').attr('src',data.items[0].image);
               $('#productslide_modal .products_popup-product .p-title').html(data.items[0].title);
               $('#productslide_modal .products_popup-product .price').html('Rs '+data.items[0].price / 100+" PKR");
              setTimeout(function(){
                $.ajax({
                  url: '/cart.js',
                  method: 'GET',
                  dataType: 'json', 
                  success:function(cart){
                    $('.cart-count-bubble span').html(cart.item_count);
                    $('.totaitems').html('Total items in cart: '+cart.item_count)
                    $('.totalprice').html('Total Price: Rs '+cart.total_price / 100+ " PKR");
                    $('#loader').removeClass('active').addClass('hidden');
                    $(modal).addClass('active');
                   }
                })
              },1500);
            }
          })
        
       
        });
  
        $('body').on("click",".products_popup__close,.continue-shopping,.products_popup__overlay",function(){
            $('.products_popup__overlay').removeClass("active");
        });
  });