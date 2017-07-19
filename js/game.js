var Game = {};

Game.init = function() {
    game.stage.disableVisibilityChange = true;
}

Game.preload = function() {
    game.load.spritesheet('player', 'assets/sprites/touhou.png', 64, 64);
    game.load.image('space', 'assets/map/space.png');
    game.load.image('bullet', 'assets/sprites/purple_ball.png');
}

//var player;

var cursors;

var wasd;

var bullets;

var fireRate = 200;

var nextFire = 0;

Game.create = function() {

    Game.playerMap = [];

    //CREATE MAP
    var space = game.add.sprite(0, 0, 'space');
    space.heigth = game.heigth;
    space.width = game.width;
    space.smoothed = false;

    Client.askNewPlayer();

    //CREATE PLAYER
    //player = game.add.sprite(50,50,'player',1);
    //game.physics.enable(player, Phaser.Physics.ARCADE);

    //CONTROLS
    cursors = game.input.keyboard.createCursorKeys();
    wasd = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D)
    };

    //player.body.collideWorldBounds=true;

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

}

Game.update = function() {

    checkCollisions();
    //game.physics.arcade.collide(Game.playerMap, bullets, handleCollisions);

    if (cursors.left.isDown || wasd.left.isDown) {
        Client.sendMove({x: -10});
    }
    if (cursors.right.isDown || wasd.right.isDown) {
        Client.sendMove({x: 10});
    }
    if (cursors.up.isDown || wasd.up.isDown) {
        Client.sendMove({y: -10});
    }
    if (cursors.down.isDown || wasd.down.isDown) {
        Client.sendMove({y: 10});
    }
    if (game.input.activePointer.isDown) {
          Client.sendBullet(game.input.mousePointer.x, game.input.mousePointer.y);
    }
}

Game.addNewPlayer = function(id, x, y) {
    Game.playerMap[id] = game.add.sprite(x, y, 'player');
    game.physics.enable(Game.playerMap[id], Phaser.Physics.ARCADE);
    Game.playerMap[id].body.collideWorldBounds = true;
    Game.playerMap[id].enableBody=true;
};

Game.removePlayer = function(id) {
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

Game.movePlayer = function(data) {

    if (data.d.x) {
        Game.playerMap[data.p.id].x += data.d.x;
    }
    if (data.d.y) {
        Game.playerMap[data.p.id].y += data.d.y;
    }

}

Game.shootBullet=function(data){
  if (game.time.now > nextFire && bullets.countDead() > 0) {
      nextFire = game.time.now + fireRate;
      var bullet = bullets.getFirstDead();

      var someX;
      var someY;


      //if crosshair is on the bottom
      if((Game.playerMap[data.p.id].y + Game.playerMap[data.p.id].body.height) < data.d.y){
        //around the middle of the player
        someX=Game.playerMap[data.p.id].x + 20;
        //below the player
        someY= (Game.playerMap[data.p.id].y +Game.playerMap[data.p.id].body.height + 4);
      }

      //if crosshair is on top
      else if(Game.playerMap[data.p.id].y > data.d.y){
        //around the middle of the player
        someX=Game.playerMap[data.p.id].x + 20;
        //on top of the player
        someY= (Game.playerMap[data.p.id].y - bullet.body.height - 4 );
      }

      //if crosshair is on the left
      else if(Game.playerMap[data.p.id].x > data.d.x){
        //around the middle of the player
        someY=Game.playerMap[data.p.id].y + 20;
        //left side
        someX= (Game.playerMap[data.p.id].x - bullet.body.width - 4 );
      }

      //if crosshair is on the right
      else if((Game.playerMap[data.p.id].x + Game.playerMap[data.p.id].body.width) < data.d.x){

        //around the middle of the player
        someY=Game.playerMap[data.p.id].y + 20;
        //left side
        someX= (Game.playerMap[data.p.id].x + Game.playerMap[data.p.id].body.width + 4 );

      }



  if(someX && someY){
    bullet.reset(someX, someY);
        game.physics.arcade.moveToXY(bullet, data.d.x, data.d.y, 1000);

  }

  }
}

function checkCollisions(){
    bullets.forEachAlive(bullet =>{
      Game.playerMap.forEach(player => {
        if(check(bullet, player)){
          bullet.kill();
        }
      });
    }, this);
}


function check(bullet, player){

    if(bullet.x > (player.x+player.body.width) || player.x > (bullet.x+bullet.body.width))
    {
      return false;
    }

    if(bullet.y > (player.y+player.body.height) || player.y > (bullet.y+bullet.body.height))
    {
      return false;
    }

    return true;


}
