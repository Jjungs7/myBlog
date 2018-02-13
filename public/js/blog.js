(function($) {
	"use strict";

	// Show the navbar when the page is scrolled up
  	var MQL = 992;

	//primary navigation slide-in effect
	if ($(window).width() > MQL) {
	    var headerHeight = $('#menu').height();
	    $(window).on('scroll', {
	        previousTop: 0
	      },
	      function() {
	        var currentTop = $(window).scrollTop();
	        //check if user is scrolling up
	        if (currentTop < this.previousTop) {
	          //if scrolling up...
	          if (currentTop > 0 && $('#menu').hasClass('is-fixed')) {
	            $('#menu').addClass('is-visible');
	          } else {
	            $('#menu').removeClass('is-visible is-fixed');
	          }
	        } else if (currentTop > this.previousTop) {
	          //if scrolling down...
	          $('#menu').removeClass('is-visible');
	          if (currentTop > headerHeight && !$('#menu').hasClass('is-fixed')) $('#menu').addClass('is-fixed');
	        }
	        this.previousTop = currentTop;
	      });
	  }
})(jQuery);