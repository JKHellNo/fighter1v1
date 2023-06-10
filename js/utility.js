function collision({rectangle1, rectangle2}){
    return (
        rectangle1.attackbox.position.x + rectangle1.attackbox.width >= rectangle2.position.x && //left to right attack, within range of attackbox
        rectangle1.attackbox.position.x <= rectangle2.position.x + rectangle2.width &&           //if player stands right of enemy, case solve, player is within range of the back of the sword
        rectangle1.attackbox.position.y + rectangle1.attackbox.height >=rectangle2.position.y && //while jumping, bottom of attackbox is in range of the height of enemy
        rectangle1.attackbox.position.y <= rectangle2.position.y + rectangle2.height         //top of attackbox is in range of the bottom of enemy
    )
}

function determineWinner({p1, p2, timerId}) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display='flex'
    if (p1.health === p2.health) 
            document.querySelector('#displayText').innerHTML='Tie' 
    else if (p1.health>p2.health)
        document.querySelector('#displayText').innerHTML='Player 1 wins' 
    else if (p1.health<p2.health)
    document.querySelector('#displayText').innerHTML='Player 2 wins'
}

let timer=60
let timerId
function decreaseTimer() {
    if (timer>0)
        {timerId=setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML=timer}

    if (timer===0) 
        determineWinner({p1, p2, timerId})
}