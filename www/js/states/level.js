var GAME = GAME || {};

GAME.Level = function() {};

/* Phaser */

GAME.Level.prototype.create = function() {
    this.game.stage.backgroundColor = 0x262626;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.checkCollision.down = false;

    /* Ball */
    this.balls = this.game.add.group();

    this.createBall();

    /* Paddle */
    this.paddle = this.game.add.sprite(this.game.world.width*0.5, this.game.world.height-100, 'paddle');
    this.paddle.anchor.set(0.5, 1);

    this.game.physics.enable(this.paddle, Phaser.Physics.ARCADE);
    this.paddle.body.immovable = true;

    this.scoreText = this.game.add.text(5, 5, 'Points: 0', { font: '18px Arial', fill: '#0095DD' });
    this.score = 0;
    this.lives = 3;

    this.livesText = this.game.add.text(this.game.world.width-5, 5, 'Lives: '+this.lives, { font: '18px Arial', fill: '#0095DD' });
    this.livesText.anchor.set(1,0);
    this.lifeLostText = this.game.add.text(this.game.world.width*0.5, this.game.world.height*0.5, 'Life lost, click to continue', { font: '18px Arial', fill: '#0095DD' });
    this.lifeLostText.anchor.set(0.5);
    this.lifeLostText.visible = false;

    this.playing = true;

    this.initBricks();

    this.walls = this.game.add.group();
    let wall = this.walls.create(0, 0, "tile:blank");
    wall.width = 10;
    wall.height = this.game.height - 100;
    wall.x = this.bricks.x - wall.width - 16;
    this.game.physics.enable(wall, Phaser.Physics.ARCADE);
    wall.body.immovable = true;

    wall = this.walls.create(0, 0, "tile:blank");
    wall.width = 10;
    wall.height = this.game.height - 100;
    wall.x = this.bricks.x + this.bricks.width - 16;   
    this.game.physics.enable(wall, Phaser.Physics.ARCADE);
    wall.body.immovable = true; 

    wall = this.walls.create(0, 0, "tile:blank");
    wall.width = this.bricks.width;
    wall.height = 10;
    wall.x = this.bricks.x - 16;
    wall.y = 0;
    this.game.physics.enable(wall, Phaser.Physics.ARCADE);
    wall.body.immovable = true;
};

GAME.Level.prototype.createBall = function() {
    let ball = this.balls.create(this.game.world.width*0.5, this.game.world.height-25, 'ball');
    ball.anchor.set(0.5);

    ball.animations.add('wobble', [0,1,0,2,0,1,0,2,0], 24);
   
    this.game.physics.enable(ball, Phaser.Physics.ARCADE);

    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(this.ballLeaveScreen, this);


    ball.body.bounce.set(1);

    ball.body.velocity.set(200, -200);
}

GAME.Level.prototype.initBricks = function() {
    this.levels = [
        [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ];

    let brickSize = {width:32, height:20};

    this.bricks = this.game.add.group();
    this.powerups = this.game.add.group();

    for(let y=0; y<this.levels.length; y++) {
        for(let x=0; x<this.levels[0].length; x++) {
            let brickX = (x*brickSize.width);
            let brickY = (y*brickSize.height);
            console.log(brickX + "x" + brickY);
            let brick = this.game.add.sprite(brickX, brickY, 'bricks');
            brick.frame = this.levels[y][x];
            this.game.physics.enable(brick, Phaser.Physics.ARCADE);
            brick.body.immovable = true;
            brick.anchor.set(0.5);
            this.bricks.add(brick);
        }
    }

    this.bricks.x = ((this.game.width - this.bricks.width) / 2) + (brickSize.width/2);

    console.log(this.bricks.x);
    //this.bricks.y = (300 - this.bricks.height) / 2;
    this.bricks.y = 20;
};

GAME.Level.prototype.update = function() {
  this.game.physics.arcade.collide(this.paddle, this.balls, this.ballHitPaddle, null, this);
  this.game.physics.arcade.collide(this.balls, this.bricks, this.ballHitBrick, null, this);
  this.game.physics.arcade.collide(this.paddle, this.powerups, this.paddleHitPowerup, null, this);
  this.game.physics.arcade.collide(this.balls, this.walls);

  if (this.playing) {
    let leftWall = this.walls.getChildAt(0);
    let rightWall = this.walls.getChildAt(1);
    this.paddle.x = Math.max(Math.min(rightWall.x-(this.paddle.width/2), this.game.input.x), leftWall.x + 10 + 16 + 10) || this.game.world.width*0.5;
  }
};

GAME.Level.prototype.ballLeaveScreen = function(ball) {
    this.balls.remove(ball);
    ball.destroy();

    console.log(this.balls.children.length);

    if (this.balls.children.length <= 0) {
        this.lives--;
        if(this.lives) {
            this.livesText.setText('Lives: '+this.lives);
            this.lifeLostText.visible = true;
            this.game.input.onDown.addOnce(function() {
                this.lifeLostText.visible = false;
                this.createBall();
            }, this);
        } else {
            alert('You lost, game over!');
            location.reload();
        }
    }
};

GAME.Level.prototype.ballHitPaddle = function(paddle, ball) {
    console.log(paddle);
    ball.animations.play('wobble');

    /* Get the speed at the current velocity */
    let speed = Math.sqrt(Math.pow(ball.body.velocity.x, 2) + Math.pow(ball.body.velocity.y, 2));
    
    /* Change the ball X velocity depending on where we hit the ball on the paddle */
    ball.body.velocity.x = -1*5*(paddle.x-ball.x);

    /* Adjust the Y velocity to keep the current speed (and increate is from .001) */
    ball.body.velocity.y = Math.sqrt(Math.pow(speed, 2) - Math.pow(ball.body.velocity.x, 2)) * -1.001;
}

GAME.Level.prototype.paddleHitPowerup = function(paddle, powerup) {
    powerup.kill();
    console.log("paddleHitPowerup");
    //this.createBall();
    //this.paddle.width -= 20;
};

GAME.Level.prototype.ballHitBrick = function(ball, brick) {
    var killTween = this.game.add.tween(brick.scale);
    killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(function(){
        brick.kill();
    }, this);
    killTween.start();

    this.score += 10;
    this.scoreText.setText('Points: '+this.score);

    var count_alive = 0;
    for (i = 0; i < this.bricks.children.length; i++) {
        if (this.bricks.children[i].alive == true) {
            count_alive++;
        }
    }
    if (count_alive == 0) {
        alert('You won the game, congratulations!');
        location.reload();
    }

    if (this.game.rnd.integerInRange(1, 10) >= 9) {
        let powerup = this.powerups.create(this.bricks.x + brick.x, this.bricks.y + brick.y, "bricks");
        this.game.physics.enable(powerup, Phaser.Physics.ARCADE);
        powerup.anchor.set(0.5);
        powerup.frame = 5;
        powerup.body.gravity.y = 150;
    }
}