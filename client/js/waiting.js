var waiting = function(game){
    var startTime;
};
waiting.prototype = { preload: preload, create: create, update: update};
    
function preload (){
     startTime = game.time.time;
     game.load.image('waitScreen', 'assets/pics/waitingScreen.png');
}

function create(){
    var background = game.add.sprite(0, 0, 'waitScreen');
}

function update(){
    if (gameData.get("allBack")){
        game.state.start('endOfDay');
    } else{
        wait();
    }
}

function wait(){
    if ((game.time.time-startTime)>5000){
        serverOps.debugEnd();
    }
}