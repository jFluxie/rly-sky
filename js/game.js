var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
}

Game.preload = function() {
    game.load.spritesheet('player', 'assets/sprites/touhou.png',64,64);
    game.load.image('space', 'assets/map/space.png');
    game.load.image('bullet', 'assets/sprites/purple_ball.png');
}

//var player;

var cursors;

var wasd;

var bullets;

var fireRate = 200;

var nextFire = 0;

Game.create = function(){

  Game.playerMap={};

  //CREATE MAP
  var space=game.add.sprite(0,0,'space');
  space.heigth=game.heigth;
  space.width=game.width;
  space.smoothed=false;

  Client.askNewPlayer();

  //CREATE PLAYER
  //player = game.add.sprite(50,50,'player',1);
  //game.physics.enable(player, Phaser.Physics.ARCADE);

  //CONTROLS
  cursors = game.input.keyboard.createCursorKeys();
  wasd = {
  up:game.input.keyboard.addKey(Phaser.Keyboard.W),
  down: game.input.keyboard.addKey(Phaser.Keyboard.S),
  left: game.input.keyboard.addKey(Phaser.Keyboard.A),
  right:game.input.keyboard.addKey(Phaser.Keyboard.D),

};



  //player.body.collideWorldBounds=true;

  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(50, 'bullet');
  bullets.setAll('checkWorldBounds', true);
  bullets.setAll('outOfBoundsKill', true);

}


Game.update = function(){

  //player.body.velocity.set(0);

  if (cursors.left.isDown || wasd.left.isDown)
    {
        Client.sendMove({x:-200});
        //player.body.velocity.x = -200;
    }
   if (cursors.right.isDown || wasd.right.isDown)
    {
        Client.sendMove({x:200});
        //player.body.velocity.x = 200;
    }
   if (cursors.up.isDown || wasd.up.isDown)
    {
        Client.sendMove({y:-200});
        //player.body.velocity.y = -200;
    }
   if (cursors.down.isDown || wasd.down.isDown)
    {
        Client.sendMove({y:200});
        //player.body.velocity.y = 200;
    }

    if (game.input.activePointer.isDown)
    {
        fire();
    }
}


Game.addNewPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(x,y,'player');
    game.physics.enable(Game.playerMap[id], Phaser.Physics.ARCADE);
    Game.playerMap[id].body.collideWorldBounds=true;
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

Game.movePlayer=function(id,x,y){
    Game.playerMap[id].body.velocity.set(0);
    if(x){
      Game.playerMap[id].body.velocity.x+=x;
    }
    if(y){
      Game.playerMap[id].body.velocity.y+=y;
    }


}

function fire() {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(player.x + 20, player.y + 30);

        game.physics.arcade.moveToPointer(bullet, 1000);
    }

}
