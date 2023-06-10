class Sprite{     //moving images
    constructor({
        position, 
        imageSrc, 
        scale=1, 
        totalFrames=1, 
        offset={x:0, y:0}
    }) {  //function within class, used when objects are made from the class
        this.position=position
        this.width=50
        this.height=150
        this.image= new Image()   //html image within a js property
        this.image.src=imageSrc
        this.scale=scale
        this.totalFrames=totalFrames
        this.currentFrame=0
        this.framesElapsed=0
        this.framesHold=10
        this.offset=offset
    }

    draw(){
        c.drawImage(
            this.image,   
            this.currentFrame*(this.image.width/this.totalFrames),                     //crop location
            0,
            this.image.width/this.totalFrames,    //crop width+height, 6 frames
            this.image.height,
            this.position.x-this.offset.x, 
            this.position.y-this.offset.y, 
            (this.image.width/this.totalFrames)*this.scale,   //width of image
            this.image.height*this.scale   //height of image
            )             
    }

    animateFrames(){
        this.framesElapsed++
        if (this.framesElapsed%this.framesHold===0) {
            this.framesElapsed=0
            if (this.currentFrame<this.totalFrames-1) {
                this.currentFrame++}
            else {
                this.currentFrame=0
            }
        }
    }

    update(){
        this.draw()
        this.animateFrames()
    }
}

class Character extends Sprite {     //moving images
    constructor({
        position, 
        velocity, 
        color='red', 
        imageSrc, 
        scale=1, 
        totalFrames=1,
        offset={x:0, y:0},
        sprites,
        attackBox={offset:{}, width:undefined, height:undefined}
    }) {  //function within class, used when objects are made from the class
        super({  //calls constructor of the parent
            position,
            imageSrc,
            scale,
            totalFrames,
            offset
        }) 

        this.velocity=velocity
        this.color=color
        this.lastKey
        this.width=50
        this.height=150
        this.attackbox={
            position: {  //updated manually
                x:this.position.x,
                y:this.position.y 
            },
            offset:attackBox.offset,
            width:attackBox.width,
            height:attackBox.height,
        }
        this.isAttacking
        this.health=100
        this.currentFrame=0    //custom fps for character, more adjustable this way
        this.framesElapsed=0
        this.framesHold=10
        this.sprites=sprites
        this.dead=false

        for (const sprite in this.sprites) {
            sprites[sprite].image=new Image()
            sprites[sprite].image.src=sprites[sprite].imageSrc
        }
    }

    update(){
        this.draw()
        if (!this.dead)
            this.animateFrames()

        this.attackbox.position.x=this.position.x+this.attackbox.offset.x
        this.attackbox.position.y=this.position.y+this.attackbox.offset.y

        //attackbox
        //c.fillRect(this.attackbox.position.x, this.attackbox.position.y, this.attackbox.width, this.attackbox.height)

        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height-96) {
            this.velocity.y=0
            this.position.y=330
        } else
        this.velocity.y+=gravity
        
    }

    attack(){
        this.switchSprite('attack1')
        this.isAttacking=true}

    takeHit(){
        this.health-=20

        if (this.health<=0) {
            this.switchSprite('death')} 
        else {
            this.switchSprite('takeHit')}
    }

    switchSprite(sprite) {
        if (this.image===this.sprites.death.image) {
            if (this.currentFrame=== this.sprites.death.totalFrames-1) //animate the man until the body fully drops
                this.dead=true
            return}

        if (this.image===this.sprites.attack1.image &&  this.currentFrame < this.sprites.attack1.totalFrames-1) return  //priotize attack1 animation

        if (this.image===this.sprites.takeHit.image &&  this.currentFrame < this.sprites.takeHit.totalFrames-1) return


        switch (sprite) {   //able to abstract this? plus using list
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image=this.sprites.idle.image
                    this.totalFrames=this.sprites.idle.totalFrames
                    this.currentFrame=0}
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image=this.sprites.run.image
                    this.totalFrames=this.sprites.run.totalFrames
                    this.currentFrame=0}
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image){
                    this.image=this.sprites.jump.image
                    this.totalFrames=this.sprites.jump.totalFrames
                    this.currentFrame=0}
                break
            case 'fall':
                if (this.image !== this.sprites.fall.image){
                    this.image=this.sprites.fall.image
                    this.totalFrames=this.sprites.fall.totalFrames
                    this.currentFrame=0}
                break
            case 'attack1':
                if (this.image !== this.sprites.attack1.image){
                    this.image=this.sprites.attack1.image
                    this.totalFrames=this.sprites.attack1.totalFrames
                    this.currentFrame=0}
                break
            case'takeHit':
                if (this.image !== this.sprites.takeHit.image){
                    this.image=this.sprites.takeHit.image
                    this.totalFrames=this.sprites.takeHit.totalFrames
                    this.currentFrame=0}
                break
            case'death':
            if (this.image !== this.sprites.death.image){
                this.image=this.sprites.death.image
                this.totalFrames=this.sprites.death.totalFrames
                this.currentFrame=0}
            break
        }
    }
}