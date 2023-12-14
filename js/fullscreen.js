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


/* When the openFullscreen() function is executed, open the video in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
function openFullscreen() 
{
    var elem = document.getElementById("holder");
    var gameCan = document.getElementById("gameCanvas"); // click to focus
    var menu = document.getElementById("menu"); // Replace with the actual ID of your menu element
    var crosshair = document.getElementById("crosshair"); // Replace with the actual ID of your menu element

    // if (elem.requestFullscreen) {
    // elem.requestFullscreen();
    // } else if (elem.mozRequestFullScreen) { /* Firefox */
    // elem.mozRequestFullScreen();
    // } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    // elem.webkitRequestFullscreen();
    // } else if (elem.msRequestFullscreen) { /* IE/Edge */
    // elem.msRequestFullscreen();
    // }

    // Update CSS properties to scale up the canvas
    gameCan.style.transform = "scale(1.42)";
    gameCan.style.transformOrigin = "top left";

    gameCan.style.maxHeight = 'none'; 
    gameCan.style.maxWidth = 'none';
    
    elem.style.height = '720px';
    elem.style.width = '1280px';

    menu.style.zIndex = "1000";
    crosshair.style.zIndex = "999";
}

function closeFullscreen()
{
    var gameCan = document.getElementById("gameCanvas"); // click to focus
    var elem = document.getElementById("holder");

    gameCan.style.transform = "none";

    gameCan.style.height = '506px';
    gameCan.style.width = '900px';

    elem.style.height = '506px';
    elem.style.width = '900px';
}