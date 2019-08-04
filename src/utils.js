function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getNormalRandomInt(min, max, mu, sig) {
    let x = Math.floor(ROT.RNG.getNormal(mu, sig)) + min;
    if(x < min)
        return min;
    if(x > max)
        return max;
    return x;
}

function drawEllipseByCenter(ctx, cx, cy, w, h) {
    drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
}

function drawEllipse(ctx, x, y, w, h) {
    let kappa = .5522848,
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    //ctx.closePath(); // not used correctly, see comments (use to close off open path)
    ctx.stroke();
}

function intervalsIntersect(x1, x2, y1, y2) {
    return !(x2 < y1 || y2 < x1);
}


function fart(){
    let sound = new Howl({
        src: ["files/fart-" + getRandomInt(1, 4) + ".mp3"],
        format: "mp3",
        autoplay: "autoplay",
        loop: false,
        preload: true,
        volume: 0.2,
        onend: function() {
        },
        onload: function() {
            // correct_times();
            // let sec = parseInt(sound.duration());
            // $('#myRange').attr('max', ""+sec);
            // if(autoplay){
            //     state = "s";
            //     set_ctimer();
            // }
        }
    });
    sound.play();
}

function gameOverSound(){
    let sound = new Howl({
        src: ["files/Super Mario Bros - Level Complete.mp3"],
        format: "mp3",
        autoplay: "autoplay",
        loop: false,
        preload: true,
        volume: 1,
        onend: function() {
        },
        onload: function() {
            // correct_times();
            // let sec = parseInt(sound.duration());
            // $('#myRange').attr('max', ""+sec);
            // if(autoplay){
            //     state = "s";
            //     set_ctimer();
            // }
        }
    });
    sound.play();
}

function getSizeRatio() {
    let w = window.innerWidth - 20,
        h = window.innerHeight - 20;
    if(controllerEnabled)
        myGameArea.reference = myGameArea.references.c;
    else
        myGameArea.reference = myGameArea.references.nc;
    sizeRatio = Math.min(w / myGameArea.reference.width, h / myGameArea.reference.height);
    myGameArea.canvas.width = myGameArea.reference.width * sizeRatio;
    myGameArea.canvas.height = myGameArea.reference.height * sizeRatio;
    let area = $('#gameCanvas');
    $('#gameCanvas').css({
        'margin-top'  : '-' + Math.round(area.height() / 2) + 'px',
        'margin-left' : '-' + Math.round(area.width() / 2) + 'px',
    });
    myGameArea.frame.x = myGameArea.reference.frame.x * sizeRatio;
    myGameArea.frame.y = myGameArea.reference.frame.y * sizeRatio;
    myGameArea.frame.width = myGameArea.reference.frame.width * sizeRatio;
    myGameArea.frame.height = myGameArea.reference.frame.height * sizeRatio;
}



function pause_music() {
    sound_state = false;
    if(sound != null)
        sound.pause();
}

function play_music() {
    if(sound != null) {
        sound_state = true;
        sound.play();
    }
    else
        play_random_song();
}

function play_pause() {
    if(sound_state)
        pause_music();
    else
        play_music();
}


function play_random_song(){
    if(sound_state)
        pause_music();
    let src = "files/starwars"+ getRandomInt(1, 8) +".mp3";
    sound = new Howl({
        src: [src],
        format: "mp3",
        autoplay: true,
        loop: false,
        preload: true,
        volume: 1,
        onend: function() {
            play_random_song();
        },
        onload: function() {
            // correct_times();
            // let sec = parseInt(sound.duration());
            // $('#myRange').attr('max', ""+sec);
            // if(autoplay){
            //     state = "s";
            //     set_ctimer();
            // }
        }
    });
    play_music();
}

function initGame() {
    if(localStorage.play_music != null)
        _play_music = localStorage.play_music === "true";
    else
        localStorage.play_music = _play_music;
    if(localStorage.play_sounds != null)
        play_sounds = localStorage.play_sounds === "true";
    else
        localStorage.play_sounds = play_sounds;

    myGameArea.canvas.addEventListener('click', function(event) {
        let rect = myGameArea.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left,
            y = event.clientY - rect.top;
        let newClickables = [];
        for(let i = 0; i < clickableComponents.length; i ++) {
            let bounds = clickableComponents[i].bounds();
            let clicked = false;
            if(bounds[0] <= x && x <= bounds[2] && bounds[1] <= y && y <= bounds[3])
                clicked = true;
            else if(clickableComponents[i].wasCliecked !== undefined && clickableComponents[i].wasCliecked(event, x, y))
                clicked = true;
            if(clicked) {
                let res = clickableComponents[i].click(event, x, y);
                if(res !== true)
                    newClickables.push(clickableComponents[i]);
            }
            else
                newClickables.push(clickableComponents[i]);
        }
        clickableComponents = newClickables;
    }, false);

//     let mouseDown = function(event) {
//
//         let rect = myGameArea.canvas.getBoundingClientRect();
//         let x = event.clientX - rect.left,
//             y = event.clientY - rect.top;
//         if(event.touches != null && event.touches.length > 0 && event.touches[0].clientX != null) {
//             x = event.touches[0].clientX - rect.left;
//             y = event.touches[0].clientY - rect.top;
//         }
//
//         let newClickables = [];
//         for(let i = 0; i < clickableComponents.length; i ++) {
//             let bounds = clickableComponents[i].bounds();
//             let clicked = false;
//             if(bounds[0] <= x && x <= bounds[2] && bounds[1] <= y && y <= bounds[3])
//                 clicked = true;
//             else if(clickableComponents[i].wasCliecked !== undefined && clickableComponents[i].wasCliecked(event, x, y))
//                 clicked = true;
//             if(clicked && clickableComponents[i].onMouseDown != null) {
//                 let res = clickableComponents[i].onMouseDown(event, x, y);
//                 if(res !== true)
//                     newClickables.push(clickableComponents[i]);
//             }
//             else
//                 newClickables.push(clickableComponents[i]);
//         }
//         clickableComponents = newClickables;
//     };
//
//     let mouseUp = function(event) {
//         let rect = myGameArea.canvas.getBoundingClientRect();
//         let x = event.clientX - rect.left,
//             y = event.clientY - rect.top;
//         if(event.touches != null && event.touches.length > 0 && event.touches[0].clientX != null) {
//             x = event.touches[0].clientX - rect.left;
//             y = event.touches[0].clientY - rect.top;
//         }
//         let newClickables = [];
//         for(let i = 0; i < clickableComponents.length; i ++) {
//             if(clickableComponents[i].isMouseDown && clickableComponents[i].onMouseUp != null) {
//                 let res = clickableComponents[i].onMouseUp(event, x, y);
//                 if(res !== true)
//                     newClickables.push(clickableComponents[i]);
//             }
//             else
//                 newClickables.push(clickableComponents[i]);
//         }
//         clickableComponents = newClickables;
//     };
//     if(controllerEnabled) {
//         myGameArea.canvas.addEventListener('mouseup', mouseUp, false);
//         myGameArea.canvas.addEventListener('mousedown', mouseDown, false);
//         myGameArea.canvas.addEventListener('touchstart', mouseUp, false);
//         myGameArea.canvas.addEventListener('touchend', mouseDown, false);
//         myGameArea.canvas.addEventListener('pointerup', mouseUp, false);
//         myGameArea.canvas.addEventListener('pointerdown', mouseDown, false);
//     }
}

function getRectDPosition(x, y, x1, y1, x2, y2) {
    let X = x - x1, Y = y - y1,
        W = x2 - x1, H = y2 - y1,
        XP = W - X, YP = H - Y;
    let aboveD1 = Y <= X;
    let aboveD2 = Y <= XP;
    if(aboveD1 && aboveD2)
        return "up";
    else if(aboveD1)
        return "right";
    else if(aboveD2)
        return "left";
    else
        return "down";
}

function getNextTime(rate) {
    return  getRandomInt(Math.ceil(rate * 0.8), Math.floor(rate * 1.2));
}

function updateGamePieceSize() {
    assSizeRatio = Math.max(minAssSizeRatio, assSizeRatio);
    assSizeRatio = Math.min(assSizeRatio, maxAssSizeRatio);
    let w1 = myGamePiece.width, h1 = myGamePiece.height;
    let x1 = myGamePiece.x, y1 = myGamePiece.y;
    let w2 = initialPieceSize.w * assSizeRatio,
        h2 = initialPieceSize.h * assSizeRatio;
    let x2 = x1 + (w1 - w2) / 2,
        y2 = y1 + (h1 - h2) / 2;
    myGamePiece.width = w2;
    myGamePiece.height = h2;
    myGamePiece.x = x2;
    myGamePiece.y = y2;
    myGamePiece.keepInside();
}

function get_high_score() {
    let high_score = score;
    if (localStorage.high_score != null)
        high_score = Math.max(score, parseInt(localStorage.high_score));
    localStorage.high_score = high_score;
    return high_score;
}
