const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

export class Entity {
    constructor(img, scale, resize) {
        this.speed = 0
        this.scale = scale
        this.resize = resize
        this.img = img
        this.size = {
            w: img.naturalWidth * this.scale * this.resize,
            h: img.naturalHeight * this.scale * this.resize
        }
        this.pos = {x:0, y:0}
    }
    draw = () => ctx.drawImage(this.img, this.pos.x, this.pos.y, this.size.w, this.size.h)
    setPos(x, y) {
        this.pos = {
            x: x * this.scale,
            y: y * this.scale
        }
    }
}

export class Player {
    constructor(img, scale, resize) {
        this.speed = 0
        this.scale = scale
        this.resize = resize
        this.upperlimit = canvas.height * 3/4
        this.img = img
        this.size = {
            w: img.naturalWidth * this.scale * this.resize,
            h: img.naturalHeight * this.scale * this.resize
        }
        this.pos = {
            x: (canvas.width - this.size.w) / 2, 
            y: (canvas.height - this.upperlimit - this.size.h)/2 + this.upperlimit
        }
        this.direction = {
            Up: false,
            Down: false,
            Right: false,
            Left: false
        }
        this.shooting = false
    }
    draw = () => ctx.drawImage(this.img, this.pos.x, this.pos.y, this.size.w, this.size.h)
    setPos(id){
        if(id == 0){
            this.pos = {
                x: (canvas.width - this.size.w) / 2, 
                y: (canvas.height - this.upperlimit - this.size.h)/2 + this.upperlimit
            }
        }
        else if(id == 1){
            this.pos = {
                x: (canvas.width - this.size.w) * 2/3, 
                y: (canvas.height - this.upperlimit - this.size.h) / 2 + this.upperlimit
            }
        }
        else if(id == 2){
            this.pos = {
                x: (canvas.width - this.size.w) * 1/3, 
                y: (canvas.height - this.upperlimit - this.size.h) / 2 + this.upperlimit
            }
        }
    }
}