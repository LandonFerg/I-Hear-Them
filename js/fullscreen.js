let gf = false;

$("#fsButton").click(function()
{
    if (!gf) 
    {
        openFullscreen();
        console.log("fs!" + gf);
        gf = true;
    }

    else
    {
        closeFullscreen();
        console.log("nf" + gf);
        gf = false;
    }
}); 

// document.getElementById('holder').addEventListener('fullscreenchange', (event) => 
// {

// });

/* When the openFullscreen() function is executed, open the video in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
function openFullscreen() 
{
    var elem = document.getElementById("holder");
    var gameCan = document.getElementById("gameCanvas"); // click to focus

    // if (elem.requestFullscreen) {
    // elem.requestFullscreen();
    // } else if (elem.mozRequestFullScreen) { /* Firefox */
    // elem.mozRequestFullScreen();
    // } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    // elem.webkitRequestFullscreen();
    // } else if (elem.msRequestFullscreen) { /* IE/Edge */
    // elem.msRequestFullscreen();
    // }
    gameCan.style.maxHeight = 'none';
    gameCan.style.maxWidth = 'none';
    
    gameCan.style.height = '720px';
    gameCan.style.width = '1280px';
    
    elem.style.height = '720px';
    elem.style.width = '1280px';
    
    //console.log("f function");
    // 900, 506 | 1067, 600 | 1280, 720
}

function closeFullscreen()
{
    var gameCan = document.getElementById("gameCanvas"); // click to focus
    var elem = document.getElementById("holder");
    //max-width: 900px; max-height: 506px;

    // gameCan.style.maxHeight = '506px';
    // gameCan.style.maxWidth = '900px';

    gameCan.style.height = '506px';
    gameCan.style.width = '900px';

    elem.style.height = '506px';
    elem.style.width = '900px';
    
    //console.log("nf function")
    // gameCan.style.height = '100%';
    // gameCan.style.width = '100%';
}