//audio controller
class AudioController {
    constructor() {
        //all sound that we will need in Assets folder

        this.bgMusic = new Audio('Assets/Audio/creepy.mp3');
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.matchSound = new Audio('Assets/Audio/match.wav');
        this.victorySound = new Audio('Assets/Audio/victory.wav');
        this.gameOverSound = new Audio('Assets/Audio/gameOver.wav');
        //set volume halfway up
        this.bgMusic.volume = 0.5;
        //music loops
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        //no stop feature so we will just pause it
        this.bgMusic.pause();
        //set time to zero to restart
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        //stop music so victory music can start
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        //stop music so victory music can start
        this.stopMusic();
        this.gameOverSound.play();
    }
}
//mix and match class

class MixOrMatch {
    constructor(totalTime, cards) {
            this.cardsArray = cards;
            this.totalTime = totalTime;
            this.timeRemaining = totalTime;
            //set dynamically
            //timer
            this.timer = document.getElementById('time-remaining')
                //actual timer
            this.ticker = document.getElementById('flips');
            this.audioController = new AudioController();
        }
        //properties when game starts
    startGame() {
        //set tital sets
        this.totalClicks = 0;
        //time yo reset with new game
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500)
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    };
    //game over function
    gameOver() {
        clearInterval(this.countdown);
        //play gameover music
        this.audioController.gameOver();
        //gameover screen pops up
        document.getElementById('game-over-text').classList.add('visible');
    }
    victory() {
            clearInterval(this.countdown);
            //play victory music
            this.audioController.victory();
            //victory screen pops up
            document.getElementById('victory-text').classList.add('visible');
        }
        //loop through card array
    hideCards() {
            this.cardsArray.forEach(card => {
                card.classList.remove('visible');
                card.classList.remove('matched');
            });
        }
        //fli pcard function
    flipCard(card) {
        //check if card wheter of not they can flip the card
        if (this.canFlipCard(card)) {
            this.audioController.flip();
            //count number of flips
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            //flip the card
            card.classList.add('visible');
            //should we check for a match
            if (this.cardToCheck) {
                //check for match
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }
    checkForCardMatch(card) {
        //if card we clicked is same as src att

        if (this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if (this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }
    cardMismatch(card1, card2) {
            this.busy = true;
            setTimeout(() => {
                card1.classList.remove('visible');
                card2.classList.remove('visible');
                this.busy = false;
            }, 1000);
        }
        // Fisher-Yates Shuffle Algorithm.
    shuffleCards(cardsArray) {
        //loop backwards
        for (let i = cardsArray.length - 1; i > 0; i--) {
            //create int
            let randIndex = Math.floor(Math.random() * (i + 1));
            //not shuffel array, shuffel order of cards being displayed
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }
    getCardType(card) {
            return card.getElementsByClassName('card-value')[0].src;
        }
        //check if user can click card
    canFlipCard(card) {
        //boolean - if this busy if false and card is not included and card not equal to card to check 
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    //convert overlays and cards to an array
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(60, cards);
    //loop over overlays: this will alow you to click to start

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            //initialize game
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            //flip card
            game.flipCard(card);
        });
    });
}