
var navActive = (section) => {

    var $el = $('aside > div > nav');
    $el.find('a').removeClass('active-link');
    $el.each(function(){
        $(this).find('a[data-nav-section="'+section+'"]').addClass('active-link');
    });

};

var navigationSection = () => {

    var $section = $('section[data-section]');
   
    $section.waypoint(function(direction) {
          if (direction === 'down') {
           
            navActive($(this.element).data('section'));
          }
    }, {
          offset: '150px'
    });

    $section.waypoint(function(direction) {
          if (direction === 'up') {

            navActive($(this.element).data('section'));
          }
    }, {
          offset: function() { return -$(this.element).height() + 155; }
    });

};

var clickMenu = () => {

    $('.nav-links a:not([class="external"])').click(function(event){
        var section = $(this).data('nav-section')
                  
        if ( $('[data-section="' + section + '"]').length ) {
            $('html, body').animate({
                scrollTop: $('[data-section="' + section + '"]').offset().top - 55
            }, 500);
        }

        event.preventDefault();
        return false;
    });


};


$(document).ready(() => {
    navigationSection()
    clickMenu()
})