function Brick(game) {
    Phaser.Group.call(this, game);

    let background = this.create(0, 0, "tile:blank");
    background.width = 32;
    background.height = 20;
    background.tint = 0xffffff;

    let hover = this.create(0, 0, "hover");
    hover.alpha = 0.2;

    this.game.physics.enable(background, Phaser.Physics.ARCADE);
    background.body.immovable = true;
    background.anchor.set(0.5);
    hover.anchor.set(0.5);

};

Brick.prototype = Object.create(Phaser.Group.prototype);
Brick.prototype.constructor = Brick;