let myGameArea = {
    keys: {},
    references: {
        c: {
            width: 2200,
            height: 900,
            frame: {
                x: 200,
                y: 50,
                width: 1800,
                height: 850,
            },
        },
        nc: {
            width: 1800,
            height: 900,
            frame: {
                x: 0,
                y: 50,
                width: 1800,
                height: 850,
            },
        }
    },
    reference: {
    },
    canvas : document.getElementById("gameCanvas"),
    frame: {},
    start : function() {
        this.context = this.canvas.getContext("2d");
        // document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, frameRate);
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type === "keydown");
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type === "keydown");
        })
    },
    pause : function() {
        // clearInterval(this.interval);
        if(_play_music)
            pause_music();
        state = "paused";
    },
    play: function() {
        state = "playing";
        // this.interval = setInterval(updateGameArea, frameRate);
        if (_play_music)
            play_music();
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    clearHeader: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.frame.y);
    }
};
