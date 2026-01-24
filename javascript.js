let canvas;
let canvasContext;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;
let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 5;
let paddle1Y = 100
let paddle2Y = 100;
const PADDLE_HEIGHT = 150;
const PADDLE_THICKNESS = 15;
let showingWinScreen = false;


function calculateMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}

function handleMouseClick(evt) {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }   
}

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    const framePerSecond = 30;
    setInterval(function(){
        moveEverything();
        drawEverything();
    }, 1000/framePerSecond);
    
    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove',
        function(evt) {
            let mousePos = calculateMousePos(evt);
            paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
        });
}
function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        
        showingWinScreen = true;
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    
}
function computerMovement() {
    let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    if (paddle2YCenter < ballY-35) {
        paddle2Y += 10;
    } else if (paddle2YCenter > ballY+35){
        paddle2Y -= 10;
    }
}
function moveEverything() {
    if (showingWinScreen == true) {
        return;
    }
    computerMovement();
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if(ballX > canvas.width) {
        if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
            
        }else {
            player1Score++; //must be before ballRReset()
            ballReset();
            
        }
    }
    if (ballX < 0) {
        if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
            
        }else {
            player2Score++; //must be before ballRReset()
            ballReset();
            
        }
        
    }
    if(ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet() {
    for(let i=0; i<canvas.height; i+=40) {
        colorRect(canvas.width/2-1, i, 2, 20, 'white');
    }   
}

function drawEverything() {
    
    console.log(ballX);
    //this is the black background
    colorRect(0, 0, canvas.width, canvas.height,'black');

    if (showingWinScreen) {
        canvasContext.fillStyle = 'white';
        if (player1Score >= WINNING_SCORE) {
            
            canvasContext.fillText("Left Player Won!", 350, 200)
        } 
        else if (player2Score >= WINNING_SCORE) {
            
            canvasContext.fillText("Right Player Won!", 350, 200)
        }
        
        canvasContext.fillText("click to continue", 350, 500)
        return;
    }
    drawNet();
    //this is the left paddle
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT,'white');
    //this is the right paddle
    colorRect(canvas.width-PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT,'white');
    //this is the ball
    colorCircle(ballX, ballY, 10, 'white');
    //this is player 1 score on the left side of the screen
    canvasContext.fillText(player1Score, 100, 100);
    //this is player 2 score on the right side of the screen
    canvasContext.fillText(player2Score, canvas.width-100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}