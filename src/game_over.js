const goDickDist = 100, goDickSpeed = 3, goDickDepth = 30;
let goDickInitialY;
function game_over() {
    pause_music();
    clearInterval(myGameArea.interval);
    state = "over";
    myGamePiece.speed = myGamePiece.xspeed = myGamePiece.yspeed = 0;
    myGamePiece.width = initialPieceSize.w;
    myGamePiece.height = initialPieceSize.h;
    myGamePiece.x = (myGameArea.reference.frame.width - myGamePiece.width) / 2;
    myGamePiece.y = (myGameArea.reference.frame.height - myGamePiece.height) / 2;
    goDickInitialY = myGamePiece.y - 97 - goDickDist;
    goDick = new component(64, 97, "dick-1", (myGameArea.reference.frame.width - 64) / 2, goDickInitialY, "image", 0, goDickSpeed, false, 2);
    if(play_sounds)
        gameOverSound();
    goInterval = setInterval(gameOverAnimation, 20);
}

function gameOverAnimation() {
    getSizeRatio();
    myGameArea.clear();
    let gow = 1280, goh = 800, gox = myGameArea.reference.frame.width/2, goy = myGamePiece.y + myGamePiece.height + 50;
    ctx.textAlign = "center";
    if(goDick.y + goDick.height >= myGamePiece.y + goDickDepth) {
        goDick.yspeed = -goDickSpeed;
    } else if(goDick.y <= goDickInitialY) {
        goDick.yspeed = goDickSpeed;
    }
    goDick.newPos();
    goDick.update();
    myGamePiece.update();

    let go = new component(gow, goh, "red", gox, goy, "text", 0, 0, false, 0, -1, {font: Math.floor(60 * sizeRatio) + "px Comic Sans MS", text: "GAME OVER"});
    go.update();
    ctx.textAlign = "center";
    let gos = new component(gow, goh, "green", gox, goy + 60, "text", 0, 0, false, 0, -1, {font: Math.floor(40 * sizeRatio) + "px Arial", text: "Score: " + score});
    gos.update();
    let high_score = get_high_score();
    ctx.textAlign = "center";
    let gohs = new component(gow, goh, "white", gox, goy + 110, "text", 0, 0, false, 0, -1, {font: Math.floor(30 * sizeRatio) + "px Arial",
        text: "Your high score: " + high_score});
    gohs.update();

    let playText = new component(myGameArea.reference.frame.width, myGameArea.reference.frame.height, "blue", gox, goy + 170, "text", 0, 0, false, 0, -1, {font: Math.floor(40 * sizeRatio) + "px Arial", text: "Click to play again"},
        function () {
            window.location.reload(false);
        },
        function (e, x, y) {
            return true;
        });
    playText.update();
    clickableComponents.push(playText);
}
