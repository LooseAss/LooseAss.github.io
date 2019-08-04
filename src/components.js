function component(width, height, color, x, y, type, xspeed=0, yspeed=0, keepIn=false, tag=0, idx=-1, extra=null, onClick=undefined,
                   wasClicked=undefined, onMouseDown=undefined, onMouseUp=undefined) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;
    this.color = color;
    this.xspeed = xspeed;
    this.yspeed = yspeed;
    this.keepIn = keepIn;
    this.inside = true;
    this.wasInside = false;
    this.tag = tag;
    this.id = lastId;
    lastId ++;
    this.idx = idx;
    this.extra = extra;
    this.isMouseDown = false;
    this.onMouseDown = onMouseDown;
    this.onMouseUp = onMouseUp;
    this.data = null;

    if(idx === -1)
        this.idx = this.id;

    this.intersects = function (item) {
        return intervalsIntersect(item.x, item.x + item.width, this.x, this.x + this.width) &&
            intervalsIntersect(item.y, item.y + item.height, this.y, this.y + this.height);
    };

    this.bounds = function () {
        let x = sizeRatio * (this.x + myGameArea.reference.frame.x), y = sizeRatio * (this.y + myGameArea.reference.frame.y),
            width = sizeRatio * this.width, height = sizeRatio * this.height;
        return [x, y, x+width, y+height];
    };

    this.update = function() {
        let x = sizeRatio * (this.x + myGameArea.reference.frame.x), y = sizeRatio * (this.y + myGameArea.reference.frame.y),
            width = sizeRatio * this.width, height = sizeRatio * this.height;
        if(this.type === "image") {
            let img = document.getElementById(this.color);
            ctx.drawImage(img, x, y, width, height);
        }
        else if(this.type === "line") {
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.save();
            ctx.rotate(-this.angle);
            ctx.moveTo(x, y);
            ctx.lineTo(x + width, y + height);
            ctx.stroke();
            ctx.restore();
        }
        else if(this.type === "rect") {
            ctx.fillStyle = this.color;
            ctx.save();
            ctx.rotate(-this.angle);
            ctx.fillRect(x, y, width, height);
            ctx.restore();
        }
        else if(this.type === "circle") {
            ctx.fillStyle = this.color;
            ctx.save();
            ctx.rotate(-this.angle);
            ctx.beginPath();
            ctx.arc(x, y, width/2, 0 , 2*Math.PI);
            ctx.fill();
            ctx.restore();
        }
        else if(this.type === "ellipse") {
            ctx.fillStyle = this.color;
            ctx.save();
            drawEllipseByCenter(ctx, x, y, width, height);
            ctx.fill();
            ctx.restore();
        }
        else if(this.type === "text") {
            ctx.font = this.extra.font;
            ctx.fillStyle = this.color;
            ctx.fillText(this.extra.text, x, y);
        }
    };

    this.keepInside = function() {
        if (this.x < 0)
            this.x = 0;
        if (this.y < 0)
            this.y = 0;
        if (this.x >= myGameArea.reference.frame.width - this.width)
            this.x = myGameArea.reference.frame.width - this.width - 1;
        if (this.y >= myGameArea.reference.frame.height - this.height)
            this.y = myGameArea.reference.frame.height - this.height - 1;
    };

    this.newPos = function() {
        this.angle += this.moveAngle * Math.PI / 180;
        this.y += this.yspeed;
        this.x += this.xspeed;
        this.x += this.speed * Math.sin(this.angle + Math.PI);
        this.y -= this.speed * Math.cos(this.angle + Math.PI);
        if(!this.inside)
            this.outsideIter ++;
        else
            this.outsideIter = 0;
        if(this.keepIn)
            this.keepInside();
        this.inside = this.x + this.width >= 0;
        if (this.y + this.height < 0)
            this.inside = false;
        if (this.x >= myGameArea.reference.frame.width)
            this.inside = false;
        if (this.y >= myGameArea.reference.frame.height)
            this.inside = false;
        if(this.inside)
            this.wasInside = true;
    };
    this.click = function () {
        if(onClick != null)
            return onClick();
        return false;
    };
    this.wasCliecked = wasClicked;
}
