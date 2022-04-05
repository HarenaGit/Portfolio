
var $modal = $('#myModal')
var $modalImage = $('#slideshow-container')
var $dotMenu = $('#dot-menu')
var $modalDetail = $('#detail-content')

var showModal = () => {

    $('#home-magicwall  ul  li  div').click((event) => {
        var $element = $(event.target)
        var val = $element.data('img')
        var title = $element.data('title');
        var subTitle = $element.data('sub-title')
        var bgd = $element.data('badge')
        var AllBadged = bgd.split(',')
        var allSrc = val.split(';')
        var content = $element.data('content')
        $modalImage.html('')
        $dotMenu.html('')
        $modalDetail.html('')
        resetSlide()
        for(var i = 0; i < allSrc.length; i++)
        {
            $modalImage.append(`
            <div class="mySlides fade">
            <div class="numbertext">${i+1} / ${allSrc.length}</div>
            <img src="${allSrc[i]}" style="width:100%">
            <div class="text">${i+1} / ${allSrc.length}</div>
            </div>
            `)

            $dotMenu.append(`
                <span class="dot" onclick="currentSlide(${i+1})"></span>
            `)
            
        }
        $modalImage.append(`
        <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
        <a class="next" onclick="plusSlides(1)">&#10095;</a>`)
        var $badged = ''
        for(var i = 0; i<AllBadged.length; i++)
        {
            var currentBgd = AllBadged[i]
            var bgdValue = currentBgd.split('/')
            var bgdText = bgdValue[0] || ''
            var bgdColor = bgdValue[1] || ''
            var w = window.screen.width;
            
                $badged = $badged + `<p class="badged-modal" style="border: 1px solid ${bgdColor}" >${bgdText}</p>`
            
            
            
        }
        $modalDetail.append(`
        <div style="display:block;padding: 50px">
            <div class="text-zone-modal"  >
                <h2>${title}</h2>
            </div>

            <p>${content}
            </p>
            <div class="text-sub-modal">
                <h3>${subTitle}</h3>
            </div>
            <div >
                ${$badged}
            </div>

        </div>`)

        $modal.css('display', 'block')
        $modal.css('z-index', 999)
        showSlides(1)

    })
}

var closeModal = () => {
    var $close = $('.close');
    $close.click(() => {
        $modal.css('display', 'none')
    })
}


$(document).ready(() => {
    showModal()
    closeModal()
})