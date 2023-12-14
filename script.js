/*
    ! Popravi
    ^ Extra
    ? Add
*/

import {Player, Entity} from "./entity.js"
import {hasIntersection, keyboard, move, moveBullet, moveEnemies, spawnNewIfAllDead} from "./logic.js"

window.addEventListener("load", function() {
    let audio = document.getElementById("audio")
    document.getElementById("audb").onclick = () => audio.play()

    function clear() {
        ctx.clearRect(0 ,0 , canvas.width, canvas.height)
    }
    function displayHp() {
        for(let i = 0; i < healthbar.hp; i++) {
            healthbar.heart.setPos((i * (healthbar.heart.size.w + 5) + (canvas.width - (healthbar.heart.size.w + 5) * healthbar.maxhp)) / scale - 2, 5)
            healthbar.heart.draw()
        }
        for(let i = healthbar.hp; i < healthbar.maxhp; i++) {
            healthbar.noheart.setPos((i * (healthbar.noheart.size.w + 5) + (canvas.width - (healthbar.noheart.size.w + 5) * healthbar.maxhp)) / scale - 2, 5)
            healthbar.noheart.draw()
        }
    }
    function displayScore() {
        ctx.fillStyle = "white"
        ctx.textAlign = 'start'
        ctx.font = (50 * scale) + "px Arcade"
        let approxFontHeight = parseInt(ctx.font)
        ctx.fillText("Highscore: " + highscore, 9 * scale, 9 * scale + approxFontHeight / 2)
        ctx.fillText("Score: " + score, 9 * scale, 15 * scale + approxFontHeight)
    }
    function displayShield() {
        for(let i = 0; i < shield.shields; i++) {
            shield.ent.setPos(i * (shield.ent.size.w / scale + 100) + (canvas.width / scale - shield.shields * (shield.ent.size.w / scale + 100)) / 2 + 50, canvas.height * 3/4 / scale - shield.ent.size.h / scale - 5)
            if(shield.hp[i] > 0)
                shield.ent.draw()
        }
    }
    function displayShooting() {
        for (let element of bullet1.pos) {
            bullet1.ent.setPos(element.x, element.y)
            bullet1.ent.draw()
        }
        if(states.multiplayer)
            for (let element of bullet2.pos) {
                bullet2.ent.setPos(element.x, element.y)
                bullet2.ent.draw()
            }
        for(let element of bullete.pos) {
            bullete.ent.setPos(element.x, element.y)
            bullete.ent.draw()
        }
    }
    function displayBoom() {
        for(let element of boom.pos){
            boom.ent.setPos(element.x, element.y)
            boom.ent.draw()
        }
    }
    function displayPlayers() {
        player1.draw()
        if(states.multiplayer)
            player2.draw()
    }
    function displayEnemies() { 
        for(let element of enemy.grid) {
            for(let el of element) {
                if(el.disp) {
                    enemy.ent.setPos(el.x, el.y)
                    enemy.ent.draw()
                }
            }
        }
    }
    function displayMenu() {
        clear()
        menubg.draw()
        if(states.option) {
            ctx.font = 60 * scale + "px Arcade"
            ctx.fillStyle = "white"
            ctx.textAlign = "center"
            let approxFontHeight = parseInt(ctx.font)
            ctx.fillText("Choose  an  option", canvas.width / 2, canvas.height * 1/3 + approxFontHeight/4)
            button.ent1.draw()
            button.ent2.draw()
            if(states.muted)
                button.mute.draw()
            else
                button.unmute.draw()
            ctx.fillStyle = "rgb(255, 255, 255, 0.2)"
            if(hover == 1)
                ctx.fillRect(button.ent1.pos.x, button.ent1.pos.y, button.ent1.size.w, button.ent1.size.h)
            else if(hover == 2)
                ctx.fillRect(button.ent2.pos.x, button.ent2.pos.y, button.ent2.size.w, button.ent2.size.h)
            else if(hover == 6)
                ctx.fillRect(button.mute.pos.x, button.mute.pos.y, button.mute.size.w, button.mute.size.h)
        }
        else {
            ctx.font = 120 * scale + "px Arcade"
            ctx.fillStyle = "#9F2B68"
            ctx.textAlign = "center"
            let approxFontHeight = parseInt(ctx.font)
            ctx.fillText("VOID  RAVEN", canvas.width / 2, canvas.height * 1/3 + approxFontHeight/4)
            ctx.font = 40 * scale + "px Arcade"
            ctx.fillStyle = "white"
            approxFontHeight = parseInt(ctx.font)
            ctx.fillText("Press  any  key", canvas.width / 2, canvas.height * 2/3 + approxFontHeight/4)
            if(states.muted)
                button.mute.draw()
            else
                button.unmute.draw()
            ctx.fillStyle = "rgb(255, 255, 255, 0.2)"
            if(hover == 6)
                ctx.fillRect(button.mute.pos.x, button.mute.pos.y, button.mute.size.w, button.mute.size.h)
        }
    }
    function displayPause() {
        ctx.fillStyle = "rgb(0, 0, 0, 0.2)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "white"
        ctx.font = (60 * scale) + "px Arcade"
        ctx.textAlign = 'center'
        let approxFontHeight = parseInt(ctx.font)
        ctx.fillText("Paused", canvas.width / 2, canvas.height / 2 + approxFontHeight/4)
        button.ent4.draw()
        button.ent5.draw()
        if(states.muted)
            button.mute.draw()
        else
            button.unmute.draw()
        ctx.fillStyle = "rgb(255, 255, 255, 0.2)"
        if(hover == 4)
            ctx.fillRect(button.ent4.pos.x, button.ent4.pos.y, button.ent4.size.w, button.ent4.size.h)
        else if(hover == 5)
            ctx.fillRect(button.ent5.pos.x, button.ent5.pos.y, button.ent5.size.w, button.ent5.size.h)
        else if(hover == 6)
            ctx.fillRect(button.mute.pos.x, button.mute.pos.y, button.mute.size.w, button.mute.size.h)
    }
    function displayGameOver() { 
        clear()
        displayPlayers()
        displayEnemies()
        displayShooting()
        displayBoom()
        displayShield()
        displayHp()
        displayScore()
        ctx.fillStyle = "rgb(0, 0, 0, 0.2)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "white"
        ctx.font = (60 * scale) + "px Arcade"
        ctx.textAlign = 'center'
        let approxFontHeight = parseInt(ctx.font)
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 + approxFontHeight/4)
        button.ent3.draw()
        if(states.muted)
            button.mute.draw()
        else
            button.unmute.draw()
        ctx.fillStyle = "rgb(255, 255, 255, 0.2)"
        if(hover == 3)
            ctx.fillRect(button.ent3.pos.x, button.ent3.pos.y, button.ent3.size.w, button.ent3.size.h)
        else if(hover == 6)
            ctx.fillRect(button.mute.pos.x, button.mute.pos.y, button.mute.size.w, button.mute.size.h)
    }
    function killIfEnemyTouch() {
        if(enemy.grid[0][enemy.grid[0].length - 1 - enemy.offset.offsetBot].y * scale + enemy.ent.size.h >= canvas.height * 4/5)
            healthbar.hp = 0
    }
    function playersShooting() {
        if(counter1 % reloadtime == 0 && counter1 != 0) {
            shot1 = true
            counter1 = 0
        } 
        if(player1.shooting && shot1) { 
            bullet1.pos.push({x: (player1.pos.x + (player1.size.w - bullet1.ent.size.w) / 2) / scale, y: player1.pos.y / scale - 5})
            shot1 = false
        }
        if(bullet1.pos.length != 0) {
            if(bullet1.pos.length != 0) {
                for(let element of bullet1.pos) {
                    moveBullet(element, bullet1.ent.speed, "Up")

                    if(bullet1.pos[0].y < 0) {
                        bullet1.pos.shift()
                    }

                    let bul = {
                        x: element.x,
                        y: element.y,
                        w: bullet1.ent.size.w / scale,
                        h: bullet1.ent.size.h / scale
                    }
                    if(!shield.hp.every((currentValue) => currentValue == 0)) {
                        for(let i = 0; i < shield.shields; i++) {
                            if(shield.hp[i] == 0) continue;
                            let sh = {
                                x: i * (shield.ent.size.w / scale + 100) + (canvas.width / scale - shield.shields * (shield.ent.size.w / scale + 100)) / 2 + 50,
                                y: canvas.height * 3/4 / scale - shield.ent.size.h / scale - 5,
                                w: shield.ent.size.w / scale,
                                h: shield.ent.size.h / scale
                            }
                            if(hasIntersection(bul, sh)) {
                                if(shield.hp[i] > 0) {
                                    shield.hp[i]--
                                    bullet1.pos.splice(bullet1.pos.indexOf(element), 1)
                                }
                                break;
                            }
                        }
                    }
                    for(let element1 of enemy.grid) {
                        for(let el of element1) {
                            if(!el.disp) continue;
                            let en = {
                                x: el.x,
                                y: el.y,
                                w: enemy.ent.size.w / scale,
                                h: enemy.ent.size.h / scale
                            }
                            if(hasIntersection(bul, en)) {
                                if(el.disp) {
                                    boom.pos.push({x: el.x + (enemy.ent.size.w - boom.ent.size.w) / 2, y: el.y + (enemy.ent.size.h - boom.ent.size.h) / 2, time: Date.now()})
                                    el.disp = false
                                    bullet1.pos.splice(bullet1.pos.indexOf(element), 1)
                                    score += 10
                                }
                            }
                        }
                    }
                }
            }
        }
        if(states.multiplayer) {
            if(counter2 % reloadtime == 0 && counter2 != 0) {
                shot2 = true
                counter2 = 0
            } 
            if(player2.shooting && shot2) { 
                bullet2.pos.push({x:(player2.pos.x + (player2.size.w - bullet2.ent.size.w) / 2) / scale, y:player2.pos.y / scale - 5})
                shot2 = false
            }
            if(bullet2.pos.length != 0) {
                if(bullet2.pos.length != 0) {
                    for(let element of bullet2.pos) {
                        moveBullet(element, bullet2.ent.speed, "Up")
    
                        if(bullet2.pos[0].y < 0) { 
                            bullet2.pos.shift()
                        }
    
                        let bul = {
                            x: element.x,
                            y: element.y,
                            w: bullet2.ent.size.w / scale,
                            h: bullet2.ent.size.h / scale
                        }
                        if(!shield.hp.every((currentValue) => currentValue == 0)) {
                            for(let i = 0; i < shield.shields; i++) {
                                if(shield.hp[i] == 0) continue;
                                let sh = {
                                    x: i * (shield.ent.size.w / scale + 100) + (canvas.width / scale - shield.shields * (shield.ent.size.w / scale + 100)) / 2 + 50,
                                    y: canvas.height * 3/4 / scale - shield.ent.size.h / scale - 5,
                                    w: shield.ent.size.w / scale,
                                    h: shield.ent.size.h / scale
                                }
                                if(hasIntersection(bul, sh)) {
                                    if(shield.hp[i] > 0) {
                                        shield.hp[i]--
                                        bullet2.pos.splice(bullet2.pos.indexOf(element), 1)
                                    }
                                    break;
                                }
                            }
                        }
                        for(let element1 of enemy.grid) {
                            for(let el of element1) {
                                if(!el.disp) continue;
                                let en = {
                                    x: el.x,
                                    y: el.y,
                                    w: enemy.ent.size.w / scale,
                                    h: enemy.ent.size.h / scale
                                }
                                if(hasIntersection(bul, en)) {
                                    if(el.disp) {
                                        boom.pos.push({x: el.x + (enemy.ent.size.w - boom.ent.size.w) / 2, y: el.y + (enemy.ent.size.h - boom.ent.size.h) / 2, time: Date.now()})
                                        el.disp = false
                                        bullet2.pos.splice(bullet2.pos.indexOf(element), 1)
                                        score += 10
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if(score > highscore)
            highscore = score
    }
    function enemiesShooting() {
        if(countere % enemy.reloadtimee == 0 && countere != 0) {
            shote = true
            countere = 0
        } 
        if(shote) { 
            let r1, r2
            do{
                r1 = Math.floor(Math.random() * (enemy.grid.length - enemy.offset.offsetR - enemy.offset.offsetL) + enemy.offset.offsetL)
                r2 = Math.floor(Math.random() * (enemy.grid[r1].length - enemy.offset.offsetBot))
            }while(enemy.grid[r1][r2].disp != true)

            bullete.pos.push({x: enemy.grid[r1][r2].x + (enemy.ent.size.w - bullete.ent.size.w) / scale / 2, y: enemy.grid[r1][r2].y / scale + enemy.ent.size.h + 5})
            shote = false
        }
        if(bullete.pos.length != 0) {
            if(bullete.pos.length != 0) {
                for (let element of bullete.pos) {
                    moveBullet(element, bullete.ent.speed, "Down")
                }
                if(bullete.pos[0].y > canvas.height) {
                    bullete.pos.shift()
                }
            }
            for(let element of bullete.pos) {
                let bul = {
                    x: element.x,
                    y: element.y,
                    w: bullete.ent.size.w / scale,
                    h: bullete.ent.size.h / scale
                }
                if(!shield.hp.every((currentValue) => currentValue == 0)) {
                    for(let i = 0; i < shield.shields; i++) {
                        if(shield.hp[i] == 0) continue;
                        let sh = {
                            x: i * (shield.ent.size.w / scale + 100) + (canvas.width / scale - shield.shields * (shield.ent.size.w / scale + 100)) / 2 + 50,
                            y: canvas.height * 3/4 / scale - shield.ent.size.h / scale - 5,
                            w: shield.ent.size.w / scale,
                            h: shield.ent.size.h / scale
                        }
                        if(hasIntersection(bul, sh)) {
                            if(shield.hp[i] > 0) {
                                shield.hp[i]--
                                bullete.pos.splice(bullete.pos.indexOf(element), 1)
                            }
                            break;
                        }
                    }
                }
                let p1 = {
                    x: player1.pos.x / scale,
                    y: player1.pos.y / scale,
                    w: player1.size.w / scale,
                    h: player1.size.h / scale
                }
                if(hasIntersection(bul, p1)) {
                    if(healthbar.hp > 0) {
                        healthbar.hp--
                        bullete.pos.splice(bullete.pos.indexOf(element), 1)
                    } 
                }
                else if(states.multiplayer) {
                    let p2 = {
                        x: player2.pos.x / scale,
                        y: player2.pos.y / scale,
                        w: player2.size.w / scale,
                        h: player2.size.h / scale
                    }
                    if(hasIntersection(bul, p2))
                        if(healthbar.hp > 0) {
                            healthbar.hp--
                            bullete.pos.splice(bullete.pos.indexOf(element), 1)
                        } 
                }
            }
        }
    }
    function clearBoom() {
        for(let element of boom.pos){
            if(Date.now() - element.time >= 300){ //^ delete after 300ms
                boom.pos.splice(boom.pos.indexOf(element), 1)
            }
        }
    }
    function reload() {
        healthbar.hp = healthbar.maxhp
        for(let i = 0; i < shield.shields; i++)
            shield.hp[i] = shield.maxhp
        counter1 = 0
        counter2 = 0
        countere = 0
        movecounter = 0
        score = 0
        shot1 = true
        shot2 = true
        shote = true
        enemy.reloadtimee = 2000 / proccesdelay
        enemy.movecooldown = 750 / proccesdelay
        level.lvl = 1
        bullet1.pos.splice(0, bullet1.pos.length)
        bullet2.pos.splice(0, bullet2.pos.length)
        bullete.pos.splice(0, bullete.pos.length)
        if(states.multiplayer) {
            player1.setPos(1)
            player2.setPos(2)
        }
        else
            player1.setPos(0)
        for (let i = 0; i < enemy.grid.length; i++) {
            for(let j = 0; j < enemy.grid[i].length; j++) {
                enemy.grid[i][j] = {x: i * (enemy.ent.size.w / scale + 15) + ((canvas.width / scale - enemy.grid.length * (enemy.ent.size.w / scale + 15) + 15) / 2), y: j * (enemy.ent.size.h / scale + 15) + 100, disp: true}
            }
        }
        file = JSON.parse(localStorage.getItem("Score"))
        states.pause = false
    }

    let states = {
        menu: true,
        option: false,
        multiplayer: false, //^ multiplayer setting
        gameover: false,
        pause: false,
        muted: true
    }

    let counter1 = 0
    let counter2 = 0
    let countere = 0
    let movecounter = 0
    let hover = 0

    let shot1 = true
    let shot2 = true
    let shote = true

    const canvas = document.querySelector("canvas")
    canvas.height = window.innerHeight - 50
    canvas.width = canvas.height * 0.875
    if(window.innerWidth - 50 < canvas.width) {
        canvas.width = window.innerWidth - 50
        canvas.height = canvas.width * 1.143
    }
    const ctx = canvas.getContext("2d")
    
    document.addEventListener("keydown", (event) => {
        event.preventDefault()
        if(states.menu) {
            states.option = true
        }
        else if(!states.gameover) {
            if(event.code == "Escape")
                states.pause = !states.pause
        }
    })

    canvas.onmousemove = (event) => {
        let mouse = {
            x: event.offsetX,
            y: event.offsetY,
            w: 0,
            h: 0
        }
        if(states.menu) {
            if(hasIntersection(mouse, {x: button.mute.pos.x, y: button.mute.pos.y, w: button.mute.size.w, h: button.mute.size.h})) hover = 6
            else if(states.option) {
                if(hasIntersection(mouse, {x: button.ent1.pos.x, y: button.ent1.pos.y, w: button.ent1.size.w, h: button.ent1.size.h})) hover = 1
                else if(hasIntersection(mouse, {x: button.ent2.pos.x, y: button.ent2.pos.y, w: button.ent2.size.w, h: button.ent2.size.h})) hover = 2
                else hover = 0
            }
            else hover = 0
        }
        else if(healthbar.hp == 0) {
            if(hasIntersection(mouse, {x: button.ent3.pos.x, y: button.ent3.pos.y, w: button.ent3.size.w, h: button.ent3.size.h})) hover = 3
            else if(hasIntersection(mouse, {x: button.mute.pos.x, y: button.mute.pos.y, w: button.mute.size.w, h: button.mute.size.h})) hover = 6
            else hover = 0
        }
        else if(states.pause) {
            if(hasIntersection(mouse, {x: button.ent4.pos.x, y: button.ent4.pos.y, w: button.ent4.size.w, h: button.ent4.size.h})) hover = 4
            else if(hasIntersection(mouse, {x: button.ent5.pos.x, y: button.ent5.pos.y, w: button.ent5.size.w, h: button.ent5.size.h})) hover = 5
            else if(hasIntersection(mouse, {x: button.mute.pos.x, y: button.mute.pos.y, w: button.mute.size.w, h: button.mute.size.h})) hover = 6
            else hover = 0
        }
    }
    canvas.onmousedown = (event) => {
        if(event.button == 0) {
            let mouse = {
                x: event.offsetX,
                y: event.offsetY,
                w: 0,
                h: 0
            }
            if(states.menu || states.pause || states.gameover)
                if(hasIntersection(mouse, {x: button.mute.pos.x, y: button.mute.pos.y, w: button.mute.size.w, h: button.mute.size.h}))
                    states.muted = !states.muted
                if(states.muted)
                    audio.pause()
                else
                    audio.play()
            if(states.menu && states.option) {
                if(hasIntersection(mouse, {x: button.ent1.pos.x, y: button.ent1.pos.y, w: button.ent1.size.w, h: button.ent1.size.h,})) {
                    states.multiplayer = false
                    states.menu = false
                    states.option = false
                    highscore = file.solo
                    player1.setPos(0)
                    keyboard(player1, player2, false)
                }
                else if(hasIntersection(mouse, {x: button.ent2.pos.x, y: button.ent2.pos.y, w: button.ent2.size.w, h: button.ent2.size.h,})) {
                    states.multiplayer = true
                    states.menu = false
                    states.option = false
                    player1.setPos(1)
                    player2.setPos(2)
                    highscore = file.multiplayer
                    keyboard(player1, player2, true)
                }
            }
            else if(healthbar.hp == 0) {
                if(hasIntersection(mouse, {x: button.ent3.pos.x, y: button.ent3.pos.y, w: button.ent3.size.w, h: button.ent3.size.h,})) {
                    states.menu = true
                    states.gameover = false
                    reload()
                }
            }
            else if(states.pause) {
                if(hasIntersection(mouse, {x: button.ent4.pos.x, y: button.ent4.pos.y, w: button.ent4.size.w, h: button.ent4.size.h})) states.pause = false
                else if(hasIntersection(mouse, {x: button.ent5.pos.x, y: button.ent5.pos.y, w: button.ent5.size.w, h: button.ent5.size.h})) {
                    states.menu = true
                    reload()
                }
            }
        }
    }

    let scale = canvas.width / 700
    let refresh = 1000 / 60
    let proccesdelay = 7 //^ ms = 1tick
    const reloadtime = 1000 / proccesdelay //^ ticks; 1tick = 5ms

    let file = JSON.parse(localStorage.getItem("Score"))
    if(file == null) {
        localStorage.setItem("Score", JSON.stringify({solo: 0, multiplayer: 0}))
        file = JSON.parse(localStorage.getItem("Score"))
    } 
    
    let score = 0
    let highscore = 0
    let level = {
        lvl: 1,
        next: false
    }
    let healthbar = {
        maxhp: 3,
        hp: 3,
        heart: new Entity(document.getElementById("heart"), scale, 0.15),
        noheart: new Entity(document.getElementById("noheart"), scale, 0.15)
    }

    let shield = {
        maxhp: 20,
        shields: 4,
        ent: new Entity(document.getElementById("shield"), scale, 0.15),
        hp: []
    }
    for(let i = 0; i < shield.shields; i++)
        shield.hp[i] = shield.maxhp

    let button = {
        ent1: new Entity(document.getElementById("button1"), scale, 0.2),
        ent2: new Entity(document.getElementById("button2"), scale, 0.2),
        ent3: new Entity(document.getElementById("button3"), scale, 0.2),
        ent4: new Entity(document.getElementById("button4"), scale, 0.2),
        ent5: new Entity(document.getElementById("button5"), scale, 0.2),
        mute: new Entity(document.getElementById("buttonmute"), scale, 0.2),
        unmute: new Entity(document.getElementById("buttonunmute"), scale, 0.2)
    }
    button.ent1.setPos((canvas.width - button.ent1.size.w) / scale * 1/3, (canvas.height - button.ent1.size.h) / scale * 3/5)
    button.ent2.setPos((canvas.width - button.ent2.size.w) / scale * 2/3, (canvas.height - button.ent2.size.h) / scale * 3/5)
    button.ent3.setPos((canvas.width - button.ent3.size.w) / scale / 2, (canvas.height - button.ent3.size.h) / scale * 3/4)
    button.ent4.setPos((canvas.width - button.ent4.size.w) / scale / 2, (canvas.height - button.ent4.size.h) / scale * 3/4 - 50)
    button.ent5.setPos((canvas.width - button.ent5.size.w) / scale / 2, (canvas.height - button.ent5.size.h) / scale * 3/4 + 50)
    button.mute.setPos((canvas.width - button.mute.size.w) / scale - 20, (canvas.height - button.mute.size.h) / scale - 20)
    button.unmute.setPos((canvas.width - button.unmute.size.w) / scale - 20, (canvas.height - button.unmute.size.h) / scale - 20)

    let menubg = new Entity(document.getElementById("menubg"), scale, 1)
    let player1 = new Player(document.getElementById("player1"), scale, 0.2)
    player1.speed = 0.5
    let bullet1 = {
        ent: new Entity(document.getElementById("bullet1"), scale, 0.0275),
        pos: []
    }
    bullet1.ent.speed = 1

    let player2 = new Player(document.getElementById("player2"), scale, 0.2)
    player2.speed = 0.5
    let bullet2 = {
        ent: new Entity(document.getElementById("bullet2"), scale, 0.0275),
        pos: []
    }
    bullet2.ent.speed = 1

    let enemy = {
        ent: new Entity(document.getElementById("enemy"), scale, 0.15),
        grid: new Array(11),
        reloadtimee: 2000 / proccesdelay, //^ ticks
        movecooldown: 750 / proccesdelay, //^ ticks
        offset: {offsetR: 0, offsetL: 0, offsetBot: 0}
    }
    enemy.ent.speed = 10
    for (let i = 0; i < enemy.grid.length; i++) {
        enemy.grid[i] = new Array(5)
        for(let j = 0; j < enemy.grid[i].length; j++) {
            enemy.grid[i][j] = {x: i * (enemy.ent.size.w / scale + 15) + ((canvas.width / scale - enemy.grid.length * (enemy.ent.size.w / scale + 15) + 15) / 2), y: j * (enemy.ent.size.h / scale + 15) + 100, disp: true}
        }
    }
    let bullete = {
        ent: new Entity(document.getElementById("bullete"), scale, 0.05),
        pos: []
    }
    bullete.ent.speed = 1

    let boom = {
        ent: new Entity(document.getElementById("boom"), scale, 0.25),
        pos: []
    }
    let refreshtimer = 0;
    function animate(){
        if(states.menu) {
            displayMenu()
        }
        else if(!states.gameover) { 
            clear()
            displayPlayers()
            displayEnemies()
            displayShooting()
            displayBoom()
            displayShield()
            displayHp()
            displayScore()
            if(states.pause)
                displayPause()
        }
        else {
            displayGameOver()
        }
    }
    setInterval(() => {
        if(!states.gameover && !states.menu && !states.pause) {
            if(healthbar.hp == 0) {
                if(states.multiplayer) file.multiplayer = highscore
                else file.solo = highscore
                localStorage.setItem("Score", JSON.stringify(file))
                states.gameover = true
            }
            if(spawnNewIfAllDead(enemy)) {
                bullet1.pos.splice(0, bullet1.pos.length)
                counter1 = 0
                if(states.multiplayer) {
                    bullet2.pos.splice(0, bullet1.pos.length)
                    counter2 = 0
                }
            }
            playersShooting()
            clearBoom()
            enemiesShooting()
            if(movecounter % enemy.movecooldown == 0 && movecounter != 0) {
                moveEnemies(enemy, level)
                movecounter = 0
            }
            killIfEnemyTouch()
            if(movecounter < enemy.movecooldown)
                movecounter++
            if(countere < enemy.reloadtimee)
                countere++
            move(player1)
            if(counter1 < reloadtime && !shot1)
                counter1++
            if(states.multiplayer) {
                move(player2)
                if(counter2 < reloadtime && !shot2)
                    counter2++
            }
        }
        if(refreshtimer * proccesdelay >= refresh){
            animate()
        }
        refreshtimer++
    }, proccesdelay)
})