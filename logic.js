const canvas = document.querySelector("canvas")

export function hasIntersection(r1, r2) {
    if (r1.x + r1.w >= r2.x && 
        r1.x <= r2.x + r2.w &&
        r1.y + r1.h >= r2.y &&
        r1.y <= r2.y + r2.h)
        return true
    return false
}

export function move(player) {
    if((player.direction.Down && (player.direction.Right || player.direction.Left)) || (player.direction.Up && (player.direction.Right || player.direction.Left))) {
        let diagspeed = Math.sqrt(Math.pow(player.speed * player.scale, 2)/2)
        if(player.direction.Down && player.pos.y + diagspeed <= canvas.height - player.size.h) player.pos.y += diagspeed
        else if(player.direction.Down) player.pos.y += canvas.height - (player.pos.y + player.size.h)
        if(player.direction.Up && player.pos.y - diagspeed >= player.upperlimit) player.pos.y -= diagspeed
        else if(player.direction.Up) player.pos.y = player.upperlimit
        if(player.direction.Right && player.pos.x + diagspeed <= canvas.width - player.size.w) player.pos.x += diagspeed
        else if(player.direction.Right) player.pos.x += canvas.width - player.pos.x - player.size.w
        if(player.direction.Left && player.pos.x - diagspeed >= 0) player.pos.x -= diagspeed
        else if(player.direction.Left) player.pos.x = 0
    }
    else {
        if(player.direction.Down && player.pos.y + player.speed * player.scale <= canvas.height - player.size.h) player.pos.y += player.speed * player.scale
        else if(player.direction.Down) player.pos.y += canvas.height - player.pos.y - player.size.h
        if(player.direction.Up && player.pos.y - player.speed * player.scale >= player.upperlimit) player.pos.y -= player.speed * player.scale
        else if(player.direction.Up) player.pos.y = player.upperlimit
        if(player.direction.Right && player.pos.x + player.speed * player.scale <= canvas.width - player.size.w) player.pos.x += player.speed * player.scale
        else if(player.direction.Right) player.pos.x += canvas.width - player.pos.x - player.size.w
        if(player.direction.Left && player.pos.x - player.speed * player.scale >= 0) player.pos.x -= player.speed * player.scale
        else if(player.direction.Left) player.pos.x = 0
    }
}

export function moveBullet(bullet, speed, direction) {
    if(direction == "Up"){
        if(bullet.y >= 0)
            bullet.y -= speed
    }
    else if(direction == "Down"){
        if(bullet.y <= canvas.height)
            bullet.y += speed
    }
}

export function spawnNewIfAllDead(enemy) {
    let empty = true
    enemy.grid.forEach((row) => {
        row.forEach((element) => {
            if(element.disp) {
                empty = false
            }
        });
    });
    if(empty) {
        for (let i = 0; i < enemy.grid.length; i++) {
            for(let j = 0; j < enemy.grid[i].length; j++) {
                enemy.grid[i][j] = {x: i * (enemy.ent.size.w / enemy.ent.scale + 15) + ((canvas.width / enemy.ent.scale - enemy.grid.length * (enemy.ent.size.w / enemy.ent.scale + 15) + 15) / 2), y: j * (enemy.ent.size.h / enemy.ent.scale + 15) + 100, disp: true}
            }
        }
        return true
    }
    return false
}

export function moveEnemies(enemy, level) {
    enemy.movecooldown = Math.floor(100 - (level.lvl * 0.2))
    enemy.reloadtimee = Math.floor(300 - (level.lvl * 0.2))
    if(enemy.movecooldown < 5)
        enemy.movecooldown = 5
    if(enemy.reloadtimee < 5)
        enemy.reloadtimee = 5
    let offsetR = 0
    let offsetL = 0
    let offsetBot = 0
    for(let i = 0; i < enemy.grid.length; i++) {
        if(enemy.grid[i].every(value => value.disp == false))
            offsetL++
        else
            break
    }
    for(let i = enemy.grid.length - 1; i >= 0; i--) {
        if(enemy.grid[i].every(value => value.disp == false))
            offsetR++
        else
            break
    }
    let temp = []
    for(let element of enemy.grid) {
        let x = 0
        for(let i = enemy.grid[0].length - 1; i >= 0; i--) {
            if(!element[i].disp)
                x++
            else{
                temp.push(x)
                break
            }
        }
    }
    offsetBot = Math.min(...temp)
    for(let i = offsetL; i < enemy.grid.length - offsetR; i++) {
        for(let j = 0; j < enemy.grid[i].length - offsetBot; j++) {
            if(level.next) {
                enemy.grid[i][j].y += enemy.ent.size.h * 2/3
            }
            else {
                if(enemy.grid[i][j].x < (canvas.width - enemy.ent.size.w) / enemy.ent.scale - enemy.ent.speed && level.lvl % 2 != 0) {
                    enemy.grid[i][j].x += enemy.ent.speed
                }
                else if(enemy.grid[i][j].x > enemy.ent.speed && level.lvl % 2 == 0) {
                    enemy.grid[i][j].x -= enemy.ent.speed
                }
            }
        }
    }
    if(level.next) {
        level.next = false
        level.lvl++
    }
    else if(!(enemy.grid[enemy.grid.length - 1 - offsetR][0].x < (canvas.width - enemy.ent.size.w) / enemy.ent.scale - enemy.ent.speed) || !(enemy.grid[offsetL][0].x > enemy.ent.speed))
        level.next = true
    enemy.offset.offsetR = offsetR
    enemy.offset.offsetL = offsetL
    enemy.offset.offsetBot = offsetBot
}

export function keyboard(player1, player2, multiplayer) {
    window.addEventListener("keydown",(event) => {
        event.preventDefault()

        switch (event.code) {
            case "ArrowUp":
                player1.direction.Up = true
            break
            case "ArrowDown":
                player1.direction.Down = true
            break
            case "ArrowRight":
                player1.direction.Right = true
            break
            case "ArrowLeft":
                player1.direction.Left = true
            break
            case "Space":
                player1.shooting = true
            break
        }
        if(multiplayer)
            switch (event.code) {
                case "KeyW":
                    player2.direction.Up = true
                break
                case "KeyS":
                    player2.direction.Down = true
                break
                case "KeyD":
                    player2.direction.Right = true
                break
                case "KeyA":
                    player2.direction.Left = true
                break
                case "KeyV":
                    player2.shooting = true
                break
            }
    })
    window.addEventListener("keyup",(event) => {
        event.preventDefault()

        switch (event.code) {
            case "ArrowUp":
                player1.direction.Up = false
            break
            case "ArrowDown":
                player1.direction.Down = false
            break
            case "ArrowRight":
                player1.direction.Right = false
            break
            case "ArrowLeft":
                player1.direction.Left = false
            break
            case "Space":
                player1.shooting = false
            break
        }
        if(multiplayer)
            switch (event.code) {
                case "KeyW":
                    player2.direction.Up = false
                break
                case "KeyS":
                    player2.direction.Down = false
                break
                case "KeyD":
                    player2.direction.Right = false
                break
                case "KeyA":
                    player2.direction.Left = false
                break
                case "KeyV":
                    player2.shooting = false
                break
            }
    })
}