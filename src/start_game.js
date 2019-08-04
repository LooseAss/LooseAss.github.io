function startGame() {
    state = "playing";
    items = [];
    hp = initialHP;
    score = 0;
    myGamePiece = new component(initialPieceSize.w, initialPieceSize.h, "butt",
        (myGameArea.reference.frame.width - initialPieceSize.w)/2, (myGameArea.reference.frame.height - initialPieceSize.h)/2,
        "image", 0, 0, true, 1);
    myGameArea.start();
    if(_play_music)
        play_random_song();
    musicIcon = new component(30, 30, _play_music? "music": "no-music", 800, -42, "image", 0, 0, false, 0, -1, null,
        function (e, x, y) {
            if(musicIcon.color === "music") {
                musicIcon.color = "no-music";
                pause_music();
                _play_music = false;
                localStorage.play_music = false;
            }
            else {
                musicIcon.color = "music";
                play_music();
                _play_music = true;
                localStorage.play_music = true;
            }
            // if(state === "paused")
            //     updateGameArea();
            return false;
        });
    clickableComponents.push(musicIcon);
    soundIcon = new component(30, 30, play_sounds? "sound": "no-sound", 850, -42, "image", 0, 0, false, 0, -1, null,
        function (e, x, y) {
            if(soundIcon.color === "sound") {
                soundIcon.color = "no-sound";
                play_sounds = false;
                localStorage.play_sounds = false;
            }
            else {
                soundIcon.color = "sound";
                play_sounds = true;
                localStorage.play_sounds = true;
            }
            // if(state === "paused")
            //     updateGameArea();
            return false;
        });
    clickableComponents.push(soundIcon);
    playPauseIcon = new component(30, 30, "pause", 900, -42, "image", 0, 0, false, 0, -1, null,
        function (e, x, y) {
            if(state === "paused") {
                playPauseIcon.color = "pause";
                myGameArea.play();
            }
            else {
                playPauseIcon.color = "play";
                myGameArea.pause();
                // updateGameArea();
            }
            return false;
        });
    clickableComponents.push(playPauseIcon);

    if(controllerEnabled) {
        PSC1Icon = new component(100, 100, "psc1", -150, (myGameArea.reference.frame.height - 100) / 2, "image", 0, 0, false, 0, -1, null,
            undefined, undefined,
            function (e, x, y) {
                let bounds = PSC1Icon.bounds();
                PSC1Icon.data = getRectDPosition(x, y, bounds[0], bounds[1], bounds[2], bounds[3]);
                PSC1Icon.isMouseDown = true;
            },
            function (e, x, y) {
                PSC1Icon.data = null;
                PSC1Icon.isMouseDown = false;
            });
        clickableComponents.push(PSC1Icon);
        PSC2Icon = new component(100, 100, "psc2", myGameArea.reference.frame.width + 50, (myGameArea.reference.frame.height - 100) / 2, "image", 0, 0, false, 0, -1, null,
            undefined, undefined,
            function (e, x, y) {
                let bounds = PSC1Icon.bounds();
                PSC2Icon.data = getRectDPosition(x, y, bounds[0], bounds[1], bounds[2], bounds[3]);
                PSC2Icon.isMouseDown = true;
            },
            function (e, x, y) {
                PSC2Icon.data = null;
                PSC2Icon.isMouseDown = false;
            });
        clickableComponents.push(PSC2Icon);
    }
}
