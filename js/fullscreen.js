const fullscreen = false

$("#fsButton").click(function(){
    openFullscreen();
    fullscreen = true;
    console.log("fs!");
});

document.getElementById('holder').addEventListener('fullscreenchange', (event) => 
{
    if (document.fullscreenElement) {
        openFullscreen();
    }
    else
    {
        closeFullscreen();
    }
});

/* When the openFullscreen() function is executed, open the video in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
function openFullscreen() 
{
    var elem = document.getElementById("holder");
    var gameCan = document.getElementById("gameCanvas"); // click to focus

    if (elem.requestFullscreen) {
    elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
    }
    gameCan.style.maxHeight = 'none';
    gameCan.style.maxWidth = 'none';
    
    gameCan.style.height = '100%';
    gameCan.style.width = '100%';
    // 900, 506 | 1067, 600 | 1280, 720
}

function closeFullscreen()
{
    var gameCan = document.getElementById("gameCanvas"); // click to focus
    //max-width: 900px; max-height: 506px;

    gameCan.style.maxHeight = '506px';
    gameCan.style.maxWidth = '900px';
    
    gameCan.style.height = '100%';
    gameCan.style.width = '100%';
}