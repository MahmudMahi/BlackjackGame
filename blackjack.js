let blackjackGame = {
    "you":{"scoreSpan":"#yourResult", "div":"#yourDiv", "score":0},
    "dealer":{"scoreSpan":"#dealerResult", "div":"#dealerDiv", "score":0},
    "cardIndex":['2','3','4','5','6','7','8','9','10','J','K','Q','A'],
    "cardScore":{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'K':10,'Q':10,'A':[1,11]},
    'wins':0,
    'loses':0,
    'draws':0,
    'isStand':false,
    'turnsOver':false
};

const YOU= blackjackGame["you"];
const DEALER= blackjackGame["dealer"];
const CARDS= blackjackGame['cardIndex'];

const hitSound = new  Audio('sounds/swish.m4a');
const cashSound = new  Audio('sounds/cash.mp3');
const awwSound = new  Audio('sounds/aww.mp3');
const bgMusic = new Audio('sounds/bgMusic.mp3');

document.querySelector("#hit").addEventListener('click',blackjackHit);//hit button
document.querySelector("#stand").addEventListener('click',blackjackStand);//stand button
document.querySelector("#deal").addEventListener('click',blackjackDeal);// deal button
document.querySelector("#bg-music").addEventListener('click',bg_music);

let count = 0;//to keep track of bg music
function bg_music(){
    if (count===0) {
        count = 1;
        bgMusic.play();
        document.querySelector('#bg-music').textContent = 'Background Music : On';
    }
    else{
        count = 0;
        bgMusic.pause();
        document.querySelector('#bg-music').textContent = 'Background Music : Off';
    }
}

function blackjackHit(){
    if (blackjackGame['isStand'] === false){
        let card = RandCard();
        showCards(YOU, card);
        updateScore(YOU, card);
        showScore(YOU);
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function blackjackStand(){
    blackjackGame['isStand'] = true;
    while(DEALER['score']<16 && blackjackGame['isStand']===true){
        let card = RandCard();
        showCards(DEALER,card);
        updateScore(DEALER, card);
        showScore(DEALER);
        await sleep(900);
    }

    blackjackGame['turnsOver'] = true;
    showResult(predictWinner());
}

function blackjackDeal(){
    if (blackjackGame['turnsOver']===true) {
        blackjackGame['isStand']=false;
        dltCards(YOU);
        dltScore(YOU);
        dltScore(DEALER);
        dltCards(DEALER);
        document.querySelector('#showResult').textContent="Let's play";
        document.querySelector('#showResult').style.color='blanchedalmond';
        blackjackGame['turnsOver']=false;
    }
}

function RandCard(){
    let randNum = Math.floor(Math.random()*13) ;
    return CARDS[randNum];
}

function showCards(activePlayer,card){
    if(activePlayer['score']<21){
        let cardImg = document.createElement('img');
        cardImg.src = 'images/'+card+'.png';
        cardImg.style.padding = '6px';
        document.querySelector(activePlayer["div"]).appendChild(cardImg);
        hitSound.play();
    }
}

function dltCards(activePlayer){
    let activeImg= document.querySelector(activePlayer['div']).querySelectorAll('img');
    for (var i = 0; i < activeImg.length; i++) {
        activeImg[i].remove();
    }
}

function updateScore(activePlayer, card){
  if(card==='A'){
        if ((activePlayer['score']+11)<21) {
            activePlayer['score']+= 11;
        }
        else{
            activePlayer['score']+=1;
        }
    }

    else if(activePlayer['score']>21){
        activePlayer['score']+= 0;
    }

    else{
          activePlayer['score']+= blackjackGame['cardScore'][card];
    }
    console.log(activePlayer['score']);
}

function showScore(activePlayer){
    if (activePlayer['score']>21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!!';
        document.querySelector(activePlayer['scoreSpan']).style.color= "red";
    }
    else{
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function dltScore(activePlayer){
    activePlayer['score']=0;
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    document.querySelector(activePlayer['scoreSpan']).style.color= "white";
}

function predictWinner(){
    let winner;
    if (YOU['score']<=21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score']>21) {
            winner = YOU;
            blackjackGame['wins']+= 1;
        }

        else if (YOU['score'] < DEALER['score']) {
            winner = DEALER;
            blackjackGame['loses']+=1;
        }
        else if (YOU['score'] === DEALER['score']){
            blackjackGame['draws'] +=1;
        }
    }//closing bracket of nested if statement

    else if (YOU['score']>21 && DEALER['score']<=21) {
        winner = DEALER;
        blackjackGame['loses']+=1;
    }
    else if(YOU['score']>21 && DEALER['score']>21){
        blackjackGame['draws']+=1;
    }

    return winner;
}

function showResult(winner){
    let msg , msgColor;
    if (blackjackGame['turnsOver']===true) {
        if (winner === YOU) {
            msg = "You Won";
            msgColor = "green";
            document.querySelector('#showResult').textContent=msg;
            document.querySelector('#showResult').style.color=msgColor;
            cashSound.play();
            document.querySelector('#wins').textContent=blackjackGame['wins'];
        }
        else if (winner === DEALER) {
            msg = "You Lost";
            msgColor = 'red';
            document.querySelector('#showResult').textContent=msg;
            document.querySelector('#showResult').style.color=msgColor;
            awwSound.play();
            document.querySelector('#loses').textContent=blackjackGame['loses'];
        }
        else{
            msg= 'You Drew';
            msgColor = 'yellow';
            document.querySelector('#showResult').textContent=msg;
            document.querySelector('#showResult').style.color=msgColor;
            document.querySelector('#draws').textContent=blackjackGame['draws'];
        }
    }
}
function Rules(){
  alert("RULES:=> You've got 3 button under the table, 'Hit', 'Stand', 'Deal' respectively. By pressing hit button, place your random card, and the score will be counted according to your card. IF YOUR SCORE IS ABOVE THAN 21 YOU'LL be BUSTED and so you will lose the game. If you think you're close to 21 like 16 or 18 or 20 , then stop hitting and press 'Stand', so that the dealer could place it's card. The rule is same for the dealer as well. After completing the game press 'Deal', which will reset the scores and you can then play the game again. Got it? ^_^" );
}

