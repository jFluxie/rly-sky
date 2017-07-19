var Client = {};
Client.socket = io.connect();

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
    console.log(data);
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }
});

Client.socket.on('remove',function(id){
    Game.removePlayer(id);
});

Client.socket.on('move2',function(data){
    Game.movePlayer(data);
});

Client.socket.on('bullet2',function(data){
    Game.shootBullet(data);
});

Client.sendMove=function(move){
    Client.socket.emit('move', move);
}

Client.sendBullet=function(x, y){
    var data={
      x:x,
      y:y
    };
    Client.socket.emit('bullet', data);
}
