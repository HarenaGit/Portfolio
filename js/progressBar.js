var animate = () => {
    var $el = $('.skills');
    $el.find('.skill-per').each((index, element) => {
        var $element = $(element)
        var per = $element.attr('per')
        $element.css("max-width", "0%")
        $element.animate({
            maxWidth: per
        },{
            duration: 1000,
            easing: 'linear'
        })
    })
}


var animateProgressBar = () => {

    var $div = $('div[data-progress]');
   
    $div.waypoint(function(direction) {
        // && $div === 'animate'
          if (direction === 'down' ) {
            animate()
          }
    }, {
          offset: '100%'
    });


};



$(document).ready(() => {
    animateProgressBar()
})