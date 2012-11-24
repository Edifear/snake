(function( $, undefined ) {
    "use strict"

    $(document).ready(function(){

        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function(callback){
                    return window.setTimeout(callback, 1000 / 60);
                };
        })();

        window.cancelRequestAnimFrame = ( function() {
            return window.cancelAnimationFrame          ||
                window.webkitCancelRequestAnimationFrame    ||
                window.mozCancelRequestAnimationFrame       ||
                window.oCancelRequestAnimationFrame     ||
                window.msCancelRequestAnimationFrame        ||
                clearTimeout
        })();


        var canvas = $("#canvas")[0], //-- canvas == battlefield
            ctx = canvas.getContext("2d"), //-- context
            w = $("#canvas").width(), //-- width
            h = $("#canvas").height(), //-- height
            d, //-- direction
            food,
            foodSize = 15,
            score = 0,
            highScore = 0,
            play = false, //-- game status
            snake, //-- snake cells
            snakeSize = 5,
            speed = 2,
            img = new Image();

        function init() {
            play = true;
            snake = [];
            d = "right"; //-- default direction
            createSnake();
            createFood();
            score = 0;
            speed = 2;
            paint();
        }

    //-- create snake at top left position of battlefield
        function createSnake() {
            var length = 40; //-- snake start length
            for(var i = length-1; i>=0; i--) {
                snake.push({x: i+snakeSize+1, y:snakeSize+1}); //-- create start position
            }
        }

    //-- create the food at random position
        function createFood() {
            if (score % 5 != 0) {
                img.src = 'img/cake.ico';
            } else {
                img.src = 'img/ball.png';
            }


            food = {
                x: Math.round(Math.random()*(w-2*foodSize)),
                y: Math.round(Math.random()*(h-2*foodSize)),
                r: foodSize,
                img: img
            };
        }

    //-- paint snake
        function paint() {
            if (play == false) return
        //-- clear canvas before paint new frame
            ctx.clearRect(0, 0, w, h);
            ctx.save();

        //-- head cell
            var head = {
                x: snake[0].x,
                y: snake[0].y
            };

        //-- set new position of head
            if (play==true) {
                if(d == "up") head.y -= speed;
                else if(d == "down") head.y += speed;
                else if(d == "right") head.x += speed;
                else if(d == "left") head.x -= speed;
            }

        //-- stop game if collision with snake body or walls
            if(head.x <= snakeSize || head.x >= w-snakeSize || head.y <= snakeSize || head.y >= h-snakeSize || checkCollision(head.x, head.y, snake)) {
                stopPlay()
            }

        //-- make a new head when snake eats the food
            if(head.x <= food.x+food.r && head.x >= food.x-food.r && head.y <= food.y+food.r && head.y >= food.y-food.r) {
                var tail = {x: head.x, y: head.y};
                score += 1;
                //-- add another food
                createFood();
            } else {
                var tail = snake.pop(); //-- replace head cell by tail cell
                tail.x = head.x;
                tail.y = head.y;
            }
            if (score == (speed-2)*5+5) speed += 1;

            snake.unshift(tail); //-- puts back the tail as the first cell

            for(var i = 0; i < snake.length; i += 1) {
                var c = snake[i];
                drawCellCircle(c.x, c.y, snakeSize);
            }

        //-- paint food
            drawCellCircle(food.x, food.y, food.r, food.img);
        //-- paint the score
            ctx.fillStyle = "#ffffff";
            var scoreTxt ="HighScore: "+highScore+"; Lavel: "+(speed-1)+"; Score: " + score;
            ctx.font = 'italic bold 18px sans-serif';
            ctx.fillText(scoreTxt, 5, h-5);

            requestAnimFrame(function(){
                paint();
            });
        }

        function stopPlay () {
            if (play) {
                play = false;
                if (score > highScore) highScore = score;
            }
        }

        function drawCellCircle(x, y, r, img) {
            if (img) {
                ctx.drawImage(img, x-r, y-r, 2*r, 2*r);
                return;
            }
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI*2, true);
            ctx.fillStyle = "rgba(200, 100, 50, 1)";
            ctx.fill();
            ctx.fillStyle = '#933';
            ctx.closePath();
        }


    //-- check the match of 2 cells
        function checkCollision(x, y, array) {
            for(var i = 0; i < array.length; i++) {
                if(array[i].x == x && array[i].y == y) return true;
            }
            return false;
        }

        function playToggle() {
            if (play == false) {play=true} else {play=false}
        }

    //-- keyboard controls
        $(document).keydown(function(e){
            var key = e.which;

            if(key == "13" && !play) init();
            else if(key == "32" && play==true) play=false;
            else if(key == "37" && d != "right") d = "left";
            else if(key == "38" && d != "down") d = "up";
            else if(key == "39" && d != "left") d = "right";
            else if(key == "40" && d != "up") d = "down";
        })

        $('#start').on('click', function () {
            init();
        })
        $('#pause').on('click', function () {
            stopPlay();
        })


    });
})(jQuery);