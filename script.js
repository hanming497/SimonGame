//wireframe below: 
//https://wireframe.cc/bNox8R

//PseudoCode:
//let array = [];
//2 modes: display (mode1) and waiting for input (mode2)

//repeat two modes until user input is WRONG 

//mode1:
//Want to generate a random list of numbers corresponding to user score + 1, starting at score = 0;
//for every number, generate 1-4 to correspond to color. Light color up. wait one second, light next color, until end of array.

//mode2:
//wait for user input, time limit for timeout is 5 seconds, write reset function 
//everytime user passes entire array, score increases by 1
//make a queue for inputs ex. 1,3,2,4 expects 1 -> 3 -> 2 -> 4 
//if value matches generated value from mode 1 -> move onto next match. 
//else if theres nothing inside mode1 array, switch back to mode 1, increase score.

//Creating variables;
let $red = $('#R1')
let $blue = $('#B2')
let $green = $('#G3')
let $yellow = $('#Y4')
let $play = $('#play')
let $reset = $('#reset')
let $board = $('#board')
let $score = $('#score')
let $loser = $('#loseMSG')
let $header = $('#startMSG')
let score = 0;
let proceed = true;
let isInUserInputMode = false;
let inputArray = [];
let highScore = window.localStorage.getItem("highScore");
const COLORS = {
    RED: 'R',
    BLUE: 'B',
    GREEN: 'G',
    YELLOW: 'Y'
}
//setting up initialize function s
const initizalizeGame = () => {
    createBoxClickEvents()
    createPlayClickEvent()
    createResetClickEvent()
    if (highScore != null) {
        $score.append(`<p>High Score: ${highScore}</p>`);
    }

}

function createBoxClickEvents() {
    const onBoxClick = (color) => {
        return () => {
            if (isInUserInputMode) {
                inputArray.push(color)
            }
        }
    }
    $red.on("click", onBoxClick(COLORS.RED))
    $blue.on("click", onBoxClick(COLORS.BLUE))
    $green.on("click", onBoxClick(COLORS.GREEN))
    $yellow.on("click", onBoxClick(COLORS.YELLOW))
}

function createPlayClickEvent() {
    $play.on("click", function () {
        //start the game
        displayMode();
        score = 0;
        $play.attr("disabled", true);
        $header.addClass('hideElem')
    })
}

function createResetClickEvent() {
    $reset.on("click", function () {
        $play.attr("disabled", false);
        score = 0;
        isInUserInputMode = false;
        proceed = true;
        $loser.removeClass('bigText');
        $loser.html('')
        $score.removeClass('bigText');
        $score.html(`Your Score: ${score}`)
        if (highScore != null) {
            $score.append(`<p>High Score: ${highScore}</p>`);
        }
        $board.removeClass('hideElem')
        $header.removeClass('hideElem')
    })
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function lightUpWaitPush(color, currentColors, colorToPush) {
    color.addClass('lightUp');
    await new Promise(r => setTimeout(r, 1000));
    color.removeClass('lightUp');
    currentColors.push(colorToPush);
}

async function trySwitch(color, currentColors) {
    switch (color) {
        case 0:
            await lightUpWaitPush($red, currentColors, COLORS.RED);
            break;
        case 1:
            await lightUpWaitPush($blue, currentColors, COLORS.BLUE);
            break;
        case 2:
            await lightUpWaitPush($green, currentColors, COLORS.GREEN)
            break;
        case 3:
            await lightUpWaitPush($yellow, currentColors, COLORS.YELLOW)
            break;
        default:
            console.log("error!")
    }

}

async function displayMode() {
    isInUserInputMode = false;
    $score.html(`Your Score: ${score}`)
    if (highScore != null) {
        $score.append(`<p>High Score: ${highScore}</p>`);
    }
    if (!proceed) return;

    //mode1 returns an array 
    let currentColors = [];
    let counter = score + 1;
    while (counter > 0) {
        let color = getRandomInt(4)
        //added in for clarity when same color was displayed 
        await new Promise(r => setTimeout(r, 100));
        //sends us into trycatch
        await trySwitch(color, currentColors)
        counter--;
    }
    userInputMode(currentColors)

}

async function userInputMode(currentColors) {
    isInUserInputMode = true;
    //making timeout change with score for fair game. 
    let timeOut = (score + 1.5) * 1000;

    await new Promise(r => setTimeout(r, timeOut));

    let isPersonCorrect = true;
    while (isPersonCorrect && currentColors.length != 0) {
        let currentColor = currentColors.shift()
        if (inputArray.length > 0) {
            let inputColor = inputArray.shift()
            if (currentColor !== inputColor) {
                isPersonCorrect = false
            }
        }
        else {
            isPersonCorrect = false
        }
    }
    if (isPersonCorrect) {
        console.log('Correct!')
        score += 1;
        if (score > highScore) {
            window.localStorage.setItem("highScore", score)
            highScore = score;
        }
        displayMode();
    }
    else {
        proceed = false;
        $loser.html("You lose. Click reset to play again!")
        $loser.addClass("bigText")
        $score.addClass("bigText")
        $board.addClass("hideElem")
    }
}


//starting game:
initizalizeGame();