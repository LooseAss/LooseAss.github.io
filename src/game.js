function checkLevel() {
    if(iter % 100 === 0) {
        dickRate = Math.max(dickRate - 3, minDickRate);
        cumRate = Math.max(cumRate - 3, minCumRate);
        sig = Math.max(sig - 10, minSig);
    }
    if(iter % 300 === 0) {
        dickSpeed = Math.min(dickSpeed + 1, maxDickSpeed);
        cumSpeed = Math.min(cumSpeed + 1, maxCumSpeed);
    }
    if(iter % 700 === 0) {
        maxEnemies = Math.min(maxEnemies + 1, maxMaxEnemies);
    }

}


function updateControllers() {
    let leftLine = new component(3, myGameArea.reference.frame.height, "white", 0, 0, "rect");
    let rightLine = new component(3, myGameArea.reference.frame.height, "white", myGameArea.reference.frame.width, 0, "rect");
    let rectW = (myGameArea.reference.width - myGameArea.reference.frame.width) / 2;
    let leftRect = new component(rectW, myGameArea.reference.frame.height, "red", -rectW, 0, "rect");
    let rightRect = new component(rectW, myGameArea.reference.frame.height, "red", myGameArea.reference.frame.width, 0, "rect");
    leftRect.update();
    rightRect.update();
    leftLine.update();
    rightLine.update();
    PSC1Icon.update();
    PSC2Icon.update();
}

function updateHeader() {
    myGameArea.clearHeader();
    let headerLine = new component(myGameArea.reference.width, 3, "white", -myGameArea.reference.frame.x, -3, "rect");
    let scoreText = new component(myGameArea.reference.frame.width, 3, "white", 500, -20, "text", 0, 0, false, 0, -1, {
        font: Math.floor(30 * sizeRatio) + "px Arial",
        text: "Score: " + score
    });
    let highScoreText = new component(myGameArea.reference.frame.width, 3, "red", 1365, -20, "text", 0, 0, false, 0, -1, {
        font: Math.floor(30 * sizeRatio) + "px Arial",
        text: "High score: " + get_high_score()
    });
    scoreText.update();
    highScoreText.update();
    headerLine.update();

    let heartMarginLeft = 10,
        heartMargin = 10,
        heartWidth = 32,
        heartHeight = 32;
    for (let i = 0; i < hp; i++) {
        let x = heartMarginLeft + i * (heartMargin + heartWidth);
        let heart = new component(heartWidth, heartHeight, "heart", x - myGameArea.reference.frame.x, 10 - myGameArea.reference.frame.y, "image");
        heart.update();
    }
    musicIcon.update();
    soundIcon.update();
    playPauseIcon.update();
}

function addEnemies() {
    if (enemies < maxEnemies && (next_dick == null || iter >= next_dick)) {
        next_dick = iter + getNextTime(dickRate);
        if (getRandomInt(0, 2) < 1) {
            let mu = myGamePiece.x + (myGamePiece.width - 64) / 2;
            items.push(new component(64, 97, "dick-1", getNormalRandomInt(0, myGameArea.reference.frame.width - 64, mu, sig), -97, "image", 0, dickSpeed, false, 2));
        } else {
            let mu = myGamePiece.x + (myGamePiece.width - 50) / 2;
            items.push(new component(50, 97, "dick-2", getNormalRandomInt(0, myGameArea.reference.frame.width - 50, mu, sig), -97, "image", 0, dickSpeed, false, 2));
        }
        next_cum[items[items.length - 1].id] = iter + getNextTime(cumRate);
    }
}

function addItems() {
    if(iter < next_item)
        return;
    next_item = iter + getNextTime(itemRate);
    let weightSum = 0;
    for(let key in gameItems)
        weightSum += gameItems[key];
    let rnd = getRandomInt(0, weightSum);
    let resItem;
    for(let key in gameItems) {
        if(rnd < gameItems[key]) {
            resItem = key;
            break;
        }
        rnd -= gameItems[key];
    }

    if(resItem === "bomb") {
        let mu = myGamePiece.x + (myGamePiece.width - 50) / 2;
        items.push(new component(50, 50, "bomb", getNormalRandomInt(0, myGameArea.reference.frame.width - 50, mu, sig),
            -50, "image", 0, dickSpeed, false, 3, -1, "bomb"));
    }
    else if(resItem === "big")
        items.push(new component(60, 60, "potion-1", getRandomInt(0, myGameArea.reference.frame.width - 60),
            -60, "image", 0, dickSpeed, false, 3, -1, "big"));
    else if(resItem === "small")
        items.push(new component(40, 40, "potion-2", getRandomInt(0, myGameArea.reference.frame.width - 40),
            -40, "image", 0, dickSpeed, false, 3, -1, "small"));
    else if(resItem === "heart")
        items.push(new component(50, 50, "heart-gift", getRandomInt(0, myGameArea.reference.frame.width - 50),
            -50, "image", 0, dickSpeed, false, 3, -1, "heart"));
    else if(resItem === "death") {
        let mu = myGamePiece.x + (myGamePiece.width - 50) / 2;
        items.push(new component(50, 50, "death", getNormalRandomInt(0, myGameArea.reference.frame.width - 50, mu, sig),
            -50, "image", 0, dickSpeed, false, 3, -1, "death"));
    }
    else if(resItem === "fullHP")
        items.push(new component(50, 50, "hearts", getRandomInt(0, myGameArea.reference.frame.width - 50),
            -50, "image", 0, dickSpeed, false, 3, -1, "fullHP"));
    else if(resItem === "mine")
        items.push(new component(50, 50, "dynamite", getRandomInt(0, myGameArea.reference.frame.width - 50),
            -50, "image", 0, dickSpeed, false, 3, -1, "mine"));

}


function updateGameArea() {
    if(state === "playing")
        iter ++;
    if(ctx) {
        ctx.save();
    }
    else {
        ctx = myGameArea.context;
        ctx.save();
    }
    getSizeRatio();

    checkLevel();
    myGameArea.clear();

    enemies = 0;

    myGamePiece.moveAngle = 0;
    myGamePiece.speed = 0;
    myGamePiece.xspeed = 0;
    myGamePiece.yspeed = 0;

    if ((myGameArea.keys && myGameArea.keys[37]) || (PSC1Icon != null && PSC1Icon.data === "left")) {myGamePiece.xspeed = -pieceSpeed; }
    if (myGameArea.keys && myGameArea.keys[39] || (PSC1Icon != null && PSC1Icon.data === "right")) {myGamePiece.xspeed = pieceSpeed; }
    if (myGameArea.keys && myGameArea.keys[38] || (PSC1Icon != null && PSC1Icon.data === "up")) {myGamePiece.yspeed= -pieceSpeed; }
    if (myGameArea.keys && myGameArea.keys[40] || (PSC1Icon != null && PSC1Icon.data === "down")) {myGamePiece.yspeed= pieceSpeed; }


    if (((PSC2Icon != null && PSC2Icon.data != null) || (myGameArea.keys && myGameArea.keys[32])) && (prc[0] === null || (iter - prc[0]) >= shitRate)) {
        let speed = shitSpeed;
        if(iter < endOfMine)
            speed = 0;
        let bcx = myGamePiece.x + myGamePiece.width/2,
            bcy = myGamePiece.y + 15,
            bcr = 15 * assSizeRatio,
            rch = 30 * assSizeRatio;
        let idx = lastId;
        lastId ++;
        items.push(new component(bcr, bcr, "brown", bcx, bcy, "ellipse", 0, -speed, false, -1, idx));
        items.push(new component(bcr, bcr, "brown", bcx, bcy - rch, "ellipse", 0, -speed, false, -1, idx));
        items.push(new component(bcr, rch, "brown", bcx - bcr/2, bcy - rch, "rect", 0, -speed, false, -1, idx));
        prc[0] = iter;
        if(play_sounds)
            fart();
    }

    let newItems = [];
    let shouldGoAway = {};
    if(state === "playing")
        for(let i = 0; i < items.length; i ++) {
            if (Math.abs(items[i].tag) === 2) {
                for (let j = 0; j < items.length; j++)
                    if (items[j].tag === -1 && items[i].intersects(items[j])) {
                        if (items[i].tag === 2)
                            score++;
                        shouldGoAway[items[i].idx] = true;
                        shouldGoAway[items[j].idx] = true;
                        break;
                    }
            }
            else if(items[i].tag === 3) {
                let flag = false;
                for (let j = 0; j < items.length; j++)
                    if (items[j].tag === -1 && items[i].intersects(items[j])) {
                        shouldGoAway[items[j].idx] = true;
                        flag = true;
                        break;
                    }
                if(myGamePiece.intersects(items[i]))
                    flag = true;
                if(flag) {
                    shouldGoAway[items[i].idx] = true;
                    if(items[i].extra === "bomb") {
                        hp --;
                        if(hp === 0) {
                            game_over();
                            return;
                        }
                    } else if(items[i].extra === "big") {
                        assSizeRatio *= 1.2;
                        updateGamePieceSize();
                    } else if(items[i].extra === "small") {
                        assSizeRatio *= 0.8;
                        updateGamePieceSize();
                    } else if(items[i].extra === "heart") {
                        hp = Math.min(maxHP, hp + 1);
                    } else if(items[i].extra === "death") {
                        hp = 0;
                        game_over();
                        return;
                    } else if(items[i].extra === "fullHP") {
                        hp = maxHP;
                    } else if(items[i].extra === "mine") {
                        endOfMine = iter + 2 + mineLength;
                    }

                }
            }
        }

    for(let i = 0; i < items.length; i ++){
        if(state === "playing")
            items[i].newPos();
        if(state === "playing" && shouldGoAway[items[i].idx] === true) {
            continue;
        }
        if(state === "playing" && Math.abs(items[i].tag) === 2 && myGamePiece.intersects(items[i])) {
            hp --;
            if(hp === 0) {
                game_over();
                return;
            }
            continue;
        }

        items[i].update();
        if(items[i].inside || !items[i].wasInside) {
            newItems.push(items[i]);
            if(items[i].tag === 2) {
                enemies ++;
                let id = items[i].id;
                if(next_cum[id] <= iter) {
                    items.push(new component(10, 15, "white", items[i].x + items[i].width/2, items[i].y + items[i].height, "ellipse", 0, cumSpeed, false, -2));
                    next_cum[id] = iter + getNextTime(cumRate);
                }
            }
        }
    }
    items = newItems;

    addEnemies();
    addItems();
    if(state === "playing")
        myGamePiece.newPos();
    myGamePiece.update();

    updateHeader();

    if(controllerEnabled) {
        updateControllers();
    }
}
