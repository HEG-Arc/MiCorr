/*jQuery time*/
$(document).ready(function(){


  $(".toggle").click(function(){
    if ($(this).hasClass("toggle-active")) {
      $(this).removeClass("toggle-active");
      $(this).addClass("toggle-inactive");
      $(this).text($(this).data('off'));
    } else {
      $(this).addClass("toggle-active");
      $(this).removeClass("toggle-inactive");
      $(this).text($(this).data('on'));

    }

  });


  //
  // jQuery SmoothScroll | Version 18-04-2013
  //
  $( ".hide-slideshow" ).click(function(event) {
    $('#slideshow-container').hide();
    $('#slideshow-replacement').show();
    event.preventDefault();
  });

  $('.smooth-scroll a[href*=#]').click(function() {

     // skip SmoothScroll on links inside accordion titles or scroll boxes also using anchors or if there is a javascript call
     //if($(this).parent().hasClass('accordion-title1')  || $(this).parent().hasClass('accordion-title2') || $(this).attr('href').indexOf('javascript')>-1) return;


     // duration in ms
     //var duration=500;

     // easing values: swing | linear
     var easing='swing';

     // get / set parameters
     var newHash=this.hash;
     var oldLocation=window.location.href.replace(window.location.hash, '');
     var newLocation=this;

     // make sure it's the same location
     if(oldLocation+newHash==newLocation)
     {
        // get target
        var target=$(this.hash+', a[name='+this.hash.slice(1)+']').offset().top;

        // adjust target for anchors near the bottom of the page
        if(target > $(document).height()-$(window).height()) target=$(document).height()-$(window).height();

        // duration (in ms) is distance-dependent., with a max of 1 sec
        var duration = Math.min(.8 * Math.abs(target-$(document).scrollTop()),1000);

        // animate to target and set the hash to the window.location after the animation
        $('html, body').animate({ scrollTop: target }, duration, easing, function() {

           // add new hash to the browser location
           window.location.href=newLocation;
        });

       // --- Unfold sections once scrolling has been properly initiated (required)
       // Make sure to unfold the node if it's collapsed
       // Note that uncollapsing is done the "rude" way by adding the "in" class
       // Using .collapse('show') would trigger the opening animation, preventing the correct
       // page scrolling effect.
       if($(this).parent().parent().hasClass('nav')) { // test the UL
         // Unfold the node
         var unfold = $(this).attr('href'); //id of the "title" node
         $(unfold).next().collapse('show'); // next node is the content to unfold
         //$(unfold).next().addClass('in'); //collapse('show'); //next node is the content to unfold
       }
       // A menu / nav element of level 2 has been clicked, unfold its parent
       if($(this).parent().parent().hasClass('subnav')) { // test the UL
         // Unfold the parent to make sure that we can jump to this section
         var unfold = $(this).parent().parent().prev().attr('href'); //id of the "title" node
         $(unfold).next().collapse('show'); // next node is the content to unfold
         //$(unfold).next().addClass('in');//.collapse('show'); //next node is the content to unfold
       }

        // cancel default click action
        return false;
     }
  });

  // $(".has-video").fitVids();
  $('.image-popup').magnificPopup({
   type:'image'
  });
    if ($.fn.jinplace)
        $('.editable').jinplace();
});


