var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype.preload = function() {
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
    this.preloadBar.anchor.set(0.5);
    this.load.setPreloadSprite(this.preloadBar);


    this.load.image('tile:blank', 'assets/images/blank.png');
    this.load.image('hover', 'assets/images/hover.png');
    //this.load.image('ball', 'assets/images/ball.png');
    this.game.load.spritesheet('ball', 'assets/images/wobble.png', 11, 11);
    this.game.load.spritesheet('bricks', 'assets/images/bricks.png', 32, 20);
    this.load.image('paddle', 'assets/images/paddle.png');
    this.load.image('brick', 'assets/images/brick.png');
};

GAME.Preload.prototype.create = function() {
    this.state.start("Level");
};
