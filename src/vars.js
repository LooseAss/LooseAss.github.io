const initialHP = 10, maxHP = 10;
let ctx;
let lastId = 1;
let items;
let myGamePiece;
let hp;
let score;
let pieceSpeed = 17, shitSpeed = 12, dickSpeed = 2, cumSpeed = 5,
    maxDickSpeed = 14, maxCumSpeed = 13;
let iter = 0;
let prc = [null, null];
let next_cum = {};
let next_dick;
let frameRate = 20, shitRate = 10, cumRate = 75, dickRate = 75, minCumRate = 30, minDickRate = 30, sig = 350, minSig = 70;
let maxEnemies = 5, maxMaxEnemies = 10;
let itemRate = 750, next_item = 2;
let state;
let goInterval, goDick;
let sizeRatio, assSizeRatio = 1, minAssSizeRatio = .4, maxAssSizeRatio = 3;
let sound_state = false, sound  = null, play_sounds = true, _play_music = true;
let clickableComponents = [];
let musicIcon, soundIcon, playPauseIcon, PSC1Icon, PSC2Icon;
let controllerEnabled = false;
let enemies;
let initialPieceSize = {w: 150, h: 97};
let mineLength = 700, endOfMine = -1;
let gameItems = {
    "bomb": 5,
    "big": 4,
    "small": 4,
    "heart": 5,
    "death": 1,
    "fullHP": 1,
    "mine": 4,
};
