const soundCloud = document.querySelector('.sound-cloud');
const off = document.querySelector('#off');
const on = document.querySelector('#on');
const myAudio = document.querySelector('#myAudio');

off.addEventListener('click', () => soundTrack('off'));
on.addEventListener('click', () => soundTrack('on'));

const soundTrack = (soundState) => {
    if(soundState === 'off'){
        on.style.display = 'block';
        off.style.display = 'none';
        soundCloud.style.color = "#D6974C";
        myAudio.play();
    }
    else if(soundState === 'on'){
        on.style.display = 'none';
        off.style.display = 'block';
        soundCloud.style.color = "#D6974C";
        myAudio.pause();
    }
}

// Play music functionality

const btnBars = document.querySelector('.bars');
const btnTimes = document.querySelector('.times');
const SideNav = document.querySelector('.aside');


const myFunc = (navCondition) => {
    if(navCondition === 'open'){
        SideNav.classList.add('show-nav');
        btnTimes.style.display = "block";
        btnBars.style.display = "none";
    }
    else if(navCondition === 'close'){
            SideNav.classList.remove('show-nav');
            btnTimes.style.display = "none";
            btnBars.style.display = "block";
    }
    else if(navCondition === 'menu'){
        SideNav.classList.remove('show-nav');
        btnTimes.style.display = "none";
        btnBars.style.display = "block";
    }

}

btnBars.addEventListener('click', () => myFunc('open'));
btnTimes.addEventListener('click', () => myFunc('close'));






$(document).ready(function (){

    $('.menu').click(()=>{
        myFunc('close')
    })
    if(!$("#myCanvas").tagcanvas({
        textColour: "#ffffff",
        outlineColour: "transparent",
        reverse: true,
        depth: 0.8,
        maxSpeed: 0.05,
        weight: true,
        initial: [0.1, -0.3]
        
    }, "tags")){
        // something went wrong hide the canvas container,
        $("#myCanvasContainer").hide();
    }
})