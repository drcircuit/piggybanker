/** piggybanker */
(function () {
    var scr, piggy, coins, frame, coinImg, score, maxCoins;

    function createCoin(img) {
        var x = Math.floor(Math.random() * scr.width) - img.width;
        if(x < 0){
            x = 0;
        }
        var y = 0;
        if (x > scr.width - coinImg.width) {
            x = scr.width - coinImg.width;
        }
        return {
            fall: function () {
                y = y + 2;
            },
            position: function () {
                return {x: x, y: y};
            },
            reset: function () {
                x = Math.floor(Math.random() * scr.width) - img.width;
                if(x < 0){
                    x = 0;
                }
                y = 0;
            },
            draw: function (ctx) {
                ctx.drawImage(img, x, y);
            },
            diff: function(piggy){
                var piggyPos = piggy.position();
                var diffY = piggyPos.y - y;
                var diffX = x - piggyPos.x + img.width;
                return {x: diffX, y: diffY};
            },
            collidesWith: function (piggy) {
                var piggyPos = piggy.position();
                var diffY = piggyPos.y - y;
                var diffX = x - piggyPos.x + img.width;
                return diffY < 2 && diffY >= -10 && diffX < piggy.width * 1.2 && diffX >= 10;
            }
        };
    }

    function createPiggy(startX, startY, img) {
        var x = startX;
        var y = startY;
        return {
            moveLeft: function () {
                x = x - 30;
                if (x < 0) {
                    x = 0;
                }
            },
            moveRight: function () {
                x = x + 30;
                if (x > scr.width - img.width) {
                    x = scr.width - img.width;
                }
            },
            position: function () {
                return {x: x, y: y};
            },
            draw: function (ctx) {
                ctx.drawImage(img, x, y);
            },
            width: img.width,
            height: img.height
        };
    }

    function printScore(ctx){
        var scoreBoard = "PIGGY BANK BALANCE: " + score + " NOK";
        ctx.textAlign = "right";
        ctx.font = "30px VT323";
        ctx.fillStyle = "#aaffff";
        ctx.fillText(scoreBoard,scr.width - 20, 35);
    }

    function draw() {
        scr.ctx.clearRect(0, 0, scr.width, scr.height);
        piggy.draw(scr.ctx);
        coins.forEach(function (coin, index) {
            coin.fall();
            if (coin.position().y > scr.height) {
                coin.reset();
                score --;
            }
            if (coin.collidesWith(piggy)) {
                score++;
                coin.reset();
            } else {

                coin.draw(scr.ctx);
            }
            printScore(scr.ctx);
        });


    }

    function move(keyCode) {
        if (keyCode === "ArrowLeft") {
            piggy.moveLeft();
        } else if (keyCode === "ArrowRight") {
            piggy.moveRight();
        } else if(keyCode === "plus"){
            maxCoins++;
        } else if(keyCode === "minus"){
            maxCoins--;
        }
    }

    function start() {
        draw();
        if (frame === 120) {
            if (coins.length < maxCoins) {
                coins.push(createCoin(coinImg));
            }
            frame = 0;
        }
        frame++;
        requestAnimationFrame(start);

    }

    function setup() {
        coins = [];
        frame = 0;
        score = 0;
        maxCoins = 2;
        setupWorld();
        window.addEventListener("keydown", function (e) {
            move(e.code);
        });


        loadAssets();

    }

    function setupWorld() {
        scr = dcl.setupScreen(800, 600);
        scr.setBgColor('blue');
        document.body.style.backgroundColor = "grey";
        scr.world.style.background = "url('img/background.png')";
    }

    function loadAssets() {
        var piggyImg = new Image();
        coinImg = new Image();
        piggyImg.addEventListener("load", function () {
            piggy = createPiggy(scr.width / 2, scr.height - 200, piggyImg);
            coinImg.src = "./img/coin.png";
        });
        coinImg.addEventListener("load", function () {
            coins.push(createCoin(coinImg));
            start();
        });
        piggyImg.src = "./img/piggie.png";
    }

    setup();
})();