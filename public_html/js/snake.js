var snake;

var context;
var screenWidth;
var screenHeight;

function gameInitialize() {
    var canvas = document.getElementById("game-screen");
    context = canvas.getContext("2d");
    
    screenWidth = window.inner.Width;
    screenHeight = window.inner.Height;
    
    canvas.width = screenWidth;
    canvas.height = screenHeight;
}

function gameLoop() {
    
}

function gameDraw() {
    context.fillStyle = "rbg(77, 77, 77)";
}