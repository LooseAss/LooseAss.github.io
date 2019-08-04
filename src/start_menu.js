function startMenu() {
    initGame();
    getSizeRatio();
    if(ctx) {
        ctx.save();
    }
    else {
        ctx = myGameArea.canvas.getContext("2d");
        ctx.save();
    }
    state = "waiting";
    ctx.textAlign = "center";
    let playText = new component(myGameArea.reference.frame.width, myGameArea.reference.frame.height, "blue", myGameArea.reference.frame.width/2, myGameArea.reference.frame.height/2, "text", 0, 0, false, 0, -1, {font: Math.floor(60 * sizeRatio) + "px Arial", text: "Click to start playing!"},
        function () {
            if(state === "waiting") {
                startGame();
            }
            return true;
        },
        function (e, x, y) {
            return true;
        });
    playText.update();
    clickableComponents.push(playText);
}
