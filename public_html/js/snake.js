/* ---------------------------------------------------------------------------- 
 * Variables
 * ---------------------------------------------------------------------------
 */

var snake_array;
var snakeLength;
var snakeSize;
var snakeDirection;

var food;

var context;
var screenWidth;
var screenHeight;

var gameState;
var gameOverMenu;
var restartButton;
var playHUD;
var scoreboard;
var music;

/* ---------------------------------------------------------------------------- 
 * Executing Game Code
 * ----------------------------------------------------------------------------
 */

gameInitialize();
snakeInitialize();
foodInitialize();
setInterval(gameLoop, 4000/90);

/* ---------------------------------------------------------------------------- 
 * Game Functions
 * ----------------------------------------------------------------------------
 */

function gameInitialize() {
    var canvas = document.getElementById("game-screen");
    context = canvas.getContext("2d");
    
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    
    document.addEventListener("keydown", keyboardHandler);
    
    gameOverMenu = document.getElementById("gameOver");
    centerMenuPosition(gameOverMenu);
    
    restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", gameRestart);
    
    playHUD = document.getElementById("playHUD");
    scoreboard = document.getElementById("scoreboard");
    
    mainMusic = document.getElementById("mainMusic");
    mainMusic.loop = true;
    
    setState("PLAY");
}

function gameLoop() {
    gameDraw();
    drawScoreboard();
    if (gameState == "PLAY") {
        snakeUpdate();
        snakeDraw();
        foodDraw();
    }
    if(games){
        
    }
}

function gameDraw() {
    context.fillStyle = "rgb(25, 51, 0)";
    context.fillRect(0, 0, screenWidth, screenHeight);
}

function gameRestart() {
    snakeInitialize();
    foodInitialize();
    mainMusic.play();
    hideMenu(gameOverMenu);
    setState("PLAY");
}

/* ---------------------------------------------------------------------------- 
 * Snake Functions
 * ----------------------------------------------------------------------------
 */

function snakeInitialize() {
    snake = [];
    snakeLength = 1;
    snakeSize = 25;
    snakeDirection = "down";
    
    for(var index = snakeLength - 1; index >= 0; index--) {
        snake.push( {
            x: 20,
            y: 0
        });
    }
}

function snakeDraw() {
    for(var index = 0; index < snake.length; index++) {
        context.fillStyle = "#994C00";
        /**This code makes the snake pieces be separated.**/
        context.strokeStyle = "rgb(25, 51, 0)";
        context.strokeRect(snake[index].x * snakeSize, snake[index].y *  snakeSize, snakeSize, snakeSize);
        context.fillRect(snake[index].x * snakeSize, snake[index].y *  snakeSize, snakeSize, snakeSize);
    }
}

function snakeUpdate() {
    var snakeHeadX = snake[0].x;
    var snakeHeadY = snake[0].y;
    
    if(snakeDirection == "down") {
        snakeHeadY++;
    }
    else if(snakeDirection == "right"){
        snakeHeadX++;
    }
    else if(snakeDirection == "left"){
        snakeHeadX--
    }
    else if(snakeDirection == "up") {
        snakeHeadY--;
    }
    
    checkFoodCollision(snakeHeadX, snakeHeadY);
    checkWallCollision(snakeHeadX, snakeHeadY);
    checkSnakeCollision(snakeHeadX, snakeHeadY);
    
    var snakeTail = snake.pop();
    snakeTail.x = snakeHeadX;
    snakeTail.y = snakeHeadY;
    snake.unshift(snakeTail);
}

/* ---------------------------------------------------------------------------- 
 * Food Functions
 * ----------------------------------------------------------------------------
 */

function foodInitialize() {
    food = {
        x: 0,
        y: 0
    };
    setFoodPosition();
}

function foodDraw() {
    context.fillStyle = "#80FF00";
    context.fillRect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);
}

function setFoodPosition() {
    var randomX = Math.floor(Math.random() * screenWidth);
    var randomY = Math.floor(Math.random() * screenHeight);
    
    food.x = Math.floor(randomX / snakeSize);
    food.y = Math.floor(randomY / snakeSize);
}

/* ---------------------------------------------------------------------------- 
 * Input Functions
 * ----------------------------------------------------------------------------
 */

function keyboardHandler(event) {
    console.log(event);
    
    if(event.keyCode == "39" && snakeDirection != "left") {
        snakeDirection = "right";
    }
    else if(event.keyCode == "40" && snakeDirection != "up") {
        snakeDirection = "down";
    }
    else if(event.keyCode == "37" && snakeDirection != "right") {
        snakeDirection = "left";
    }
    else if(event.keyCode == "38" && snakeDirection != "down") {
        snakeDirection = "up";
    }
    
    /**This code allows you to simply click 'enter' to restart the game if you
       don't want to click it.**/
    if(gameState == "GAME OVER" && event.keyCode == "13" ) {
        gameRestart();
    }
}

/* ---------------------------------------------------------------------------- 
 * Collision Handling
 * ----------------------------------------------------------------------------
 */

function checkFoodCollision(snakeHeadX, snakeHeadY) {
    if(snakeHeadX == food.x && snakeHeadY == food.y) {
        snake.push({
            x: 0,
            y: 0
        });
        snakeLength++;
        setFoodPosition();
    }
}

function checkWallCollision(snakeHeadX, snakeHeadY) {   
    if(snakeHeadX * snakeSize >= screenWidth || snakeHeadX * snakeSize < 0) {
        mainMusic.pause();
        setState("GAME OVER");
    }
    
    else if(snakeHeadY * snakeSize >= screenHeight || snakeHeadY * snakeSize < 0) {
        mainMusic.pause();
        setState("GAME OVER");
    }
}

function checkSnakeCollision(snakeHeadX, snakeHeadY) {
    for(var index = 1; index < snake.length; index++) {
        if(snakeHeadX == snake[index].x && snakeHeadY == snake[index].y) {
            mainMusic.pause();
            setState("GAME OVER");
            return;
        }
    }
}

/* ---------------------------------------------------------------------------- 
 * Game State Handeling
 * ----------------------------------------------------------------------------
 */

function setState(state) {
    gameState = state;
    showMenu(state);
}

/* ---------------------------------------------------------------------------- 
 * Menu Functions
 * ----------------------------------------------------------------------------
 */

function displayMenu(menu) {
    menu.style.visibility = "visible";
}

function hideMenu (menu) {
    menu.style.visibility = "hidden";
}

function showMenu(state) {
    if(state == "GAME OVER") {
        displayMenu(gameOverMenu);
    }
    else if(state == "PLAY") {
        displayMenu(playHUD);
    }
}

function centerMenuPosition(menu) {
    menu.style.top = (screenHeight / 2) - (menu.offsetHeight / 2) + "px";
    menu.style.left = (screenWidth / 2) - (menu.offsetWidth / 2)+ "px";
}

function drawScoreboard() {
    scoreboard.innerHTML = "Score: " + snakeLength;
}