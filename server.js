var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.lastPlayderID = 0; // Keep track of the last id assigned to a new player

server.listen(process.env.PORT || 3000,function(){
    console.log('Listening on '+server.address().port);
});

io.on('connection',function(socket){
    socket.on('newplayer',function(){
        socket.player = {
            id: server.lastPlayderID++,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };
        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('newplayer',socket.player);

        socket.on('move',function(data){
          //check if there are any collisions
          if(checkBoundaries(socket.player, data) && thereAreNoCollisions(socket.player, data)){

            if(data.x){
              socket.player.x+=data.x;
            }
            if(data.y){
              socket.player.y+=data.y;
            }
            var someData={
              p: socket.player,
              d: data
            };
            io.emit('move2', someData);
          }
          else{
          }
        });

        socket.on('resolution',function(data){
            socket.player.width=data.width;
            socket.player.height=data.height;
        });

        socket.on('bullet',function(data){
          //SIMULATION
          var someData={
            p: socket.player,
            d: data
          };
            io.emit('bullet2', someData);
        });

        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);
        });
    });
});


function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function thereAreNoCollisions(playerCheck, data){
  var players=getAllPlayers();
  for(var i=0;i<players.length;i++){
    if(players[i].id!==playerCheck.id){
        if(check(players[i],playerCheck, data)){
           return false;
        }
    }
  }
  return true;
}

function check(bullet, player, data) {

    var someX=0;
    var someY=0;

    if(data.x){
      someX=data.x;
    }
    if(data.y){
      someY=data.y;
    }
    console.log("Posicion actual : "+player.x+" ,"+player.y);
    console.log("Posicion a moverse : "+(player.x+someX)+" ,"+(player.y+someY));
    console.log("Posicion del otro man : "+(bullet.x)+" ,"+(bullet.y));
    console.log('\n');

    if (bullet.x > (player.x + 64 + someX) || (player.x + someX) > (bullet.x + 64)) {
        return false;
    }

    if (bullet.y > (player.y + 64 +someY) || (player.y +someY) > (bullet.y + 64)) {
        return false;
    }

    return true;

}

function checkBoundaries(player, data){
  var someX=0;
  var someY=0;

  if(data.x){
    someX=data.x;
  }
  if(data.y){
    someY=data.y;
  }

  if((0<= (player.x+someX)) && ((player.x+someX+64) <=player.width) &&  0<= (player.y+someY) && ((player.y+someY+64) <=player.height)){
    return true;
  }
  else{
    return false;
  }
}
