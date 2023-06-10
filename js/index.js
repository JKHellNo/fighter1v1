

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0, canvas.width, canvas.height)

const gravity=0.7

const socket =io('http://localhost:3000')

socket.on('init', handleInit)

const background= new Sprite({   //careful, might have to resize png or force fit into canvas using html by stretching/expanding
    position: {
        x:0,
        y:0
    },
    imageSrc:'./img/background.png'  //https://codeshack.io/images-sprite-sheet-generator/
})

const shop= new Sprite({   //scale it up, and animate it
    position: {
        x:600,
        y:128
    },
    imageSrc:'./img/shop.png',
    scale:2.75,
    totalFrames:6
})

const p1 = new Character({
    position: {    //wrapping, technique
        x:0,
        y:0},
    velocity: {
        x:0,
        y:0},
    imageSrc:'./img/samuraiMack/Idle.png',
    totalFrames:8,
    scale: 2.5,
    offset: {
        x:215,
        y:157
    },
    sprites:{     //2:36
        idle: {
            imageSrc:'./img/samuraiMack/Idle.png',
            totalFrames: 8
        },
        run: {
            imageSrc:'./img/samuraiMack/Run.png',
            totalFrames: 8
        },
        jump: {
            imageSrc:'./img/samuraiMack/Jump.png',
            totalFrames: 2
        },
        fall: {
            imageSrc:'./img/samuraiMack/Fall.png',
            totalFrames: 2
        },
        attack1: {
            imageSrc:'./img/samuraiMack/Attack1.png',
            totalFrames: 6
        }, 
        takeHit: {
            imageSrc:'./img/samuraiMack/Take Hit - white silhouette.png',
            totalFrames: 4
        },
        death: {
            imageSrc:'./img/samuraiMack/Death.png',
            totalFrames: 6
        }
    },
    attackBox:{
        offset:{
            x:100,
            y:50 
        },
        width:160,
        height:50 
    }
})

const p2 = new Character({  //enemy
    position: { 
        x:400,
        y:0},
    velocity: {
        x:0,
        y:0},
    imageSrc:'./img/kenji/Idle.png',
    totalFrames:4,
    scale: 2.5,
    offset: {
        x:215,
        y:167
    },
    sprites:{     //2:36
        idle: {
            imageSrc:'./img/kenji/Idle.png',
            totalFrames: 4
        },
        run: {
            imageSrc:'./img/kenji/Run.png',
            totalFrames: 8
        },
        jump: {
            imageSrc:'./img/kenji/Jump.png',
            totalFrames: 2
        },
        fall: {
            imageSrc:'./img/kenji/Fall.png',
            totalFrames: 2
        }, 
        attack1: {
            imageSrc:'./img/kenji/Attack1.png',
            totalFrames: 4
        },
        takeHit: {
            imageSrc:'./img/kenji/Take hit.png',
            totalFrames: 3
        },
        death: {
            imageSrc:'./img/kenji/Death.png',
            totalFrames: 7
        }
    },

    attackBox:{
        offset:{
            x:-170,
            y:50
        },
        width:170,
        height:50 
    }
})

const p3 = new Character({  //bint
    position: { 
        x:600,
        y:0},
    velocity: {
        x:0,
        y:0},
    imageSrc:'./img/wangus/restL.png',
    totalFrames:1,
    scale: 0.4,
    offset: {
        x:0,
        y:-10
    },
    sprites:{     //2:36
        idle: {
            imageSrc:'./img/wangus/restL.png',
            totalFrames: 2
        },
        idleR: {
            imageSrc:'./img/wangus/restR.png',
            totalFrames: 2
        },
        run: {
            imageSrc:'./img/wangus/walkingL.png',
            totalFrames: 4
        },
        jump: {
            imageSrc:'./img/wangus/jumpL1.png',
            totalFrames: 1
        },
        fall: {
            imageSrc:'./img/wangus/restL.png',
            totalFrames: 2
        }, 
        attack1: {
            imageSrc:'./img/kenji/Attack1.png',
            totalFrames: 4
        },
        takeHit: {
            imageSrc:'./img/kenji/Take hit.png',
            totalFrames: 3
        },
        death: {
            imageSrc:'./img/kenji/Death.png',
            totalFrames: 7
        }
    },
    attackBox:{
        offset:{
            x:-170,
            y:50
        },
        width:170,
        height:50 
    }
})

const p1keys = {
    a:{pressed:false},
    d:{pressed:false}
}
const p2keys = {
    ArrowLeft:{pressed:false},
    ArrowRight:{pressed:false}
}

const p3keys = {   //bint
    j:{pressed:false},
    l:{pressed:false}
}

decreaseTimer()

function animation(){
    window.requestAnimationFrame(animation) //func to loop
    c.fillStyle='black'
    c.fillRect(0,0,canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle='rgba(255, 255, 255, 0.15)'  //white layer
    c.fillRect(0,0,canvas.width, canvas.height)
    p1.update()
    p2.update()
    p3.update()  //bint

    p1.velocity.x=0
    p2.velocity.x=0
    p3.velocity.x=0   //bint

    
    if (p1keys.a.pressed && p1keys.d.pressed) {  //player movement, counter-strafe
        p1.velocity.x=0
        p1.switchSprite('idle')
    }else if (p1keys.a.pressed) {
        p1.velocity.x=-5
        p1.switchSprite('run')
    } else if (p1keys.d.pressed) {
        p1.velocity.x=5
        p1.switchSprite('run')
    } else {
        p1.switchSprite('idle')
    }

    if (p1.velocity.y<0) {
        p1.switchSprite('jump')
    } else if (p1.velocity.y >0) { //falling
        p1.switchSprite('fall')
    }

    if (p2keys.ArrowLeft.pressed && p2keys.ArrowRight.pressed) {   //player movement, counter-strafe, abstrack this?
        p2.velocity.x=0
        p2.switchSprite('idle')
    }else if (p2keys.ArrowLeft.pressed) {
        p2.velocity.x=-5
        p2.switchSprite('run')
    } else if (p2keys.ArrowRight.pressed) {
        p2.velocity.x=5
        p2.switchSprite('run')
    } else {
        p2.switchSprite('idle')
    }

    if (p2.velocity.y<0) {
        p2.switchSprite('jump')
    } else if (p2.velocity.y >0) { //falling
        p2.switchSprite('fall')
    }

    if (p3keys.j.pressed && p3keys.l.pressed) {   //bint
        p3.velocity.x=0
        p3.switchSprite('idle')
    }else if (p3keys.j.pressed) {
        p3.velocity.x=-5
        p3.switchSprite('run')
    } else if (p3keys.l.pressed) {
        p3.velocity.x=5
        p3.switchSprite('run')
    } else {
        p3.switchSprite('idle')
    }

    if (p3.velocity.y<0) {
        p3.switchSprite('jump')
    } else if (p3.velocity.y >0) { //falling
        p3.switchSprite('fall')
    }

    //attackbox collision and get hit
    if (collision({rectangle1:p1, rectangle2:p2}) 
        && p1.isAttacking
        && p1.currentFrame===4)

        {p2.takeHit()
        p1.isAttacking=false
        gsap.to('#p2Health', {width:p2.health+'%'})//document.querySelector('#p2Health').style.width=p2.health+"%"
        }
 
    //misses attack
    if (p1.isAttacking && p1.currentFrame===4) 
        {p1.isAttacking=false}

    //player 2
    if (collision({rectangle1:p2, rectangle2:p1}) 
        && p2.isAttacking
        && p2.currentFrame===2)

        {p1.takeHit()
        p2.isAttacking=false
        gsap.to('#p1Health', {width:  p1.health+'%'})
        }

    if (p2.isAttacking && p2.currentFrame===2) {
        p2.isAttacking=false}

    //end game when player loses all health
    if (p1.health<=0 || p2.health<=0)
        determineWinner({p1, p2, timerId})
}

animation()

window.addEventListener('keydown', (event) =>{   //controls
    if (!p1.dead) {
        switch (event.key) {
            case 'd':
                p1keys.d.pressed=true
                p1.lastKey='d'
                break
            case 'a':
                p1keys.a.pressed=true
                p1.lastKey='a'
                break 
            case 'w':  //flappy bird+dino
                if (p1.velocity.y===0) {
                    p1.velocity.y=-20}    
                break
            case 's':
                p1.attack()
                break
        }
    }

    if (!p2.dead) {
        switch (event.key) {
            case 'ArrowRight':
                p2keys.ArrowRight.pressed=true
                p2.lastKey='ArrowRight'
                break
            case 'ArrowLeft':
                p2keys.ArrowLeft.pressed=true
                p2.lastKey='ArrowLeft'
                break 
            case 'ArrowUp':
                if (p2.velocity.y===0) {
                    p2.velocity.y=-20}    
                break
            case 'ArrowDown':
                p2.attack()
                break
        }
    }
    if (!p3.dead) {
        switch (event.key) {
            case 'j': //bint
                p3keys.j.pressed=true
                p3.lastKey='j'
                break
            case 'l':
                p3keys.l.pressed=true
                p3.lastKey='l'
                break 
            case 'i':  //flappy bird+dino
                if (p3.velocity.y===0) {
                    p3.velocity.y=-20}    
                break
            case 'k':
                p3.attack()
                break
        }
    }
})
 
window.addEventListener('keyup', (event) =>{  
    switch (event.key) {
        case 'd':
            p1keys.d.pressed=false
            break
        case 'a':
            p1keys.a.pressed=false
            break  
        case 'ArrowRight':
            p2keys.ArrowRight.pressed=false
            break
        case 'ArrowLeft':
            p2keys.ArrowLeft.pressed=false
            break 
        case 'j':
            p3keys.j.pressed=false
            break
        case 'l':
            p3keys.l.pressed=false
            break  
    }
    console.log(event.key)
})

function handleInit(msg) {
    console.log(msg)
}