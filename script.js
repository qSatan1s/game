var CardTypes = [{
        name: "stitch_teases",
        image: "assets/img/stitch_teases.png",
    },
    {
        name: "stitch_wary",
        image: "assets/img/stitch_wary.png",
    },
    {
        name: "stitch_glad",
        image: "assets/img/stitch_glad.png",
    },
    {
        name: "stitch_kiss",
        image: "assets/img/stitch_kiss.png",
    },
    {
        name: "stitch_love",
        image: "assets/img/stitch_love.png",
    },
    {
        name: "stitch_delight",
        image: "assets/img/stitch_delight.png",
    },
    {
        name: "stitch_baby",
        image: "assets/img/stitch_baby.png",
    },
    {
        name: "stitch_sad",
        image: "assets/img/stitch_sad.png",
    },
    {
        name: "stitch_hungry",
        image: "assets/img/stitch_hungry.png",
    },
    {
        name: "stitch_angry",
        image: "assets/img/stitch_angry.png",
    },
    {
        name: "stitch_crying",
        image: "assets/img/stitch_crying.png",
    },
    {
        name: "stitch_stop",
        image: "assets/img/stitch_stop.png",
    },
    {
        name: "stitch_sufferance",
        image: "assets/img/stitch_sufferance.png",
    },
    {
        name: "stitch_hit",
        image: "assets/img/stitch_hit.png",
    },
    {
        name: "stitch_confession",
        image: "assets/img/stitch_confession.png",
    },
    {
        name: "stitch_evil_plan",
        image: "assets/img/stitch_evil_plan.png",
    },
    {
        name: "stitch_goodbye",
        image: "assets/img/stitch_goodbye.png",
    },
    {
        name: "stitch_me",
        image: "assets/img/stitch_me.png",
    }

];

var shuffleCards = function shuffleCards() {
    var cards = [].concat(_.cloneDeep(CardTypes), _.cloneDeep(CardTypes));
    return _.shuffle(cards);
};

new Vue({
    el: "#app",

    data: {
        showSplash: false,
        cards: [],
        started: false,
        startTime: 0,
        flipBackTimer: null,
        timer: null,
        time: "--:--",
        score: 0
    },

    methods: {
        resetGame: function resetGame() {
            this.showSplash = false;
            var cards = shuffleCards();
            this.turns = 0;
            this.score = 0;
            this.started = false;
            this.startTime = 0;

            _.each(cards, function(card) {
                card.flipped = false;
                card.found = false;
            });

            this.cards = cards;
        },



        showModal: function showModal() {
            $("#info").fadeIn("slow");
        },

        flippedCards: function flippedCards() {
            return _.filter(this.cards, function(card) {
                return card.flipped;
            });
        },

        sameFlippedCard: function sameFlippedCard() {
            var flippedCards = this.flippedCards();
            if (flippedCards.length == 2) {
                if (flippedCards[0].name == flippedCards[1].name)
                    return true;
            }
        },

        capitalizeString: function capitalizeString(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },

        showInfoAboutFramework: function showInfoAboutFramework() {
            this.showModal();
            var flippedCard = this.flippedCards()[0];
            $("#info-title").html("Want to learn more about " + this.capitalizeString(flippedCard.name) + "?");
            $("#info-description").html(flippedCard.info);
            $("#info-image").attr("src", flippedCard.image);
        },

        setCardFounds: function setCardFounds() {
            _.each(this.cards, function(card) {
                if (card.flipped)
                    card.found = true;
            });
        },

        checkAllFound: function checkAllFound() {
            var foundCards = _.filter(this.cards, function(card) {
                return card.found;
            });
            if (foundCards.length == this.cards.length)
                return true;
        },

        startGame: function startGame() {
            var _this = this;
            this.started = true;
            this.startTime = moment();

            this.timer = setInterval(function() {
                _this.updateScore();
                _this.time = moment(moment().diff(_this.startTime)).format("mm:ss");
            }, 1000);
        },

        updateScore: function updateScore() {
            var elapsedTime = moment().diff(this.startTime, 'seconds');
            var score = 2000 - elapsedTime * 2 - this.turns * 10;
            this.score = Math.max(score, 0);
        },

        finishGame: function finishGame() {
            this.started = false;
            clearInterval(this.timer);
            this.updateScore();
            this.showSplash = true;
        },

        flipCard: function flipCard(card) {
            this.updateScore();
            var _this2 = this;
            if (card.found || card.flipped) return;

            if (!this.started) {
                this.startGame();
            }

            var flipCount = this.flippedCards().length;
            if (flipCount == 0) {
                card.flipped = !card.flipped;
            } else
            if (flipCount == 1) {
                card.flipped = !card.flipped;

                if (this.sameFlippedCard()) {
                    // Match!
                    this.showInfoAboutFramework();

                    this.flipBackTimer = setTimeout(function() {
                        _this2.clearFlipBackTimer();
                        _this2.setCardFounds();
                        _this2.clearFlips();

                        if (_this2.checkAllFound()) {
                            _this2.finishGame();
                        }

                    }, 200);
                } else {
                    // Wrong match
                    this.flipBackTimer = setTimeout(function() {
                        _this2.clearFlipBackTimer();
                        _this2.clearFlips();
                    }, 1000);
                }
            }
        },

        clearFlips: function clearFlips() {
            _.map(this.cards, function(card) {
                card.flipped = false;
            });
        },

        clearFlipBackTimer: function clearFlipBackTimer() {
            clearTimeout(this.flipBackTimer);
            this.flipBackTimer = null;
        }
    },

    created: function created() {
        this.resetGame();
    }
});

function start() {
    document.querySelector("#app").style.display = "block";
    document.querySelector("#start").style.display = "none";
}